const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const QRCode = require('qrcode');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'uamp_super_secret_jwt_key_2026';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ==========================================
// SEED DATA STORAGE (In-Memory Database)
// ==========================================

const users = [
  {
    id: 'u-std-101',
    username: 'student',
    password: 'password123',
    fullName: 'Aarav Sharma',
    role: 'STUDENT',
    erpId: 'ERP2026-CS-042',
    year: '3rd Year',
    department: 'Computer Science & Engineering',
    section: 'CS-A',
    photoPath: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    approvalStatus: 'APPROVED'
  },
  {
    id: 'u-std-102',
    username: 'priya',
    password: 'password123',
    fullName: 'Priya Verma',
    role: 'STUDENT',
    erpId: 'ERP2026-CS-089',
    year: '3rd Year',
    department: 'Computer Science & Engineering',
    section: 'CS-B',
    photoPath: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
    approvalStatus: 'APPROVED'
  },
  {
    id: 'u-std-103',
    username: 'rohan',
    password: 'password123',
    fullName: 'Rohan Patel',
    role: 'STUDENT',
    erpId: 'ERP2026-EE-012',
    year: '2nd Year',
    department: 'Electrical Engineering',
    section: 'EE-A',
    photoPath: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    approvalStatus: 'APPROVED'
  },
  {
    id: 'u-tch-201',
    username: 'teacher',
    password: 'password123',
    fullName: 'Dr. Vikramaditya Roy',
    role: 'TEACHER',
    erpId: 'FAC2026-CS-001',
    year: 'N/A',
    department: 'Computer Science & Engineering',
    section: 'All',
    photoPath: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256',
    approvalStatus: 'APPROVED'
  },
  {
    id: 'u-adm-301',
    username: 'admin',
    password: 'password123',
    fullName: 'Dean Administration',
    role: 'ADMIN',
    erpId: 'ADM2026-HQ-001',
    year: 'N/A',
    department: 'University Administration',
    section: 'HQ',
    photoPath: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256',
    approvalStatus: 'APPROVED'
  }
];

const subjects = [
  { id: 'sub-1', name: 'Database Management Systems', code: 'CS301', department: 'Computer Science' },
  { id: 'sub-2', name: 'Artificial Intelligence & ML', code: 'CS302', department: 'Computer Science' },
  { id: 'sub-3', name: 'Computer Networks & Security', code: 'CS303', department: 'Computer Science' },
  { id: 'sub-4', name: 'Data Structures & Algorithms', code: 'CS201', department: 'Computer Science' },
  { id: 'sub-5', name: 'Control Systems Engineering', code: 'EE204', department: 'Electrical' }
];

const exams = [
  {
    id: 'ex-101',
    title: 'DBMS Mid-Semester Proctored Examination 2026',
    subjectId: 'sub-1',
    subjectName: 'Database Management Systems',
    examDate: '2026-10-15',
    startTime: '10:00 AM',
    durationMinutes: 45,
    status: 'SCHEDULED'
  },
  {
    id: 'ex-102',
    title: 'AI & Neural Networks Final Evaluation',
    subjectId: 'sub-2',
    subjectName: 'Artificial Intelligence & ML',
    examDate: '2026-10-07',
    startTime: '02:00 PM',
    durationMinutes: 30,
    status: 'ONGOING'
  },
  {
    id: 'ex-103',
    title: 'Computer Networks Diagnostic Assessment',
    subjectId: 'sub-3',
    subjectName: 'Computer Networks & Security',
    examDate: '2026-10-01',
    startTime: '11:00 AM',
    durationMinutes: 60,
    status: 'COMPLETED'
  }
];

