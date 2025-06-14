# Medicaid Assist Agents Documentation

The Medicaid Assist system consists of six specialized agents working together in a LangGraph workflow to reduce procedural disenrollments, automate compliance workflows, and improve member engagement while maintaining audit-readiness.

## Agent Overview

### 1. Eligibility Checker Agent

**Responsibilities:**
- Verifies Medicaid eligibility criteria for members
- Checks renewal deadlines
- Determines if members meet eligibility requirements
- Identifies documentation needs

**Implementation:**
The agent connects to Medicaid databases to verify eligibility status, checks for upcoming renewal deadlines, and identifies required documentation.

### 2. Reminder Agent

**Responsibilities:**
- Sends automated, personalized notifications to members
- Manages communication via SMS, email, and app notifications
- Tracks member communication preferences
- Ensures timely reminders for renewal deadlines

**Implementation:**
The Reminder Agent uses LangChain with a powerful LLM to generate personalized notifications based on member status, preferences, and language requirements. The agent selects appropriate communication channels and timing based on member preferences and sends targeted messages about renewal deadlines, documentation requirements, and work verification needs.

Sample prompt structure:
```
System: You are a Reminder Agent for Medicaid members.
        
Your responsibilities:
1. Generate personalized notifications for members based on their status
2. Select the appropriate notification channel (SMS, email, app notification)
3. Adapt communication style to member preferences and language
4. Ensure members are notified about upcoming deadlines and requirements

Use the member information to create appropriate, personalized reminders.
```

### 3. Document Assistant Agent

**Responsibilities:**
- Guides members to upload required documentation
- Validates document completeness and authenticity
- Helps members understand documentation requirements
- Updates document status in the system

**Implementation:**
The Document Assistant Agent helps members navigate document requirements by validating submitted files, identifying missing or invalid documents, and providing clear instructions for proper submission. It uses image recognition capabilities for document verification and integrates with secure storage systems.

### 4. Work Requirement Agent

**Responsibilities:**
- Collects and confirms 80-hour/month work or volunteering data
- Tracks compliance with work requirements
- Provides guidance on work requirement documentation
- Processes exemptions and special circumstances

**Implementation:**
This agent verifies that eligible members meet the 80-hour per month work or volunteering requirement. It tracks hours reported, processes verification evidence, and handles exemption requests. For members not meeting requirements, it provides guidance on compliance options.

### 5. Multilingual Chat Agent

**Responsibilities:**
- Handles real-time, multilingual member interactions
- Provides assistance with enrollment, renewal, and general questions
- Adapts communication to member's language preferences
- Routes complex issues to appropriate specialists

**Implementation:**
The Multilingual Chat Agent supports multiple languages to ensure accessibility for diverse member populations. It uses advanced language models to understand and respond to member queries in their preferred language, handling common questions while escalating complex issues when necessary.

### 6. Audit & Compliance Agent

**Responsibilities:**
- Logs actions and member interactions for CMS audit readiness
- Ensures all actions are compliant with Medicaid regulations
- Creates audit trails for all system activities
- Generates compliance reports for regulatory oversight

**Implementation:**
This agent maintains comprehensive logs of all system activities to ensure CMS audit readiness. It validates that all required documentation and verification steps have been completed properly and generates reports for regulatory compliance.

## Agent Workflow

The agents work together in a coordinated workflow:

1. The **Eligibility Checker Agent** first verifies a member's status and determines next steps
2. Based on eligibility results:
   - If documentation is required, the **Document Assistant Agent** is activated
   - If work requirements apply, the **Work Requirement Agent** is engaged
   - Otherwise, the **Reminder Agent** sends appropriate notifications
3. The **Multilingual Chat Agent** can be triggered at any point to assist with member questions
4. All activities are logged by the **Audit & Compliance Agent** to ensure regulatory compliance

## Technologies

- **LLM Integration**: Each agent leverages LangChain with advanced language models
- **LangGraph**: Orchestrates the agent workflow with conditional branching
- **Windsurf**: Provides the foundation for AI capabilities
- **AgentBridge Platform**: Hosts and manages the agent ecosystem
