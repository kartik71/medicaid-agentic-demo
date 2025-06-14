"""
Defines the state object passed between agents in the LangGraph workflow.
"""

from typing import Dict, List, Any, TypedDict, Optional
from models.member import Member

class AgentState(TypedDict):
    """
    Represents the state passed between agents in the Medicaid workflow.
    Contains all relevant information about a member's status and history.
    """
    member: Member  # Member information
    eligibility_verified: bool  # Whether eligibility has been verified
    work_requirements_needed: bool  # Whether work requirements apply
    documents_required: List[str]  # List of required documents
    documents_submitted: List[Dict[str, Any]]  # List of submitted documents
    work_hours_reported: int  # Work hours reported for the current period
    interactions: List[Dict[str, Any]]  # History of member interactions
    audit_log: List[Dict[str, Any]]  # Audit trail of all actions
