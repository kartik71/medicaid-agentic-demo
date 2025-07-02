"""
Audit & Compliance Agent

Responsibilities:
- Logs actions and member interactions for CMS audit readiness
- Ensures all actions are compliant with Medicaid regulations
- Creates audit trails for all system activities
- Generates compliance reports for regulatory oversight
"""

from typing import Dict, Any, Callable
from langchain_core.language_models.base import BaseLanguageModel
from langchain.prompts import ChatPromptTemplate
from models.state import AgentState
from models.member import Member
from utils.logger import setup_logger

# Set up logger
logger = setup_logger()

def create_audit_compliance_agent(llm: BaseLanguageModel) -> Callable:
    """
    Creates an audit and compliance agent that ensures regulatory compliance.
    
    Args:
        llm: The language model to use
        
    Returns:
        Callable: A function that processes the state
    """
    # System prompt for audit and compliance
    audit_prompt = ChatPromptTemplate.from_messages([
        ("system", """You are an Audit & Compliance Agent for Medicaid.
        
Your responsibilities:
1. Log all actions and member interactions for CMS audit readiness
2. Ensure all actions comply with Medicaid regulations
3. Create comprehensive audit trails
4. Generate compliance reports for regulatory oversight

Use the member information and workflow state to verify compliance.
"""),
        ("human", """
Member information:
{member_json}

Current state:
{state_json}

Verify compliance and create audit trail for all actions.
""")
    ])
    
    # Create the chain
    audit_chain = audit_prompt | llm
    
    def run_audit_compliance(state: AgentState) -> AgentState:
        """
        Runs audit and compliance verification for the workflow.
        
        Args:
            state: The current workflow state
            
        Returns:
            Updated workflow state with compliance verification
        """
        member = state["member"]
        logger.info(f"Running audit and compliance check for member {member.id}")
        
        try:
            # Analyze compliance status
            compliance_issues = []
            
            # Check eligibility verification
            if not state.get("eligibility_verified"):
                compliance_issues.append("Eligibility not verified")
            
            # Check document requirements
            docs_required = state.get("documents_required", [])
            docs_submitted = state.get("documents_submitted", [])
            if docs_required and len(docs_submitted) < len(docs_required):
                compliance_issues.append("Missing required documents")
            
            # Check work requirements
            if member.work_requirement.required and state.get("work_requirements_needed"):
                compliance_issues.append("Work requirements not met")
            
            # Determine overall compliance status
            is_compliant = len(compliance_issues) == 0
            
            # Update state with compliance information
            state["compliance_status"] = "compliant" if is_compliant else "non_compliant"
            if compliance_issues:
                state["compliance_issues"] = compliance_issues
            
            # Create comprehensive audit summary
            audit_summary = {
                "member_id": member.id,
                "workflow_completion_time": "2023-06-13T17:00:00",
                "agents_executed": len(set(log["agent"] for log in state["audit_log"])),
                "total_interactions": len(state["interactions"]),
                "compliance_status": state["compliance_status"],
                "issues_identified": compliance_issues,
                "audit_trail_entries": len(state["audit_log"])
            }
            
            # Add final audit entry
            state["audit_log"].append({
                "timestamp": "2023-06-13T17:00:00",
                "agent": "audit_compliance",
                "action": "final_compliance_check",
                "member_id": member.id,
                "result": state["compliance_status"],
                "summary": audit_summary
            })
            
            # Add final interaction
            state["interactions"].append({
                "timestamp": "2023-06-13T17:00:00",
                "agent": "audit_compliance",
                "action": "compliance_verification",
                "result": state["compliance_status"],
                "details": f"Workflow completed with {len(compliance_issues)} compliance issues"
            })
            
            logger.info(f"Audit and compliance check completed for member {member.id}: {state['compliance_status']}")
            
        except Exception as e:
            logger.error(f"Error in audit and compliance for member {member.id}: {str(e)}")
            state["audit_log"].append({
                "timestamp": "2023-06-13T17:00:00",
                "agent": "audit_compliance",
                "action": "compliance_verification",
                "member_id": member.id,
                "result": "error",
                "error": str(e)
            })
        
        return state
    
    return run_audit_compliance