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
    documents_submitted: List[str]  # List of submitted documents (simplified)
    work_hours_reported: int  # Work hours reported for the current period
    interactions: List[Dict[str, Any]]  # History of member interactions
    audit_log: List[Dict[str, Any]]  # Audit trail of all actions
    compliance_status: Optional[str]  # Overall compliance status
    compliance_issues: Optional[List[str]]  # List of compliance issues
    work_requirements_met: Optional[bool]  # Whether work requirements are met
    reminders: Optional[List[str]]  # Generated reminders
    reminders_sent: Optional[bool]  # Whether reminders were sent
    multilingual_supported: Optional[bool]  # Whether multilingual support was provided