const questions = [
  {
    id: 'q-1',
    examId: 'ex-101',
    questionText: 'Which normal form eliminates partial functional dependency in relational databases?',
    optionA: 'First Normal Form (1NF)',
    optionB: 'Second Normal Form (2NF)',
    optionC: 'Third Normal Form (3NF)',
    optionD: 'Boyce-Codd Normal Form (BCNF)',
    correctAnswer: 'B'
  },
  {
    id: 'q-2',
    examId: 'ex-101',
    questionText: 'What does the ACID property "Isolation" guarantee in SQL transactions?',
    optionA: 'Transactions are committed to non-volatile storage permanently',
    optionB: 'Database remains consistent before and after execution',
    optionC: 'Concurrent execution of transactions leaves database in same state as if executed sequentially',
    optionD: 'All operations inside transaction complete fully or not at all',
    correctAnswer: 'C'
  },
  {
    id: 'q-3',
    examId: 'ex-101',
    questionText: 'Which index structure uses balanced trees where all leave nodes are at the same depth and connected in a doubly-linked list?',
    optionA: 'Binary Search Tree',
    optionB: 'B+ Tree Index',
    optionC: 'Hash Index',
    optionD: 'AVL Tree Index',
    correctAnswer: 'B'
  },
  {
    id: 'q-4',
    examId: 'ex-102',
    questionText: 'Which algorithm is widely used for supervised training of Multi-Layer Perceptron neural networks?',
    optionA: 'K-Means Clustering',
    optionB: 'Backpropagation Gradient Descent',
    optionC: 'A* Search',
    optionD: 'Minimax Algorithm with Alpha-Beta Pruning',
    correctAnswer: 'B'
  },
  {
    id: 'q-5',
    examId: 'ex-102',
    questionText: 'What non-linear activation function maps real numbers into the output range (0, 1)?',
    optionA: 'ReLU (Rectified Linear Unit)',
    optionB: 'Sigmoid Activation',
    optionC: 'Softmax Activation',
    optionD: 'Leaky ReLU',
    correctAnswer: 'B'
  },
  {
    id: 'q-6',
    examId: 'ex-102',
    questionText: 'In natural language processing, what transformer mechanism computes direct context weights between all token pairs?',
    optionA: 'Recurrent Hidden State Loop',
    optionB: 'Convolutional Pooling',
    optionC: 'Self-Attention Mechanism',
    optionD: 'Residual Skip Connection',
    correctAnswer: 'C'
  }
];

const results = [
  {
    id: 'res-1',
    studentId: 'u-std-101',
    examId: 'ex-103',
    examTitle: 'Computer Networks Diagnostic Assessment',
    score: 26,
    totalMarks: 30,
    percentage: 86.6,
    status: 'PASSED',
    securityWarnings: ['0 tab switches recorded during proctored session']
  }
];

const attendanceRecords = [
  { id: 'att-1', studentId: 'u-std-101', date: '2026-10-07', time: '09:15 AM', subject: 'DBMS', status: 'PRESENT' },
  { id: 'att-2', studentId: 'u-std-101', date: '2026-10-06', time: '10:00 AM', subject: 'AI & ML', status: 'PRESENT' },
  { id: 'att-3', studentId: 'u-std-102', date: '2026-10-07', time: '09:16 AM', subject: 'DBMS', status: 'PRESENT' },
  { id: 'att-4', studentId: 'u-std-103', date: '2026-10-07', time: '09:00 AM', subject: 'Control Systems', status: 'ABSENT' }
];

const admitCards = [
  {
    id: 'ac-101',
    studentId: 'u-std-101',
    studentName: 'Aarav Sharma',
    erpId: 'ERP2026-CS-042',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    status: 'RELEASED',
    issueDate: '2026-10-01',
    remarks: 'Approved by Dean Office. Clearance verified.'
  },
  {
    id: 'ac-102',
    studentId: 'u-std-102',
    studentName: 'Priya Verma',
    erpId: 'ERP2026-CS-089',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    status: 'RELEASED',
    issueDate: '2026-10-01',
    remarks: 'Approved by Accounts & Academic Branch.'
  },
  {
    id: 'ac-103',
    studentId: 'u-std-103',
    studentName: 'Rohan Patel',
    erpId: 'ERP2026-EE-012',
    department: 'Electrical Engineering',
    year: '2nd Year',
    status: 'BLOCKED',
    issueDate: '2026-10-01',
    remarks: 'Blocked due to pending semester fee dues (₹18,500).'
  }
];

const fees = [
  {
    id: 'fee-101',
    studentId: 'u-std-101',
    studentName: 'Aarav Sharma',
    erpId: 'ERP2026-CS-042',
    department: 'Computer Science & Engineering',
    totalAmount: 65000,
    paidAmount: 65000,
    status: 'PAID',
    approvalStatus: 'APPROVED',
    transactionId: 'TXN982341029',
    paymentDate: '2026-09-15'
  },
  {
    id: 'fee-102',
    studentId: 'u-std-102',
    studentName: 'Priya Verma',
    erpId: 'ERP2026-CS-089',
    department: 'Computer Science & Engineering',
    totalAmount: 65000,
    paidAmount: 40000,
    status: 'PARTIAL',
    approvalStatus: 'APPROVED',
    transactionId: 'TXN882103941',
    paymentDate: '2026-09-20'
  },
  {
    id: 'fee-103',
    studentId: 'u-std-103',
    studentName: 'Rohan Patel',
    erpId: 'ERP2026-EE-012',
    department: 'Electrical Engineering',
    totalAmount: 65000,
    paidAmount: 46500,
    status: 'PARTIAL',
    approvalStatus: 'PENDING',
    transactionId: 'TXN771092834',
    paymentDate: '2026-10-05'
  }
];

