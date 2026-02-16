---
description: Security engineering workflow for threat modeling, security assessment, and secure system design
---

# Security Engineering Workflow

This workflow guides the process of building secure systems through threat modeling, security assessment, secure design, and continuous security validation.

## Phase 1: Security Requirements & Context

1. **Understand System Context**
   - Review system architecture and data flows
   - Identify system boundaries and trust boundaries
   - Document all external interfaces and integration points
   - Map data sources, storage, and transmission paths
   - Identify users, roles, and access patterns

2. **Define Security Requirements**
   - **Confidentiality**: What data must be protected from unauthorized access?
   - **Integrity**: What data must be protected from unauthorized modification?
   - **Availability**: What are the uptime and resilience requirements?
   - **Authentication**: How are users and systems identified?
   - **Authorization**: How are access controls enforced?
   - **Auditability**: What must be logged for compliance and forensics?

3. **Identify Compliance & Regulatory Requirements**
   - Determine applicable regulations:
     - GDPR (EU data protection)
     - HIPAA (healthcare data)
     - PCI DSS (payment card data)
     - SOC 2 (service organization controls)
     - ISO 27001 (information security management)
     - CCPA (California consumer privacy)
     - FedRAMP (US federal systems)
   - Document specific controls required by each regulation
   - Identify data residency and sovereignty requirements

4. **Classify Data & Assets**
   - Create data classification scheme (e.g., Public, Internal, Confidential, Restricted)
   - Classify all data types handled by the system
   - Identify sensitive data (PII, PHI, PCI, credentials, secrets)
   - Document data retention and deletion requirements
   - Map data to compliance requirements

## Phase 2: Threat Modeling

5. **Choose Threat Modeling Methodology**
   - **STRIDE** (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege)
   - **PASTA** (Process for Attack Simulation and Threat Analysis)
   - **Attack Trees** (hierarchical diagrams of attack paths)
   - **LINDDUN** (privacy threat modeling)

6. **Create Data Flow Diagrams (DFDs)**
   - Level 0: System context (external entities, system boundary)
   - Level 1: Major components and data flows
   - Level 2: Detailed component internals (for critical components)
   - Mark trust boundaries (where data crosses security zones)

7. **Identify Threats Using STRIDE**
   - For each component and data flow, ask:
     - **Spoofing**: Can an attacker impersonate a user or system?
     - **Tampering**: Can data be modified in transit or at rest?
     - **Repudiation**: Can a user deny performing an action?
     - **Information Disclosure**: Can sensitive data be exposed?
     - **Denial of Service**: Can the system be made unavailable?
     - **Elevation of Privilege**: Can a user gain unauthorized access?

8. **Assess & Prioritize Threats**
   - For each identified threat, calculate risk:
     - **Likelihood**: How easy is it to exploit? (Low/Medium/High)
     - **Impact**: What's the damage if exploited? (Low/Medium/High)
     - **Risk Score**: Likelihood × Impact
   - Prioritize threats by risk score
   - Use DREAD for detailed scoring (Damage, Reproducibility, Exploitability, Affected Users, Discoverability)

9. **Define Mitigations**
   - For each high/medium risk threat, define mitigation:
     - **Eliminate**: Remove the vulnerable feature
     - **Mitigate**: Implement controls to reduce risk
     - **Transfer**: Use third-party service or insurance
     - **Accept**: Document acceptance of residual risk
   - Document mitigation strategy and owner

10. **Create Threat Model Document**
    - System overview and architecture
    - Data flow diagrams with trust boundaries
    - Identified threats with risk scores
    - Mitigation strategies
    - Residual risks and acceptance decisions
    - Review and approval sign-offs

## Phase 3: Secure Architecture Design

11. **Design Authentication Architecture**
    - Choose authentication methods:
      - Username/password with strong password policy
      - Multi-factor authentication (MFA/2FA)
      - Single Sign-On (SSO) via SAML, OAuth2/OIDC
      - Certificate-based authentication
      - Biometric authentication
    - Design session management (tokens, cookies, expiration)
    - Implement account lockout and rate limiting
    - Plan for credential rotation and revocation

12. **Design Authorization Architecture**
    - Choose authorization model:
      - Role-Based Access Control (RBAC)
      - Attribute-Based Access Control (ABAC)
      - Policy-Based Access Control (PBAC)
    - Define roles, permissions, and policies
    - Implement principle of least privilege
    - Design for separation of duties
    - Plan for access reviews and recertification

13. **Design Data Protection**
    - **Encryption at Rest**:
      - Choose encryption algorithms (AES-256, ChaCha20)
      - Design key management (KMS, HSM, key rotation)
      - Encrypt databases, file systems, backups
    - **Encryption in Transit**:
      - Enforce TLS 1.2+ for all network communication
      - Use mutual TLS (mTLS) for service-to-service
      - Implement certificate management and rotation
    - **Data Masking & Tokenization**:
      - Mask sensitive data in logs and UI
      - Tokenize payment card data (PCI DSS)
      - Implement data anonymization for analytics

