"""
Eligibility Checker Agent

Responsibilities:
- Verifies Medicaid eligibility criteria for members
- Checks renewal deadlines
- Determines if members meet eligibility requirements
- Identifies documentation needs
"""

from typing import Dict, Any, Callable
from langchain_core.language_models.base import BaseLanguageModel
from langchain.prompts import ChatPromptTemplate
from models.state import AgentState
from models.member import Member
from utils.logger import setup_logger

# Set up logger
logger = setup_logger()

def create_eligibility_checker_agent(llm: BaseLanguageModel) -> Callable:
    """
    Creates an eligibility checker agent that verifies Medicaid eligibility
    and identifies documentation needs.
    
    Args:
        llm: The language model to use
        
    Returns:
        Callable: A function that processes the state
    """
    # System prompt for eligibility checking
    eligibility_prompt = ChatPromptTemplate.from_messages([
        ("system", """You are an Eligibility Checker Agent for Medicaid.
        
Your responsibilities:
1. Verify if members meet Medicaid eligibility criteria
2. Check renewal deadlines and identify if renewals are due soon
3. Determine what documentation is needed for verification/renewal
4. Update the state with eligibility status and required documents

Use the member information to analyze eligibility and deadlines.
"""),
        ("human", """
Member information:
{member_json}

Current state:
{state_json}

Based on this information, verify eligibility and identify any documentation needs.
""")
    ])
    
    # Create the chain
    eligibility_chain = eligibility_prompt | llm
    
    def run_eligibility_check(state: AgentState) -> AgentState:
        """
        Runs eligibility verification process for a member.
        
        Args:
            state: The current workflow state
            
        Returns:
            Updated workflow state
        """
        member = state["member"]
        logger.info(f"Running eligibility check for member {member.id}")
        
        # In a real implementation, this would:
        # 1. Connect to state Medicaid database systems
        # 2. Verify current eligibility status
        # 3. Check program-specific requirements
        # 4. Determine documentation needs
        
        # For this skeleton, we'll simulate eligibility checking
        try:
            # Check renewal date
            renewal_due_soon = member.is_renewal_due_soon(days_threshold=60)
            
            # Determine missing documents
            missing_documents = member.get_missing_documents()
            
            # Check work requirements
            work_requirements_needed = member.work_requirement.required and not member.work_requirement.verified
            
            # Update state
            state["eligibility_verified"] = True  # Assume verified for skeleton
            state["work_requirements_needed"] = work_requirements_needed
            state["documents_required"] = missing_documents
            
            # Add to audit log
            state["audit_log"].append({
                "timestamp": "2023-06-13T16:30:00", # Would be datetime.now() in real implementation
                "agent": "eligibility_checker",
                "action": "eligibility_verification",
                "member_id": member.id,
                "result": "verified" if state["eligibility_verified"] else "needs_documentation"
            })
            
            logger.info(f"Eligibility check completed for member {member.id}")
            
        except Exception as e:
            logger.error(f"Error in eligibility check for member {member.id}: {str(e)}")
            # In case of error, mark as not verified and log
            state["audit_log"].append({
                "timestamp": "2023-06-13T16:30:00", # Would be datetime.now() in real implementation
                "agent": "eligibility_checker",
                "action": "eligibility_verification",
                "member_id": member.id,
                "result": "error",
                "error": str(e)
            })
        
        return state
    
    return run_eligibility_check