const notices = [
  {
    id: 'not-1',
    title: 'Mid-Semester Examination Schedule & Anti-Cheat Proctoring Rules',
    message: 'All 3rd Year CSE & EE students must complete WebCam verification prior to taking online mid-semester proctored exams. A 3-strike tab switch rule is strictly enforced.',
    postedBy: 'Academic Controller Office',
    postedDate: '2026-10-05'
  },
  {
    id: 'not-2',
    title: 'Semester Tuition Fee Clearance Deadline Extended',
    message: 'Students with pending dues must clear outstanding fee balances or submit payment approval requests to receive Hall Ticket release for upcoming exams.',
    postedBy: 'Finance & Accounts Branch',
    postedDate: '2026-10-04'
  }
];

const grievances = [
  {
    id: 'grv-1',
    studentId: 'u-std-101',
    studentName: 'Aarav Sharma',
    category: 'Admit Card & Fees',
    description: 'Fee payment receipt updated in portal but status shows partial instead of fully cleared.',
    status: 'RESOLVED',
    submittedDate: '2026-10-02',
    resolutionNotes: 'Verified with accounts bank statement. Updated to PAID.'
  },
  {
    id: 'grv-2',
    studentId: 'u-std-103',
    studentName: 'Rohan Patel',
    category: 'Exam Technical Issue',
    description: 'Experienced webcam permission delay during mock proctoring test.',
    status: 'PENDING',
    submittedDate: '2026-10-06',
    resolutionNotes: null
  }
];

// Active live proctoring sessions store (In-Memory map)
// Map<studentId, { studentId, studentName, erpId, department, examId, warningCount, frame, currentQuestion, lastUpdated, status, proctorMessages }>
const activeProctoringSessions = new Map();

// Seed initial active proctoring candidate camera feeds for live faculty demo
activeProctoringSessions.set('u-std-101', {
  studentId: 'u-std-101',
  studentName: 'Aarav Sharma',
  erpId: 'ERP2026-CS-042',
  department: 'Computer Science & Engineering',
  examId: 'ex-101',
  warningCount: 0,
  frame: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  currentQuestion: 3,
  lastUpdated: new Date().toLocaleTimeString(),
  status: 'ACTIVE',
  proctorMessages: []
});

activeProctoringSessions.set('u-std-102', {
  studentId: 'u-std-102',
  studentName: 'Priya Verma',
  erpId: 'ERP2026-CS-089',
  department: 'Computer Science & Engineering',
  examId: 'ex-101',
  warningCount: 1,
  frame: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
  currentQuestion: 5,
  lastUpdated: new Date().toLocaleTimeString(),
  status: 'ACTIVE',
  proctorMessages: []
});

// Active dynamic QR code store
let currentLiveCode = {
  code: '8492',
  qrDataUrl: '',
  createdAt: Date.now(),
  expiresAt: Date.now() + 60000
};

// Generate initial QR code
async function refreshLiveCode() {
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  const timestamp = Date.now();
  const qrText = `UAMP-ATTENDANCE-CODE:${code}:${timestamp}`;
  try {
    const qrDataUrl = await QRCode.toDataURL(qrText, { margin: 1, width: 300 });
    currentLiveCode = {
      code,
      qrDataUrl,
      createdAt: timestamp,
      expiresAt: timestamp + 60000
    };
  } catch (err) {
    console.error('Error generating QR code', err);
  }
}
refreshLiveCode();
setInterval(refreshLiveCode, 10000); // refresh every 10s for live host

// ==========================================
// MIDDLEWARE
// ==========================================

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized access. Token required.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden access. Invalid or expired token.' });
    req.user = user;
    next();
  });
};

// ==========================================
// Active Email OTP Store (In-Memory Map<email, { otp, expiresAt }>)
const activeOtpStore = new Map();

// REST API ENDPOINTS
// ==========================================