14. **Design Secrets Management**
    - Never hardcode secrets in code or config files
    - Use secrets management service (HashiCorp Vault, AWS Secrets Manager, Azure Key Vault)
    - Implement secret rotation
    - Audit secret access
    - Use short-lived credentials where possible

15. **Design Network Security**
    - Implement network segmentation (VPCs, subnets, security groups)
    - Use firewalls and Web Application Firewalls (WAF)
    - Implement DDoS protection
    - Design for zero-trust networking
    - Use private endpoints for internal services
    - Implement IP whitelisting where appropriate

16. **Design API Security**
    - Use API gateways for centralized security controls
    - Implement rate limiting and throttling
    - Validate and sanitize all inputs
    - Use API keys or OAuth2 for authentication
    - Implement CORS policies
    - Version APIs and deprecate insecure versions
    - Document API security requirements

17. **Design Logging & Monitoring**
    - Log security events:
      - Authentication attempts (success and failure)
      - Authorization decisions
      - Data access (especially sensitive data)
      - Configuration changes
      - Administrative actions
    - Implement centralized logging (SIEM)
    - Set up real-time alerting for security events
    - Ensure logs are tamper-proof and retained per compliance requirements
    - Implement log analysis and anomaly detection

## Phase 4: Secure Development

18. **Establish Secure Coding Standards**
    - Adopt OWASP Secure Coding Practices
    - Define language-specific security guidelines
    - Implement input validation and output encoding
    - Prevent common vulnerabilities:
      - SQL Injection (use parameterized queries)
      - Cross-Site Scripting (XSS) (sanitize output)
      - Cross-Site Request Forgery (CSRF) (use tokens)
      - Insecure Deserialization (validate input)
      - XML External Entities (XXE) (disable external entities)
      - Server-Side Request Forgery (SSRF) (validate URLs)

19. **Implement Security in CI/CD Pipeline**
    - **Static Application Security Testing (SAST)**:
      - Scan code for vulnerabilities (SonarQube, Checkmarx, Semgrep)
      - Fail builds on high-severity findings
    - **Software Composition Analysis (SCA)**:
      - Scan dependencies for known vulnerabilities (Snyk, Dependabot, OWASP Dependency-Check)
      - Enforce dependency update policies
    - **Secret Scanning**:
      - Scan code for hardcoded secrets (GitGuardian, TruffleHog)
      - Prevent commits with secrets
    - **Container Scanning**:
      - Scan container images for vulnerabilities (Trivy, Clair)
      - Use minimal base images
    - **Infrastructure as Code (IaC) Scanning**:
      - Scan Terraform, CloudFormation for misconfigurations (Checkov, tfsec)

20. **Conduct Code Reviews with Security Focus**
    - Include security checklist in code review process
    - Review authentication and authorization logic
    - Review data handling and encryption
    - Review input validation and error handling
    - Ensure secrets are not committed

## Phase 5: Security Testing

21. **Conduct Dynamic Application Security Testing (DAST)**
    - Use automated scanners (OWASP ZAP, Burp Suite)
    - Test running application for vulnerabilities
    - Test authentication and session management
    - Test for injection vulnerabilities
    - Test for security misconfigurations

22. **Perform Penetration Testing**
    - Engage external penetration testers
    - Define scope and rules of engagement
    - Test for OWASP Top 10 vulnerabilities
    - Test for business logic flaws
    - Test for privilege escalation
    - Document findings and remediation plan

23. **Conduct Security Architecture Review**
    - Review architecture against threat model
    - Validate security controls are implemented
    - Review network architecture and segmentation
    - Review data flows and encryption
    - Review access controls and authentication
    - Document gaps and remediation plan

24. **Perform Vulnerability Assessment**
    - Scan infrastructure for vulnerabilities (Nessus, Qualys)
    - Scan web applications (Acunetix, Netsparker)
    - Prioritize vulnerabilities by severity (CVSS score)
    - Create remediation plan with timelines
    - Track remediation progress

## Phase 6: Compliance & Audit

25. **Map Controls to Compliance Requirements**
    - Create compliance matrix mapping controls to requirements
    - Document evidence for each control
    - Identify gaps and create remediation plan

26. **Prepare for Audit**
    - Gather evidence (policies, procedures, logs, screenshots)
    - Prepare system documentation
    - Conduct internal audit or pre-assessment
    - Remediate findings before external audit

27. **Conduct Security Audit**
    - Engage external auditor (for SOC 2, ISO 27001, etc.)
    - Provide requested evidence
    - Address auditor questions and findings
    - Obtain audit report and certification

