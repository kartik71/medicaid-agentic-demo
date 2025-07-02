"""
Defines the Member model representing a Medicaid program member.
"""

from typing import Dict, List, Any, Optional
from datetime import datetime
from pydantic import BaseModel


class Address(BaseModel):
    """Member address information."""
    street1: str
    street2: Optional[str] = None
    city: str
    state: str
    zip_code: str


class ContactInfo(BaseModel):
    """Member contact information."""
    email: Optional[str] = None
    phone: Optional[str] = None
    preferred_language: str = "English"
    preferred_contact_method: str = "Email"
    language: str = "English"  # Added for backward compatibility


class EligibilityInfo(BaseModel):
    """Member eligibility information."""
    program: str
    status: str
    renewal_date: str  # Changed to string for easier handling
    last_verified: Optional[str] = None
    category: str
    income_verified: bool = False
    required_documents: List[str] = []


class WorkRequirement(BaseModel):
    """Work requirement tracking information."""
    required: bool = False
    hours_needed: int = 80
    exempt_reason: Optional[str] = None
    current_month_hours: int = 0
    hours_reported: int = 0  # Added for backward compatibility
    verified: bool = False
    last_updated: Optional[str] = None
    exemption_status: str = "none"  # Added for backward compatibility


class Member(BaseModel):
    """
    Represents a Medicaid program member with all relevant information
    needed for eligibility verification and communications.
    """
    id: str
    first_name: str
    last_name: str
    date_of_birth: str  # Changed to string for easier handling
    address: Address
    contact: ContactInfo
    eligibility: EligibilityInfo
    work_requirement: WorkRequirement
    documents: Dict[str, Any] = {}
    household_size: int = 1
    notes: List[str] = []
    communication_history: List[Dict[str, Any]] = []

    def is_renewal_due_soon(self, days_threshold: int = 60) -> bool:
        """Check if renewal is due within specified days threshold."""
        try:
            renewal_date = datetime.fromisoformat(self.eligibility.renewal_date.replace('Z', '+00:00'))
            today = datetime.now()
            delta = renewal_date - today
            return 0 < delta.days <= days_threshold
        except:
            return False

    def get_missing_documents(self) -> List[str]:
        """Return list of documents needed for renewal."""
        required_docs = self.eligibility.required_documents
        submitted_docs = list(self.documents.keys()) if self.documents else []
        return [doc for doc in required_docs if doc not in submitted_docs]