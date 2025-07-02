# Medicaid Assist - LangGraph Agentic Workflow

A multi-agent workflow using LangGraph to automate Medicaid compliance processes, reduce disenrollments, improve member engagement, and maintain audit readiness.

## Overview

The Medicaid Assist system consists of six specialized agents working together to:
- Verify eligibility and renewal requirements
- Track work requirement compliance (80 hours/month)
- Send personalized, multilingual notifications
- Guide document submission and validation
- Ensure complete audit trails for compliance

## System Architecture

![Medicaid Assist Architecture](docs/architecture_diagram.png)

The system uses LangGraph to orchestrate the agent workflow:

1. **Eligibility Checker Agent** → Starts the workflow by verifying member status
2. **Document Assistant Agent** → Guides and validates required documentation
3. **Work Requirement Agent** → Tracks and verifies 80-hour/month requirement
4. **Reminder Agent** → Sends personalized notifications
5. **Multilingual Chat Agent** → Handles interactions in member's preferred language
6. **Audit & Compliance Agent** → Ensures regulatory compliance and audit readiness

## Project Structure

```
medicaid_assist/
├── agents/                 # Agent implementations
│   ├── eligibility_checker.py
│   ├── reminder.py
│   ├── document_assistant.py
│   ├── work_requirement.py
│   ├── multilingual_chat.py
│   └── audit_compliance.py
├── api/                    # API interface
│   └── app.py              # FastAPI application
├── data/                   # Data files
│   └── synthetic_members.csv  # Synthetic member data
├── docs/                   # Documentation
│   └── agents.md           # Agent details
├── models/                 # Data models
│   ├── member.py           # Member data structure
│   └── state.py            # Workflow state
├── storage/                # Data storage
│   └── member_repository.py  # Member data access
├── utils/                  # Utilities
│   ├── logger.py           # Logging configuration
│   └── data_loader.py      # Data analysis utilities
├── main.py                 # Main workflow implementation
├── demo.py                 # Demo script
└── requirements.txt        # Dependencies
```

## Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/medicaid_assist.git
cd medicaid_assist
```

2. **Create and activate a virtual environment**

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**

```bash
python -m pip install -r requirements.txt
```

4. **Set up environment variables**
   
Create a `.env` file in the project root:

```
OPENAI_API_KEY=your_openai_api_key_here  # Optional, demo works without it
DATABASE_URL=sqlite:///medicaid_assist.db  # For future database integration
```

## Running the Demo

The project includes a comprehensive demo that shows the agent workflow in action:

```bash
python demo.py
```

This will:
1. Load synthetic member data
2. Process sample members through the workflow
3. Show detailed output of each agent's actions
4. Demonstrate different member scenarios (renewal, work requirements, documents, etc.)

### Analyzing the Data

The project includes data analysis utilities that show how to use pandas with the synthetic data:

```bash
python utils/data_loader.py
```

This will generate visualizations and statistics about member renewals and work requirement compliance.

## API Usage

The project includes a FastAPI application for accessing the workflow:

```bash
python -m uvicorn api.app:app --reload
```

API endpoints:
- `GET /`: API health check
- `GET /health`: Component status check
- `POST /process-member`: Process a member through the workflow
- `GET /members/{member_id}/status`: Get member status

## Synthetic Data

The project includes a synthetic dataset with 20 members representing different scenarios:
- Members needing renewal
- Members with documentation requirements
- Members with work requirements (some compliant, some not)
- Members with different language preferences
- Members with exemptions

You can use this data to explore the workflow in different scenarios.

## Future Enhancements

- Integration with real Medicaid eligibility databases
- Document validation using OCR and computer vision
- Work hours tracking system integration
- Notification service integration (SMS, email, app)
- Natural language understanding improvements
- Expanded multilingual support

## License

[MIT License](LICENSE)

## Azure Deployment Instructions

### Prerequisites

- Azure account with an active subscription
- Azure CLI installed or access to Azure Portal
- GitHub account (for CI/CD setup)

### Option 1: Deploy with GitHub Actions (Recommended)

1. **Create an Azure Web App**

   ```bash
   # Login to Azure
   az login
   
   # Create a resource group
   az group create --name medicaid-app-rg --location eastus
   
   # Create an App Service plan
   az appservice plan create --name medicaid-app-plan --resource-group medicaid-app-rg --sku B1 --is-linux
   
   # Create a web app
   az webapp create --name your-medicaid-app --resource-group medicaid-app-rg --plan medicaid-app-plan --runtime "PYTHON:3.11"
   ```

2. **Configure GitHub Secrets**

   In your GitHub repository, navigate to Settings > Secrets and add:
   - `AZURE_WEBAPP_NAME`: The name of your Azure web app (e.g., your-medicaid-app)
   - `AZURE_WEBAPP_PUBLISH_PROFILE`: Download from Azure Portal > Your Web App > Get publish profile

3. **Configure Environment Variables in Azure**

   In Azure Portal > Your Web App > Configuration > Application settings, add:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `SCM_DO_BUILD_DURING_DEPLOYMENT`: Set to `true`

4. **Push Code to GitHub**

   The GitHub Actions workflow will automatically deploy your application to Azure.

### Option 2: Deploy from Local Machine

1. **Create an Azure Web App** as described above

2. **Deploy Using Azure CLI**

   ```bash
   # Navigate to your project directory
   cd path/to/medicaid_assist
   
   # Deploy to Azure
   az webapp up --name your-medicaid-app --resource-group medicaid-app-rg --sku B1 --runtime "PYTHON:3.11"
   ```

3. **Configure Environment Variables** as described above

### Verify Deployment

Once deployed, access your application at:
- `https://your-medicaid-app.azurewebsites.net`

### Troubleshooting

- **Logs**: Access logs in Azure Portal > Your Web App > Logs > Log stream
- **Startup Issues**: Check application logs and startup command
- **Dependencies**: Ensure all dependencies are in requirements.txt
- **Python Version**: This app is tested with Python 3.11