28. **Implement Continuous Compliance**
    - Automate compliance checks where possible
    - Monitor controls continuously
    - Conduct regular internal audits
    - Keep documentation up to date
    - Track compliance posture over time

## Phase 7: Incident Response & Recovery

29. **Create Incident Response Plan**
    - Define incident severity levels
    - Define roles and responsibilities (incident commander, communications, technical lead)
    - Document incident response procedures:
      1. Detection and analysis
      2. Containment
      3. Eradication
      4. Recovery
      5. Post-incident review
    - Create communication templates (internal, customer, regulatory)
    - Define escalation paths

30. **Set Up Security Monitoring & Alerting**
    - Implement Security Information and Event Management (SIEM)
    - Configure alerts for security events:
      - Failed authentication attempts
      - Privilege escalation
      - Unusual data access patterns
      - Configuration changes
      - Malware detection
    - Define alert response procedures
    - Conduct regular alert tuning

31. **Conduct Incident Response Drills**
    - Simulate security incidents (tabletop exercises)
    - Test incident response procedures
    - Validate communication channels
    - Identify gaps and improve procedures
    - Train incident response team

32. **Implement Backup & Disaster Recovery**
    - Define Recovery Time Objective (RTO) and Recovery Point Objective (RPO)
    - Implement automated backups
    - Encrypt backups
    - Store backups in separate location/account
    - Test backup restoration regularly
    - Document disaster recovery procedures

## Phase 8: Continuous Security Improvement

33. **Track Security Metrics**
    - Vulnerability metrics:
      - Mean Time to Detect (MTTD)
      - Mean Time to Remediate (MTTR)
      - Number of open vulnerabilities by severity
    - Compliance metrics:
      - Compliance score
      - Number of audit findings
      - Time to remediate findings
    - Incident metrics:
      - Number of incidents
      - Incident severity distribution
      - Time to contain and resolve

34. **Conduct Regular Security Reviews**
    - Quarterly security architecture review
    - Annual threat model update
    - Regular penetration testing (at least annually)
    - Continuous vulnerability scanning
    - Regular access reviews

35. **Stay Current with Security Landscape**
    - Monitor security advisories (CVEs, vendor bulletins)
    - Track OWASP Top 10 and other threat intelligence
    - Participate in security communities
    - Attend security conferences and training
    - Update threat models with new attack vectors

36. **Foster Security Culture**
    - Conduct security awareness training for all employees
    - Run phishing simulations
    - Recognize and reward security-conscious behavior
    - Make security everyone's responsibility
    - Share security wins and lessons learned

## Best Practices

- **Security by Design**: Integrate security from the start, not as an afterthought
- **Defense in Depth**: Implement multiple layers of security controls
- **Least Privilege**: Grant minimum access necessary
- **Fail Securely**: Ensure failures don't compromise security
- **Assume Breach**: Design for detection and response, not just prevention
- **Automate Security**: Use tools to scale security practices
- **Document Everything**: Policies, procedures, decisions, incidents
- **Communicate Clearly**: Translate security risks to business impact

## Common Pitfalls to Avoid

- ❌ Treating security as a one-time activity instead of continuous process
- ❌ Ignoring security in favor of speed to market
- ❌ Relying solely on perimeter security (firewalls)
- ❌ Storing secrets in code or configuration files
- ❌ Insufficient logging and monitoring
- ❌ Not testing incident response procedures
- ❌ Ignoring third-party and supply chain risks
- ❌ Poor communication of security risks to stakeholders

## Security Checklist (Pre-Production)

- [ ] Threat model completed and reviewed
- [ ] Authentication and authorization implemented and tested
- [ ] All data encrypted in transit (TLS 1.2+) and at rest
- [ ] Secrets managed via secrets management service
- [ ] Input validation and output encoding implemented
- [ ] Security logging and monitoring configured
- [ ] SAST, SCA, and secret scanning integrated in CI/CD
- [ ] DAST and penetration testing completed
- [ ] Vulnerability assessment completed and high/critical issues remediated
- [ ] Security architecture review completed
- [ ] Incident response plan documented and tested
- [ ] Backup and disaster recovery tested
- [ ] Compliance requirements validated
- [ ] Security documentation completed
- [ ] Security training provided to team

## Key Security Frameworks & Standards

- **OWASP Top 10**: Most critical web application security risks
- **NIST Cybersecurity Framework**: Identify, Protect, Detect, Respond, Recover
- **CIS Controls**: Prioritized set of security best practices
- **MITRE ATT&CK**: Knowledge base of adversary tactics and techniques
- **ISO 27001**: Information security management system standard
- **SOC 2**: Service organization controls for security, availability, confidentiality
- **PCI DSS**: Payment card industry data security standard
- **GDPR**: EU General Data Protection Regulation