// Auth
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username.toLowerCase() === (username || '').toLowerCase());

  if (!user || user.password !== password) {
    return res.status(400).json({ message: 'Invalid username or password.' });
  }

  if (user.approvalStatus === 'PENDING') {
    return res.status(403).json({ message: 'Your account registration is pending Admin approval. Please contact University Administration to activate your account.' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role, fullName: user.fullName },
    JWT_SECRET,
    { expiresIn: '12h' }
  );

  const { password: _, ...userWithoutPass } = user;
  res.json({ token, user: userWithoutPass });
});

app.post('/api/auth/send-otp', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Please provide a valid email address.' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins

  activeOtpStore.set(email.toLowerCase(), { otp, expiresAt });
  console.log(`📧 [EMAIL OTP DISPATCH] Sent 6-Digit OTP: ${otp} to ${email}`);

  res.json({
    success: true,
    message: `6-Digit Verification OTP sent to ${email} (Valid for 5 minutes).`,
    otp // Returned for easy instant testing & verification
  });
});

app.post('/api/auth/verify-otp-register', (req, res) => {
  const { username, email, otp, password, fullName, role, department, year, section } = req.body;

  if (!username || !email || !otp || !password || !fullName) {
    return res.status(400).json({ message: 'All registration fields and OTP are required.' });
  }

  if (role === 'ADMIN') {
    return res.status(400).json({ message: 'Admin account creation is restricted. Only Student and Faculty/Teacher self-registrations are permitted.' });
  }

  const normalizedEmail = email.toLowerCase();
  const storedRecord = activeOtpStore.get(normalizedEmail);

  if (!storedRecord || storedRecord.otp !== otp || Date.now() > storedRecord.expiresAt) {
    return res.status(400).json({ message: 'Invalid or expired Email Verification OTP. Please request a new OTP.' });
  }

  // Check existing user
  const existing = users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (existing) {
    return res.status(400).json({ message: 'Username is already registered. Please choose another username or sign in.' });
  }

  const userRole = role || 'STUDENT';
  const newUser = {
    id: `u-${userRole.toLowerCase().slice(0, 3)}-${Date.now()}`,
    username,
    password,
    fullName,
    role: userRole,
    erpId: `ERP2026-${Math.floor(100 + Math.random() * 900)}`,
    year: year || '1st Year',
    department: department || 'Computer Science & Engineering',
    section: section || 'Sec-A',
    photoPath: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256',
    approvalStatus: 'PENDING'
  };

  users.push(newUser);
  activeOtpStore.delete(normalizedEmail);

  const { password: _, ...userWithoutPass } = newUser;
  res.status(201).json({
    success: true,
    pendingApproval: true,
    user: userWithoutPass,
    message: 'Account registered & verified via OTP! Your account is pending Admin approval before you can sign in.'
  });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const { password: _, ...userWithoutPass } = user;
  res.json(userWithoutPass);
});

// Exams
app.get('/api/exams', authenticateToken, (req, res) => {
  res.json(exams);
});

app.post('/api/exams/schedule', authenticateToken, (req, res) => {
  const { title, subjectId, examDate, startTime, durationMinutes } = req.body;
  const subject = subjects.find(s => s.id === subjectId);
  const newExam = {
    id: `ex-${Date.now()}`,
    title: title || 'New Proctored Examination',
    subjectId: subjectId || 'sub-1',
    subjectName: subject ? subject.name : 'General Subject',
    examDate: examDate || new Date().toISOString().split('T')[0],
    startTime: startTime || '10:00 AM',
    durationMinutes: Number(durationMinutes) || 60,
    status: 'SCHEDULED'
  };
  exams.push(newExam);
  res.status(201).json(newExam);
});

