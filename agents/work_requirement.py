"""
Work Requirement Agent

Responsibilities:
- Collects and confirms 80-hour/month work or volunteering data
- Tracks compliance with work requirements
- Provides guidance on work requirement documentation
- Processes exemptions and special circumstances
"""

from typing import Dict, Any, Callable
from langchain_core.language_models.base import BaseLanguageModel
from langchain.prompts import ChatPromptTemplate
from models.state import AgentState
from models.member import Member
from utils.logger import setup_logger

# Set up logger
logger = setup_logger()

def create_work_requirement_agent(llm: BaseLanguageModel) -> Callable:
    """
    Creates a work requirement agent that tracks and verifies work hours.
    
    Args:
        llm: The language model to use
        
    Returns:
        Callable: A function that processes the state
    """
    # System prompt for work requirement verification
    work_prompt = ChatPromptTemplate.from_messages([
        ("system", """You are a Work Requirement Agent for Medicaid.
        
Your responsibilities:
1. Verify that eligible members meet the 80-hour per month work requirement
2. Track hours reported and validate compliance
3. Process exemption requests and special circumstances
4. Provide guidance on work requirement documentation

Use the member information to verify work compliance.
"""),
        ("human", """
Member information:
{member_json}

Current state:
{state_json}

Based on this information, verify work requirement compliance.
""")
    ])
    
    # Create the chain
    work_chain = work_prompt | llm
    
    def run_work_requirement_check(state: AgentState) -> AgentState:
        """
        Runs work requirement verification process for a member.
        
        Args:
            state: The current workflow state
            
        Returns:
            Updated workflow state
        """
        member = state["member"]
        logger.info(f"Running work requirement check for member {member.id}")
        
        try:
            # Check if work requirements apply
            if member.work_requirement.required:
                hours_reported = member.work_requirement.current_month_hours
                hours_needed = 80
                
                # Check compliance
                is_compliant = hours_reported >= hours_needed
                
                # Update state
                state["work_requirements_needed"] = not is_compliant
                state["work_hours_reported"] = hours_reported
                
                # Add to audit log
                state["audit_log"].append({
                    "timestamp": "2023-06-13T16:40:00",
                    "agent": "work_requirement",
                    "action": "work_verification",
                    "member_id": member.id,
                    "result": "compliant" if is_compliant else "non_compliant",
                    "hours_reported": hours_reported,
                    "hours_needed": hours_needed
                })
                
                logger.info(f"Work requirement check completed for member {member.id}: {'compliant' if is_compliant else 'non-compliant'}")
            else:
                # No work requirements
                state["work_requirements_needed"] = False
                state["work_hours_reported"] = 0
                
                # Add to audit log
                state["audit_log"].append({
                    "timestamp": "2023-06-13T16:40:00",
                    "agent": "work_requirement",
                    "action": "work_verification",
                    "member_id": member.id,
                    "result": "exempt",
                    "exemption_reason": member.work_requirement.exempt_reason or "not_required"
                })
                
                logger.info(f"Member {member.id} is exempt from work requirements")
                
        except Exception as e:
            logger.error(f"Error in work requirement check for member {member.id}: {str(e)}")
            state["audit_log"].append({
                "timestamp": "2023-06-13T16:40:00",
                "agent": "work_requirement",
                "action": "work_verification",
                "member_id": member.id,
                "result": "error",
                "error": str(e)
            })
        
        return state
    
    return run_work_requirement_check