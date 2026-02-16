---
description: Architecture design workflow for system design, technical decisions, and architectural documentation
---

# Architecture Workflow

This workflow guides the process of designing system architecture, making technical decisions, and documenting architectural patterns.

## Phase 1: Requirements Analysis & Context Gathering

1. **Understand Business Requirements**
   - Review user stories, product requirements, and business objectives
   - Identify functional and non-functional requirements (performance, scalability, security, compliance)
   - Document constraints (budget, timeline, technology stack, team expertise)

2. **Analyze Current System State**
   - Review existing architecture documentation
   - Identify current pain points, technical debt, and bottlenecks
   - Map dependencies between components and external systems
   - Document current data flows and integration points

3. **Identify Stakeholders & Success Criteria**
   - List all stakeholders (engineering, product, security, operations)
   - Define measurable success criteria (latency targets, throughput, availability SLAs)
   - Establish architectural principles and decision-making framework

## Phase 2: Architecture Design

4. **Define System Boundaries & Context**
   - Create a C4 Context diagram showing system boundaries
   - Identify external systems, users, and integration points
   - Document data sources and sinks

5. **Design High-Level Architecture**
   - Choose architectural style (microservices, monolith, event-driven, serverless, etc.)
   - Define major components and their responsibilities
   - Create a C4 Container diagram showing major building blocks
   - Design data architecture (databases, caching layers, message queues)

6. **Design Component Architecture**
   - Break down containers into components
   - Define interfaces and contracts between components
   - Create a C4 Component diagram for critical containers
   - Design API contracts (REST, GraphQL, gRPC, etc.)

7. **Design Data Flow & Integration Patterns**
   - Map data flows between components
   - Choose integration patterns (synchronous vs asynchronous, pub/sub, request/reply)
   - Design event schemas and message formats
   - Plan for data consistency and eventual consistency patterns

8. **Address Cross-Cutting Concerns**
   - **Security**: Authentication, authorization, encryption, secrets management
   - **Observability**: Logging, metrics, tracing, alerting
   - **Resilience**: Circuit breakers, retries, timeouts, bulkheads
   - **Performance**: Caching strategies, CDN, database indexing
   - **Scalability**: Horizontal vs vertical scaling, load balancing, auto-scaling

## Phase 3: Technical Decision Making

9. **Evaluate Technology Choices**
   - For each major technology decision, create an Architecture Decision Record (ADR)
   - Use a decision matrix to compare alternatives
   - Consider: maturity, community support, team expertise, licensing, vendor lock-in
   - Document trade-offs explicitly

10. **Create Architecture Decision Records (ADRs)**
    - Use the following template for each significant decision:
      ```
      # ADR-XXX: [Decision Title]
      
      ## Status
      [Proposed | Accepted | Deprecated | Superseded]
      
      ## Context
      [What is the issue we're trying to solve?]
      
      ## Decision
      [What is the change we're proposing/making?]
      
      ## Consequences
      Positive:
      - [Benefit 1]
      - [Benefit 2]
      
      Negative:
      - [Trade-off 1]
      - [Trade-off 2]
      
      ## Alternatives Considered
      - [Alternative 1]: [Why rejected]
      - [Alternative 2]: [Why rejected]
      ```

## Phase 4: Risk Assessment & Mitigation

11. **Identify Architecture Risks**
    - Performance risks (bottlenecks, latency, throughput)
    - Scalability risks (growth limits, resource constraints)
    - Security risks (attack vectors, data exposure)
    - Operational risks (deployment complexity, monitoring gaps)
    - Dependency risks (third-party services, vendor lock-in)

12. **Create Mitigation Strategies**
    - For each identified risk, document:
      - Likelihood (Low/Medium/High)
      - Impact (Low/Medium/High)
      - Mitigation approach
      - Contingency plan

## Phase 5: Documentation & Communication

13. **Create Architecture Documentation**
    - Write an Architecture Overview document including:
      - Executive summary
      - System context and goals
      - Architecture diagrams (C4 model: Context, Container, Component)
      - Key architectural decisions (link to ADRs)
      - Technology stack
      - Security architecture
      - Data architecture
      - Deployment architecture
      - Operational considerations

14. **Document Non-Functional Requirements**
    - Performance targets (latency, throughput)
    - Scalability requirements (users, data volume, growth projections)
    - Availability and reliability targets (uptime SLA, RTO, RPO)
    - Security requirements (compliance, data protection)
    - Maintainability and extensibility goals

15. **Create Implementation Roadmap**
    - Break architecture into implementation phases
    - Identify dependencies between phases
    - Define milestones and deliverables
    - Estimate effort and resources

16. **Present Architecture to Stakeholders**
    - Prepare presentation tailored to audience (technical vs non-technical)
    - Walk through architecture diagrams
    - Explain key decisions and trade-offs
    - Address questions and concerns
    - Gather feedback and iterate

## Phase 6: Validation & Iteration

17. **Conduct Architecture Review**
    - Schedule review with senior engineers, security team, and operations
    - Use a checklist to validate:
      - ✓ Meets functional requirements
      - ✓ Meets non-functional requirements
      - ✓ Addresses security concerns
      - ✓ Scalable and maintainable
      - ✓ Operationally feasible
      - ✓ Cost-effective

18. **Create Proof of Concept (if needed)**
    - For high-risk or novel architectural decisions, build a PoC
    - Validate critical assumptions (performance, integration feasibility)
    - Document findings and update architecture if needed

19. **Iterate Based on Feedback**
    - Incorporate feedback from reviews and PoCs
    - Update architecture documentation
    - Re-validate with stakeholders

## Phase 7: Handoff & Governance

20. **Prepare Implementation Guidance**
    - Create coding standards and patterns aligned with architecture
    - Document reference implementations
    - Provide API design guidelines
    - Create database schema design guidelines

21. **Establish Architecture Governance**
    - Define architecture review process for new features
    - Set up regular architecture review meetings
    - Create a process for updating ADRs
    - Establish metrics to track architectural health

22. **Monitor Architecture Evolution**
    - Track architecture drift (deviation from intended design)
    - Review and update architecture documentation quarterly
    - Conduct post-implementation reviews
    - Maintain a living architecture document

## Best Practices

- **Think in Layers**: Separate concerns (presentation, business logic, data access)
- **Design for Failure**: Assume everything will fail; build resilience
- **Keep It Simple**: Avoid over-engineering; add complexity only when needed
- **Document Decisions**: Future you (and your team) will thank you
- **Iterate**: Architecture evolves; plan for change
- **Measure**: Define metrics to validate architectural decisions
- **Communicate**: Architecture is a team sport; involve stakeholders early

## Common Pitfalls to Avoid

- ❌ Designing in isolation without stakeholder input
- ❌ Over-engineering for hypothetical future requirements
- ❌ Ignoring operational concerns (deployment, monitoring, debugging)
- ❌ Choosing technology based on hype rather than fit
- ❌ Failing to document trade-offs and decisions
- ❌ Not validating assumptions with PoCs or spikes
- ❌ Creating architecture that the team cannot implement or maintain
