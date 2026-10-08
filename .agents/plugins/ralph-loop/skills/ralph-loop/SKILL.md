---
name: ralph-loop
description: Continuous self-healing execution loop inspired by Ralph Wiggum / Ralph Loop. Systematically cycles through Inspect -> Modify -> Execute -> Diagnose -> Remediate -> Verify until zero errors remain.
---

# 🔄 Ralph Loop: Autonomous Self-Healing Execution Engine

The **Ralph Loop** skill is an iterative, autonomous self-healing loop designed to bring codebases from broken or unverified states to 100% clean compilation and test success.

---

## 🔁 The Ralph Loop Cycle

1. **Inspect & Target**: Identify errors, broken tests, or missing implementations.
2. **Modify & Implement**: Apply precise code modifications across files.
3. **Execute & Test**: Run `npx tsc`, `ng build`, or test suites immediately.
4. **Diagnose**: Parse stdout/stderr logs directly to pinpoint exact line failures.
5. **Remediate**: Apply root-cause fixes without patching symptoms.
6. **Repeat**: Loop back to step 3 until the build/test suite passes with 0 errors.
