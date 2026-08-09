## AI Usage & Development Log

### AI-Assisted Development

This project was developed using a **multi-model, human-in-the-loop AI workflow**. Rather than relying on a single AI system for the entire project, we used different models and tools for different stages of research, architecture, prompt engineering, frontend development, backend/service development, testing, and refinement.

The goal was to use each AI system where it provided the most useful capability while keeping the development team responsible for technical decisions, validation, testing, and the final implementation.

---

### AI Tools & Their Roles

| AI Tool | Role in Development | How We Used It |
|---|---|---|
| **Antigravity** | Frontend Engineering & Development | Used extensively for React development, UI implementation, component integration, debugging, responsive design, visual refinement, and frontend feature development. It played a major role in turning the functional prototype into a polished, production-ready interface. |
| **ChatGPT Go** | Backend & Service-Layer Development | Used for backend/service-layer reasoning, Groq API integration, data-flow design, evaluation logic, error handling, debugging, and technical implementation decisions. |
| **NotebookLM** | Prompt Engineering & Research | Used to study effective prompt design. **18 reference sources** were provided to NotebookLM to teach and analyze what makes a strong AI prompt, including structure, context, constraints, role definition, expected outputs, evaluation criteria, and other prompt-design principles. |
| **Qwen** | Project Structure & Architecture | Used during early project structuring, feature decomposition, and exploration of possible application organization. |
| **Kimi** | Project Structure & Planning | Used to explore alternative project structures, feature organization, and implementation strategies. |
| **DeepSeek** | Technical Structure & Reasoning | Used for independent technical reasoning, architecture exploration, and comparison of implementation approaches. |

---

## Why We Used Multiple AI Models

Different AI systems were intentionally assigned different responsibilities.

```
                    PROJECT REQUIREMENTS
                           │
                           ▼
              ┌─────────────────────────┐
              │ Qwen / Kimi / DeepSeek  │
              │ Structure & Architecture│
              └────────────┬────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │       NotebookLM        │
              │ 18 Sources + Prompt     │
              │ Engineering Research    │
              └────────────┬────────────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
     ┌─────────────────┐       ┌─────────────────┐
     │  ChatGPT Go     │       │   Antigravity   │
     │ Backend / AI    │       │ Frontend / UI   │
     │ Service Layer   │       │ Engineering     │
     └────────┬────────┘       └────────┬────────┘
              │                         │
              └────────────┬────────────┘
                           ▼
                    HUMAN REVIEW
                           │
                           ▼
                 TESTING & VALIDATION
                           │
                           ▼
                    GITHUB + VERCEL
```

Prompt Engineering with NotebookLM

A major part of the project was not simply using an LLM, but improving how we instructed the LLM.

We used NotebookLM with 18 reference sources focused on effective prompt engineering. These sources were used to understand the characteristics of high-quality prompts and to develop a more systematic approach to prompt construction.

The resulting prompt-design approach emphasized:

Clear AI role definition
Explicit objectives
Relevant context
Constraints and boundaries
Structured instructions
Expected output formats
Evaluation criteria
Consistency requirements
Edge-case handling
Candidate/interview context
Clear separation between generation and evaluation tasks

These principles were then applied to the prompts used by our interview agent for:

Technical question generation
Resume-based question personalization
Candidate answer evaluation
Interviewer personas
Performance assessment
Final report generation

This was an important part of the project because the quality of an AI interviewer depends not only on the underlying model, but also on the quality of the instructions and evaluation framework provided to it.

Antigravity for Frontend Engineering

Antigravity was used extensively for the frontend implementation.

It helped us transform the application's functionality into a polished interactive interface, including:

React component development
Interview interface
Question cards
Evaluation cards
Resume interface
Interviewer persona selection
Progress dashboard
Interview history
Structured feedback
Final report UI
AI Usage Log interface
Responsive layouts
Visual refinement
Frontend debugging and integration

A major benefit of this workflow was rapid visual iteration: functionality could be implemented, reviewed, refined, and tested without slowing down the rest of the development process.