app.get('/api/exams/:id/questions', authenticateToken, (req, res) => {
  const examId = req.params.id;
  const examQuestions = questions.filter(q => q.examId === examId);
  
  // If no questions exist for this exam, generate default proctored questions
  if (examQuestions.length === 0) {
    const defaultQs = [
      {
        id: `q-${Date.now()}-1`,
        examId,
        questionText: 'What is the primary function of an Operating System Kernel?',
        optionA: 'To manage system hardware resources and facilitate program execution',
        optionB: 'To provide a graphical desktop user interface',
        optionC: 'To compile high level source code into machine binaries',
        optionD: 'To format solid-state storage devices',
        correctAnswer: 'A'
      },
      {
        id: `q-${Date.now()}-2`,
        examId,
        questionText: 'In computer networking, which TCP/IP layer handles end-to-end reliable transmission and port numbers?',
        optionA: 'Application Layer',
        optionB: 'Transport Layer (TCP/UDP)',
        optionC: 'Internet / IP Layer',
        optionD: 'Data Link Layer',
        correctAnswer: 'B'
      },
      {
        id: `q-${Date.now()}-3`,
        examId,
        questionText: 'What is the time complexity of searching for an element in a balanced Binary Search Tree (AVL)?',
        optionA: 'O(1)',
        optionB: 'O(N)',
        optionC: 'O(log N)',
        optionD: 'O(N log N)',
        correctAnswer: 'C'
      }
    ];
    questions.push(...defaultQs);
    return res.json(defaultQs);
  }
  res.json(examQuestions);
});

app.post('/api/exams/:id/submit', authenticateToken, (req, res) => {
  const examId = req.params.id;
  const { answers, warningCount, securityLogs } = req.body; // answers: { questionId: selectedOption }
  const studentId = req.user.id;
  const exam = exams.find(e => e.id === examId) || { title: 'Online Examination' };

  const examQuestions = questions.filter(q => q.examId === examId);
  let score = 0;
  let totalMarks = examQuestions.length * 10;
  if (totalMarks === 0) totalMarks = 30;

  examQuestions.forEach(q => {
    if (answers && answers[q.id] === q.correctAnswer) {
      score += 10;
    }
  });

  const percentage = Math.round((score / totalMarks) * 100);
  const status = percentage >= 40 ? 'PASSED' : 'FAILED';
  
  const warningsList = securityLogs || [];
  if (warningCount > 0) {
    warningsList.push(`${warningCount} tab-switch / focus loss violation(s) recorded.`);
  }

  const resultObj = {
    id: `res-${Date.now()}`,
    studentId,
    examId,
    examTitle: exam.title,
    score,
    totalMarks,
    percentage,
    status,
    securityWarnings: warningsList.length ? warningsList : ['Clean session — No integrity violations.']
  };

  // Replace old result if present
  const existingIdx = results.findIndex(r => r.studentId === studentId && r.examId === examId);
  if (existingIdx !== -1) {
    results[existingIdx] = resultObj;
  } else {
    results.push(resultObj);
  }

  // Clear active proctoring session
  activeProctoringSessions.delete(studentId);

  res.json(resultObj);
});

// Live WebCam Proctoring & Monitoring
app.post('/api/proctor/stream', authenticateToken, (req, res) => {
  const { examId, frame, warningCount, status, currentQuestion } = req.body;
  const student = users.find(u => u.id === req.user.id);
  
  if (student) {
    const existing = activeProctoringSessions.get(student.id);
    const messages = existing ? existing.proctorMessages || [] : [];

    activeProctoringSessions.set(student.id, {
      studentId: student.id,
      studentName: student.fullName,
      erpId: student.erpId,
      department: student.department,
      examId: examId || 'ex-101',
      warningCount: warningCount || 0,
      frame: frame || null,
      currentQuestion: currentQuestion || 1,
      lastUpdated: new Date().toLocaleTimeString(),
      status: status || 'ACTIVE',
      proctorMessages: messages
    });
  }

  // Return unread proctor messages if any
  const session = activeProctoringSessions.get(req.user.id);
  const unreadMessages = session ? session.proctorMessages || [] : [];
  res.json({ success: true, timestamp: Date.now(), messages: unreadMessages });
});

app.get('/api/proctor/active-sessions', authenticateToken, (req, res) => {
  const sessions = Array.from(activeProctoringSessions.values());
  res.json(sessions);
});

app.post('/api/proctor/send-warning', authenticateToken, (req, res) => {
  const { studentId, message } = req.body;
  const session = activeProctoringSessions.get(studentId);
  if (session) {
    if (!session.proctorMessages) session.proctorMessages = [];
    session.proctorMessages.push({
      id: `msg-${Date.now()}`,
      sender: req.user.fullName || 'Proctor Control',
      text: message,
      timestamp: new Date().toLocaleTimeString()
    });
    return res.json({ success: true, message: 'Warning dispatched to student live interface.' });
  }
  res.status(404).json({ message: 'Active student proctor session not found.' });
});

app.post('/api/proctor/clear-messages', authenticateToken, (req, res) => {
  const session = activeProctoringSessions.get(req.user.id);
  if (session) {
    session.proctorMessages = [];
  }
  res.json({ success: true });
});

