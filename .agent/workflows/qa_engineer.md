---
description: QA Engineer workflow for test planning, automation, execution, and release certification
---

# QA Engineer Workflow

This workflow guides the process of ensuring software quality through structure testing, automated verification, and defect management.

## Phase 1: Test Planning

1.  **Requirement Analysis**
    *   Review PRD and User Stories.
    *   Identify "Testable" requirements and Acceptance Criteria.
    *   Flag ambiguous requirements early.

2.  **Test Strategy**
    *   Define Scope: What is In-Scope vs Out-of-Scope?
    *   Determine Test Levels: Unit, Integration, System, E2E.
    *   Identify Test Data requirements.
    *   Define Environment needs (Staging, Prod-like).

3.  **Test Plan Creation**
    *   Create a Master Test Plan document.
    *   Define Entry and Exit criteria for testing phases.
    *   Estimate testing effort and schedule.

## Phase 2: Test Design & Case Creation

4.  **Test Case Writing**
    *   **Positive Path**: Verify feature works as intended.
    *   **Negative Path**: Verify system handles invalid inputs/errors gracefully.
    *   **Edge Cases**: Boundaries, limits, null values, special characters.
    *   **Format**: ID, Description, Pre-conditions, Steps, Expected Result.

5.  **Test Data Preparation**
    *   Generate synthetic data.
    *   Anonymize production data (if used).
    *   create "Golden Data" sets for regression.

6.  **Traceability Matrix**
    *   Map Test Cases to User Stories/Requirements.
    *   Ensure 100% requirement coverage.

## Phase 3: Test Implementation (Automation)

7.  **Automation Framework Setup**
    *   Select tools (Playwright/Cypress for UI, Pytest/Jest for API).
    *   Implement Page Object Model (POM) for maintainability.
    *   Set up CI/CD integration (Github Actions).

8.  **scripting**
    *   Automate "Smoke Test" suite (critical path).
    *   Automate "Regression Suite" (stable features).
    *   *Note*: Avoid automating unstable/changing features.

9.  **Non-Functional Testing Setup**
    *   **Performance**: Load testing (k6, JMeter) for APIs.
    *   **Security**: Basic scans (OWASP ZAP) - collaborate with Security Engineer.
    *   **Accessibility**: Automated audits (Axe).

## Phase 4: Execution

10. **Smoke Testing**
    *   Run on every new build deployment.
    *   Verify basic health (Can login? Can load home page?).

11. **Functional / Regression Testing**
    *   Execute manual and automated test cases.
    *   Mark status: Pass, Fail, Blocked, Skipped.

12. **Exploratory Testing**
    *   Time-boxed sessions to find "unknown unknowns".
    *   Use heuristics and intuition to break the system.

## Phase 5: Defect Management

13. **Bug Reporting**
    *   **Title**: Clear summary of the issue.
    *   **Severity**: Blocker, Critical, Major, Minor.
    *   **Steps to Reproduce**: Exact actions to trigger the bug.
    *   **Evidence**: Screenshots, logs, screen recordings.
    *   **Environment**: Browser version, OS, generic/specific user.

14. **Bug Lifecycle**
    *   Triage -> Assign -> Fix -> Verify.
    *   **Verify Fix**: Confirm the bug is gone AND no regressions caused.

## Phase 6: Release & Certification

15. **Regression Run**
    *   Full pass of critical functionalities before code freeze.

16. **Release Sign-off**
    *   Provide "Go/No-Go" decision based on Exit Criteria.
    *   Generate Test Summary Report (Execution metrics, Open bug list).

17. **Post-Release Verification**
    *   Sanity check in Production (safe read-only tests).

## Integration with Other Roles

### → Product Manager (`/product_manager`)
*   Define "Definition of Done".
*   Prioritize bugs vs features.

### → Software Engineer
*   Advocate for "Testability" (e.g., adding `data-testid` attributes).
*   Review Unit Tests to ensure no overlap/gaps with QA tests.

## Best Practices
*   **Shift Left**: Start testing during the design phase (Static testing).
*   **Pyramid of Testing**: More Unit tests, fewer UI tests (UI tests are slow/flaky).
*   **Isolate Tests**: Tests should not depend on each other (atomic).
*   **Clean Up**: Tests should delete the data they create.

## Common Pitfalls
*   ❌ relying 100% on manual testing (not scalable).
*   ❌ Flaky tests (false positives destroy trust in automation).
*   ❌ Testing implementation details instead of behavior.
*   ❌ Leaving "trivial" bugs that accumulate into "Death by 1000 cuts".
