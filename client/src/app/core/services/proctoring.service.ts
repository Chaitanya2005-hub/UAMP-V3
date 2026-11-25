import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ActiveProctorSession {
  studentId: string;
  studentName: string;
  erpId: string;
  department: string;
  examId: string;
  warningCount: number;
  frame: string | null;
  currentQuestion: number;
  lastUpdated: string;
  status: string;
  flagged?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProctoringService {
  private apiUrl = `${environment.apiUrl}/proctor`;

  warningCount = signal<number>(0);
  isWebcamActive = signal<boolean>(false);
  isCameraMuted = signal<boolean>(false);
  webcamError = signal<string | null>(null);
  availableCameras = signal<MediaDeviceInfo[]>([]);
  selectedDeviceId = signal<string>(localStorage.getItem('uamp_camera_id') || '');
  activeCameraLabel = signal<string>('');
  mediaStream: MediaStream | null = null;
  securityLogs = signal<string[]>([]);

  // Audio / Noise Monitoring Signals
  isAudioActive = signal<boolean>(false);
  audioError = signal<string | null>(null);
  audioLevel = signal<number>(0);
  noiseWarningCount = signal<number>(0);
  noiseWarningActive = signal<boolean>(false);
  private audioStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private audioAnalyser: AnalyserNode | null = null;
  private audioMonitorInterval: any = null;
  private consecutiveLoudSamples: number = 0;
  private lastNoiseWarningAt: number = 0;

  constructor(private http: HttpClient) {}

  async refreshCameras(): Promise<MediaDeviceInfo[]> {
    if (!navigator.mediaDevices?.enumerateDevices) return [];
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cams = devices.filter(d => d.kind === 'videoinput');
      this.availableCameras.set(cams);
      return cams;
    } catch {
      return [];
    }
  }

  async startWebcam(deviceId?: string, includeAudio: boolean = false): Promise<MediaStream | null> {
    this.stopWebcam();
    this.webcamError.set(null);
    this.isCameraMuted.set(false);
    this.activeCameraLabel.set('');

    if (deviceId !== undefined) {
      this.selectedDeviceId.set(deviceId);
      if (deviceId) {
        localStorage.setItem('uamp_camera_id', deviceId);
      } else {
        localStorage.removeItem('uamp_camera_id');
      }
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const msg = window.isSecureContext
        ? 'Camera API is not supported in this browser.'
        : 'Camera access requires HTTPS or http://localhost (insecure origin blocked by browser).';
      this.webcamError.set(msg);
      this.isWebcamActive.set(false);
      return null;
    }

    try {
      this.mediaStream = await this.requestCameraStream(this.selectedDeviceId(), includeAudio);
      const videoTrack = this.mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        this.activeCameraLabel.set(videoTrack.label || 'Default Camera');
        this.isCameraMuted.set(videoTrack.muted);
        const settings = videoTrack.getSettings?.();
        if (settings?.deviceId) {
          this.selectedDeviceId.set(settings.deviceId);
        }
        videoTrack.onmute = () => this.isCameraMuted.set(true);
        videoTrack.onunmute = () => this.isCameraMuted.set(false);
        videoTrack.onended = () => {
          this.isWebcamActive.set(false);
          this.webcamError.set('Camera stream was disconnected.');
        };
      }
      this.isWebcamActive.set(true);
      await this.refreshCameras();

      if (includeAudio) {
        const audioTracks = this.mediaStream.getAudioTracks();
        if (audioTracks.length > 0) {
          this.setupAudioAnalyser(new MediaStream(audioTracks));
        } else {
          await this.startAudioMonitor();
        }
      }

      return this.mediaStream;
    } catch (err: any) {
      console.warn('WebCam access declined or unavailable:', err);
      this.isWebcamActive.set(false);
      this.webcamError.set(this.formatWebcamError(err));
      if (includeAudio) {
        await this.startAudioMonitor();
      }
      return null;
    }
  }

  private async requestCameraStream(preferredDeviceId?: string, includeAudio: boolean = false): Promise<MediaStream> {
    const requestWithAudioFallback = async (videoConstraint: MediaTrackConstraints | boolean): Promise<MediaStream> => {
      if (!includeAudio) {
        return await navigator.mediaDevices.getUserMedia({ video: videoConstraint, audio: false });
      }
      try {
        return await navigator.mediaDevices.getUserMedia({ video: videoConstraint, audio: true });
      } catch (err: any) {
        // If audio fails (e.g. no mic or mic permission blocked), still try video-only
        if (err?.name === 'NotFoundError' || err?.name === 'NotAllowedError' || err?.name === 'NotReadableError') {
          return await navigator.mediaDevices.getUserMedia({ video: videoConstraint, audio: false });
        }
        throw err;
      }
    };

    if (preferredDeviceId) {
      try {
        return await requestWithAudioFallback({ deviceId: { exact: preferredDeviceId }, width: { ideal: 640 }, height: { ideal: 480 } });
      } catch (err: any) {
        if (err?.name !== 'OverconstrainedError' && err?.name !== 'NotFoundError') {
          throw err;
        }
      }
    }

    try {
      return await requestWithAudioFallback({ facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } });
    } catch (err: any) {
      if (err?.name === 'OverconstrainedError' || err?.name === 'ConstraintNotSatisfiedError') {
        return await requestWithAudioFallback(true);
      }
      throw err;
    }
  }

  private formatWebcamError(err: any): string {
    const name = err?.name || '';
    if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
      return 'Camera permission denied. Allow camera access in your browser site settings and retry.';
    }
    if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
      return 'No camera device found on this system.';
    }
    if (name === 'NotReadableError' || name === 'TrackStartError') {
      return 'Camera is currently in use by another application or browser tab. Close it and retry.';
    }
    return err?.message || 'Unable to access camera.';
  }

  async attachStreamToVideo(videoEl: HTMLVideoElement | null | undefined, stream: MediaStream | null): Promise<boolean> {
    if (!videoEl || !stream) return false;
    videoEl.muted = true;
    videoEl.playsInline = true;
    videoEl.autoplay = true;
    videoEl.srcObject = stream;
    try {
      await videoEl.play();
      return true;
    } catch (err) {
      console.warn('Video playback start failed:', err);
      return false;
    }
  }

  stopWebcam(): void {
    this.stopAudioMonitor();
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => {
        track.onended = null;
        track.onmute = null;
        track.onunmute = null;
        track.stop();
      });
      this.mediaStream = null;
    }
    this.isWebcamActive.set(false);
    this.isCameraMuted.set(false);
  }

  async startAudioMonitor(): Promise<boolean> {
    this.stopAudioMonitor();
    this.audioError.set(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.audioError.set('Microphone API is not supported in this browser.');
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      this.audioStream = stream;
      return this.setupAudioAnalyser(stream);
    } catch (err: any) {
      const name = err?.name || '';
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        this.audioError.set('Microphone permission denied. Allow mic access to enable noise monitoring.');
      } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
        this.audioError.set('No microphone device found.');
      } else {
        this.audioError.set(err?.message || 'Unable to access microphone.');
      }
      this.isAudioActive.set(false);
      return false;
    }
  }

  private setupAudioAnalyser(stream: MediaStream): boolean {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) {
        this.audioError.set('Web Audio API is not supported in this browser.');
        return false;
      }

      const ctx: AudioContext = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.75;
      source.connect(analyser);

      this.audioContext = ctx;
      this.audioAnalyser = analyser;
      this.isAudioActive.set(true);
      this.audioError.set(null);

      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.onended = () => {
          this.isAudioActive.set(false);
          this.audioLevel.set(0);
          this.audioError.set('Microphone was disconnected.');
        };
      }

      const dataArray = new Uint8Array(analyser.fftSize);
      this.audioMonitorInterval = setInterval(() => {
        if (!this.audioAnalyser) return;
        this.audioAnalyser.getByteTimeDomainData(dataArray);

        let sumSquares = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const normalized = (dataArray[i] - 128) / 128;
          sumSquares += normalized * normalized;
        }
        const rms = Math.sqrt(sumSquares / dataArray.length);
        const level = Math.min(100, Math.round(rms * 300));
        this.audioLevel.set(level);

        // Sustained noise (>= 25) for ~600ms OR loud spike (>= 45)
        if (level >= 45) {
          this.consecutiveLoudSamples = 3;
        } else if (level >= 25) {
          this.consecutiveLoudSamples++;
        } else {
          this.consecutiveLoudSamples = Math.max(0, this.consecutiveLoudSamples - 1);
        }

        if (this.consecutiveLoudSamples >= 3) {
          this.consecutiveLoudSamples = 0;
          const now = Date.now();
          // 10-second cooldown between noise warnings
          if (now - this.lastNoiseWarningAt >= 10000) {
            this.lastNoiseWarningAt = now;
            this.triggerNoiseWarning(level);
          }
        }
      }, 200);

      return true;
    } catch (err: any) {
      this.audioError.set('Failed to initialize audio noise monitor.');
      this.isAudioActive.set(false);
      return false;
    }
  }

  private triggerNoiseWarning(level: number): void {
    const nextCount = this.noiseWarningCount() + 1;
    this.noiseWarningCount.set(nextCount);
    this.noiseWarningActive.set(true);
    const timestamp = new Date().toLocaleTimeString();
    this.securityLogs.update(logs => [
      ...logs,
      `[${timestamp}] Audio Warning #${nextCount}: Background noise / speech detected (Level ${level}% — Non-terminating)`
    ]);
  }

  dismissNoiseWarning(): void {
    this.noiseWarningActive.set(false);
  }

  stopAudioMonitor(): void {
    if (this.audioMonitorInterval) {
      clearInterval(this.audioMonitorInterval);
      this.audioMonitorInterval = null;
    }
    if (this.audioContext) {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
    this.audioAnalyser = null;
    if (this.audioStream) {
      this.audioStream.getTracks().forEach(track => {
        track.onended = null;
        track.stop();
      });
      this.audioStream = null;
    }
    this.isAudioActive.set(false);
    this.audioLevel.set(0);
    this.consecutiveLoudSamples = 0;
  }

  incrementWarning(reason: string): number {
    const nextCount = this.warningCount() + 1;
    this.warningCount.set(nextCount);
    const timestamp = new Date().toLocaleTimeString();
    this.securityLogs.update(logs => [...logs, `[${timestamp}] Strike #${nextCount}: ${reason}`]);
    return nextCount;
  }

  resetWarnings(): void {
    this.warningCount.set(0);
    this.noiseWarningCount.set(0);
    this.noiseWarningActive.set(false);
    this.lastNoiseWarningAt = 0;
    this.securityLogs.set([]);
  }

  sendFrameStream(examId: string, frameDataUrl: string | null, currentQ: number = 1): Observable<any> {
    return this.http.post(`${this.apiUrl}/stream`, {
      examId,
      frame: frameDataUrl,
      warningCount: this.warningCount(),
      noiseWarningCount: this.noiseWarningCount(),
      currentQuestion: currentQ,
      status: this.warningCount() >= 3 ? 'TERMINATED_VIOLATION' : 'ACTIVE'
    });
  }

  getActiveSessions(): Observable<ActiveProctorSession[]> {
    return this.http.get<ActiveProctorSession[]>(`${this.apiUrl}/active-sessions`);
  }

  sendProctorWarning(studentId: string, message: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-warning`, { studentId, message });
  }

  flagStudent(studentId: string, reason?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/flag`, { studentId, reason });
  }

  terminateSession(studentId: string, reason?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/terminate`, { studentId, reason });
  }

  clearProctorMessages(): Observable<any> {
    return this.http.post(`${this.apiUrl}/clear-messages`, {});
  }
}
