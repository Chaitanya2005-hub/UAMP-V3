---
name: coderabbit
description: AI Code Reviewer & Security Auditor inspired by CodeRabbit. Performs deep code analysis, security scans (OWASP Top 10), performance auditing, architectural verification, and structured PR reviews.
---

# 🐇 CodeRabbit: AI Code Review & Security Auditor

The **CodeRabbit** skill performs automated, enterprise-grade code reviews, security audits, diff analysis, and performance optimization checks across codebases.

---

## 🔍 Code Review Pillars

### 1. 🛡️ Security & Vulnerability Audit
- **OWASP Top 10 Scans**: Detect SQL Injection risks, XSS vectors, broken authentication, hardcoded secrets, insecure API endpoints, and CSRF vulnerabilities.
- **Input Validation**: Verify that user inputs are sanitized and parameterized before DB or shell execution.

### 2. ⚡ Performance & Resource Management
- **Memory & Resource Leaks**: Identify unclosed subscriptions, orphaned event listeners, unhandled promises, and non-cancelled intervals/timeouts.
- **Database / API Efficiency**: Check for N+1 query patterns, excessive payload sizes, and missing indexing hints.

### 3. 📐 Architectural & Code Health
- **Type Safety**: Enforce strict TypeScript / Java / C# typing; flag loose `any` casts or unhandled null/undefined dereferences.
- **API Contract Verification**: Ensure modified signatures update all call sites across the application.