// Gemini AI Question Generator
app.post('/api/teacher/auto-generate-questions', authenticateToken, async (req, res) => {
  const { examId, count = 3, topicFocus = 'General Computing', difficultyLevel = 'MEDIUM' } = req.body;

  // AI Fallback Question Generator function
  const generateFallbackQuestions = () => {
    const topic = topicFocus || 'Database Management';
    const num = Number(count) || 3;
    const generated = [];

    const pool = [
      {
        questionText: `What is a fundamental index property in ${topic} for speeding up query retrieval?`,
        optionA: 'B+ Tree indexing allows O(log N) lookup time for range and point queries',
        optionB: 'Sequential scanning of all disk blocks without cache',
        optionC: 'Disabling transaction logs during insert operations',
        optionD: 'Denormalizing all database tables into single flat files',
        correctAnswer: 'A'
      },
      {
        questionText: `In ${topic}, how is concurrency control maintained under high write load?`,
        optionA: 'Exclusive locks combined with Two-Phase Locking (2PL) protocol',
        optionB: 'Deleting all indices before executing update statements',
        optionC: 'Executing all requests synchronously on a single CPU thread',
        optionD: 'Ignoring foreign key constraints during batch operations',
        correctAnswer: 'A'
      },
      {
        questionText: `Which architectural pattern in ${topic} ensures high availability and horizontal scalability?`,
        optionA: 'Primary-Replica Replication with Read Splitting',
        optionB: 'Single point server with local storage mount',
        optionC: 'Unencrypted memory buffer without persistence',
        optionD: 'Synchronous polling on flat JSON files',
        correctAnswer: 'A'
      },
      {
        questionText: `What key metric is monitored during optimal execution planning in ${topic}?`,
        optionA: 'Estimated I/O Disk Cost and CPU Execution Cycles',
        optionB: 'Number of comments in SQL query text',
        optionC: 'Font size of database management UI',
        optionD: 'Ethernet cable length connecting client to server',
        correctAnswer: 'A'
      },
      {
        questionText: `Under ${difficultyLevel} level constraints in ${topic}, what mechanism handles deadlock resolution?`,
        optionA: 'Wait-For Graph Cycle Detection and Transaction Rollback',
        optionB: 'Terminating the entire database server process',
        optionC: 'Retrying the locked query infinitely',
        optionD: 'Increasing CPU clock frequency automatically',
        correctAnswer: 'A'
      }
    ];

    for (let i = 0; i < num; i++) {
      const template = pool[i % pool.length];
      const newQ = {
        id: `q-ai-${Date.now()}-${i + 1}`,
        examId: examId || 'ex-101',
        questionText: `[AI Generated - ${difficultyLevel}] ${template.questionText}`,
        optionA: template.optionA,
        optionB: template.optionB,
        optionC: template.optionC,
        optionD: template.optionD,
        correctAnswer: template.correctAnswer
      };
      generated.push(newQ);
      questions.push(newQ);
    }
    return generated;
  };

  // If Gemini API Key exists in environment, try calling Google Gemini API v1beta
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Generate ${count} multiple choice questions on the topic "${topicFocus}" with difficulty "${difficultyLevel}". Return ONLY a JSON array with objects containing keys: questionText, optionA, optionB, optionC, optionD, correctAnswer (A, B, C, or D).`
            }]
          }]
        })
      });
      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        const jsonMatch = rawText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const added = parsed.map((item, idx) => {
            const q = {
              id: `q-gemini-${Date.now()}-${idx}`,
              examId: examId || 'ex-101',
              questionText: item.questionText,
              optionA: item.optionA,
              optionB: item.optionB,
              optionC: item.optionC,
              optionD: item.optionD,
              correctAnswer: item.correctAnswer || 'A'
            };
            questions.push(q);
            return q;
          });
          return res.json({ source: 'GEMINI_API', questions: added });
        }
      }
    } catch (e) {
      console.warn('Gemini API call failed, using smart fallback generator:', e.message);
    }
  }

  // Graceful Fallback Generator
  const generatedQuestions = generateFallbackQuestions();
  res.json({ source: 'FALLBACK_GENERATOR', questions: generatedQuestions });
});

// Dynamic QR Code Attendance
app.get('/api/teacher/qr-code', authenticateToken, (req, res) => {
  res.json({
    code: currentLiveCode.code,
    qrDataUrl: currentLiveCode.qrDataUrl,
    createdAt: currentLiveCode.createdAt,
    expiresAt: currentLiveCode.expiresAt
  });
});

app.post('/api/student/attendance/mark', authenticateToken, (req, res) => {
  const { code, qrToken } = req.body;
  const studentId = req.user.id;

  const inputCode = code || (qrToken ? qrToken.split(':')[1] : null);

  if (inputCode !== currentLiveCode.code) {
    return res.status(400).json({ message: 'Invalid or expired QR Attendance Code. Please scan current host code.' });
  }

  const existing = attendanceRecords.find(a => a.studentId === studentId && a.date === new Date().toISOString().split('T')[0]);
  if (existing) {
    existing.status = 'PRESENT';
    return res.json({ message: 'Attendance updated successfully!', record: existing });
  }

  const newRecord = {
    id: `att-${Date.now()}`,
    studentId,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString(),
    subject: 'DBMS / General Lecture',
    status: 'PRESENT'
  };
  attendanceRecords.push(newRecord);
  res.json({ message: 'Attendance marked successfully!', record: newRecord });
});

app.get('/api/student/attendance/my-history', authenticateToken, (req, res) => {
  const records = attendanceRecords.filter(a => a.studentId === req.user.id);
  res.json(records);
});

// Admit Cards
app.get('/api/admin/admit-cards', authenticateToken, (req, res) => {
  res.json(admitCards);
});

app.get('/api/student/admit-card/me', authenticateToken, (req, res) => {
  let card = admitCards.find(a => a.studentId === req.user.id);
  if (!card) {
    const student = users.find(u => u.id === req.user.id);
    card = {
      id: `ac-${Date.now()}`,
      studentId: req.user.id,
      studentName: student ? student.fullName : 'Student Name',
      erpId: student ? student.erpId : 'ERP2026-CS-000',
      department: student ? student.department : 'Computer Science',
      year: student ? student.year : '3rd Year',
      status: 'RELEASED',
      issueDate: new Date().toISOString().split('T')[0],
      remarks: 'Standard Admit Card Issued.'
    };
    admitCards.push(card);
  }
  res.json(card);
});

app.post('/api/admin/admit-cards/:studentId/status', authenticateToken, (req, res) => {
  const studentId = req.params.studentId;
  const { status, remarks } = req.body;
  
  let card = admitCards.find(a => a.studentId === studentId);
  if (card) {
    card.status = status;
    if (remarks) card.remarks = remarks;
  } else {
    const student = users.find(u => u.id === studentId);
    card = {
      id: `ac-${Date.now()}`,
      studentId,
      studentName: student ? student.fullName : 'Student',
      erpId: student ? student.erpId : 'ERP2026-00',
      department: student ? student.department : 'Engineering',
      year: student ? student.year : '3rd Year',
      status: status || 'RELEASED',
      issueDate: new Date().toISOString().split('T')[0],
      remarks: remarks || 'Updated by Administrator.'
    };
    admitCards.push(card);
  }
  res.json(card);
});

// Fees
app.get('/api/fees/my-status', authenticateToken, (req, res) => {
  let fee = fees.find(f => f.studentId === req.user.id);
  if (!fee) {
    const student = users.find(u => u.id === req.user.id);
    fee = {
      id: `fee-${Date.now()}`,
      studentId: req.user.id,
      studentName: student ? student.fullName : 'Student Name',
      erpId: student ? student.erpId : 'ERP2026-CS-000',
      department: student ? student.department : 'Computer Science',
      totalAmount: 65000,
      paidAmount: 65000,
      status: 'PAID',
      approvalStatus: 'APPROVED',
      transactionId: `TXN${Math.floor(100000000 + Math.random() * 900000000)}`,
      paymentDate: new Date().toISOString().split('T')[0]
    };
    fees.push(fee);
  }
  res.json(fee);
});

app.get('/api/admin/fees', authenticateToken, (req, res) => {
  res.json(fees);
});

app.post('/api/admin/fees/edit', authenticateToken, (req, res) => {
  const { studentId, totalAmount, paidAmount } = req.body;
  let fee = fees.find(f => f.studentId === studentId);
  if (fee) {
    fee.totalAmount = Number(totalAmount);
    fee.paidAmount = Number(paidAmount);
    if (fee.paidAmount >= fee.totalAmount) {
      fee.status = 'PAID';
    } else if (fee.paidAmount > 0) {
      fee.status = 'PARTIAL';
    } else {
      fee.status = 'PENDING';
    }
  }
  res.json(fee);
});

app.post('/api/admin/fees/:id/approve', authenticateToken, (req, res) => {
  const feeId = req.params.id;
  const { approvalStatus } = req.body; // APPROVED or DISAPPROVED
  let fee = fees.find(f => f.id === feeId);
  if (fee) {
    fee.approvalStatus = approvalStatus;
    // Automatically update admit card status if approved
    if (approvalStatus === 'APPROVED' && fee.paidAmount >= fee.totalAmount) {
      let card = admitCards.find(a => a.studentId === fee.studentId);
      if (card) {
        card.status = 'RELEASED';
        card.remarks = 'Admit Card auto-released following fee clearance approval.';
      }
    }
  }
  res.json(fee);
});

// Users
app.get('/api/users', authenticateToken, (req, res) => {
  const sanitized = users.map(({ password, ...u }) => u);
  res.json(sanitized);
});

app.post('/api/users', authenticateToken, (req, res) => {
  const { username, password, fullName, role, erpId, department, year, section } = req.body;
  const newUser = {
    id: `u-${role.toLowerCase().slice(0, 3)}-${Date.now()}`,
    username,
    password: password || 'password123',
    fullName,
    role,
    erpId: erpId || `ERP2026-${Math.floor(100 + Math.random() * 900)}`,
    year: year || '1st Year',
    department: department || 'Engineering',
    section: section || 'Sec-A',
    photoPath: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256',
    approvalStatus: 'APPROVED'
  };
  users.push(newUser);
  const { password: _, ...userWithoutPass } = newUser;
  res.status(201).json(userWithoutPass);
});

app.post('/api/users/:id/approve', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (user) {
    user.approvalStatus = 'APPROVED';
  }
  res.json({ message: 'User account approved successfully', user });
});

app.delete('/api/users/:id', authenticateToken, (req, res) => {
  const idx = users.findIndex(u => u.id === req.params.id);
  if (idx !== -1) {
    users.splice(idx, 1);
  }
  res.json({ message: 'User deleted successfully' });
});

// Subjects
app.get('/api/subjects', authenticateToken, (req, res) => {
  res.json(subjects);
});

app.post('/api/subjects', authenticateToken, (req, res) => {
  const { name, code, department } = req.body;
  const newSub = { id: `sub-${Date.now()}`, name, code, department };
  subjects.push(newSub);
  res.status(201).json(newSub);
});

// Results
app.get('/api/results/my-results', authenticateToken, (req, res) => {
  const userResults = results.filter(r => r.studentId === req.user.id);
  res.json(userResults);
});

app.get('/api/results/all', authenticateToken, (req, res) => {
  res.json(results);
});

// Grievances
app.get('/api/grievances', authenticateToken, (req, res) => {
  if (req.user.role === 'STUDENT') {
    return res.json(grievances.filter(g => g.studentId === req.user.id));
  }
  res.json(grievances);
});

app.post('/api/grievances', authenticateToken, (req, res) => {
  const { category, description } = req.body;
  const student = users.find(u => u.id === req.user.id);
  const newGrievance = {
    id: `grv-${Date.now()}`,
    studentId: req.user.id,
    studentName: student ? student.fullName : 'Student',
    category: category || 'Academic',
    description,
    status: 'PENDING',
    submittedDate: new Date().toISOString().split('T')[0],
    resolutionNotes: null
  };
  grievances.push(newGrievance);
  res.status(201).json(newGrievance);
});

app.put('/api/grievances/:id/status', authenticateToken, (req, res) => {
  const { status, resolutionNotes } = req.body;
  const grv = grievances.find(g => g.id === req.params.id);
  if (grv) {
    grv.status = status;
    if (resolutionNotes) grv.resolutionNotes = resolutionNotes;
  }
  res.json(grv);
});

// Notices
app.get('/api/notices', (req, res) => {
  res.json(notices);
});

app.post('/api/notices', authenticateToken, (req, res) => {
  const { title, message } = req.body;
  const newNotice = {
    id: `not-${Date.now()}`,
    title,
    message,
    postedBy: req.user.fullName || 'Admin Office',
    postedDate: new Date().toISOString().split('T')[0]
  };
  notices.push(newNotice);
  res.status(201).json(newNotice);
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 UAMP REST API Backend running on http://localhost:${PORT}`);
});