ChatGPT Go for Backend & AI Services

ChatGPT Go was primarily used for backend/service-layer development and technical reasoning.

Its contributions included work around:

Groq API integration
AI service architecture
Request/response handling
Evaluation workflows
AI-generated result processing
Error handling
Service-layer debugging
Data-flow design
Production configuration

The final implementation was tested locally and in the deployed environment rather than relying solely on generated code.

Qwen, Kimi & DeepSeek for Project Structure

Qwen, Kimi, and DeepSeek were used during the planning and architecture stages.

Their role was primarily to provide alternative perspectives on:

Project organization
Component structure
Feature decomposition
Application architecture
Implementation strategies
Technical trade-offs

Using multiple models allowed us to compare approaches before committing to an implementation.

The final architecture was selected and modified by the development team based on project requirements and testing.

AI Usage Audit

As part of the development process, an AI-assisted development audit was maintained.

Development Statistics
Metric	Count
Total conversation steps	1,541
User requests processed	93
AI tool executions	647
Antigravity Tool Usage
Tool	Executions	Purpose
view_file	233	Codebase exploration and validation
run_command	157	Builds, installations, Git, testing and environment operations
write_to_file	90	Creating components and source files
replace_file_content	82	Targeted code modifications
manage_task	49	Background task management
list_dir	14	Project/file discovery
multi_replace_file_content	11	Multi-section refactoring
grep_search	6	Code search and validation
schedule	4	Background tasks/timers
generate_image	1	UI graphic asset generation
AI Usage Logging Inside the Application

The project also contains an AI Usage Log feature for the interview itself.

It records the interaction between the candidate and the AI interviewer, including:

AI-generated questions
Candidate answers
AI evaluations
Scores
Feedback
Skipped questions
Final evaluation information

The application can export the usage log in:

TXT
JSON
CSV

This provides a transparent record of how AI participated in the actual interview process.

Security & Credential Protection

AI usage logs are designed to exclude sensitive credentials.

The following are not included in exported AI usage logs:

Groq API keys
Gemini API keys
Environment variables
Authentication tokens
.env contents

The repository also keeps environment configuration outside the tracked source code.

Security checks were performed against known API-key patterns such as:

gsk_
AIza

and exported logs were verified to ensure that credentials were not included.

Human-in-the-Loop Development

AI was used as a development and research assistant, not as an autonomous developer.

The development team remained responsible for:

Defining requirements
Selecting features
Choosing architectural approaches
Reviewing AI-generated code
Testing functionality
Debugging failures
Security decisions
API configuration
GitHub management
Deployment
Final product decisions

AI-generated suggestions were therefore treated as candidate solutions that required human review and validation.

```

IDEA / REQUIREMENT
       │
       ▼
AI-assisted research
(Qwen / Kimi / DeepSeek)
       │
       ▼
Project architecture
       │
       ▼
Prompt research
(NotebookLM + 18 sources)
       │
       ▼
Prompt design
       │
       ├───────────────────┐
       ▼                   ▼
ChatGPT Go           Antigravity
Backend / Services   Frontend / UI
       │                   │
       └─────────┬─────────┘
                 ▼
          Human Review
                 │
                 ▼
       Local Testing & Debugging
                 │
                 ▼
             GitHub
                 │
                 ▼
             Vercel
                 │
                 ▼
       Production Validation
```

AI Transparency Statement

AI was a core part of our development workflow, but not a substitute for engineering judgment. We deliberately used multiple AI systems for different strengths: Qwen, Kimi and DeepSeek for structural exploration; NotebookLM with 18 sources for prompt-engineering research; ChatGPT Go for backend and service-layer development; and Antigravity for frontend engineering and rapid UI refinement.

All important implementation decisions, testing, debugging, security checks, and deployment decisions remained under human supervision.

The application itself uses Groq-powered AI for technical interview question generation, candidate evaluation, and final result generation.

THANK YOU!!!

