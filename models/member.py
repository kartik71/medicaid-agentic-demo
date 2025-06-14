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
    

class EligibilityInfo(BaseModel):
    """Member eligibility information."""
    program: str
    status: str
    renewal_date: datetime
    last_verified: Optional[datetime] = None
    category: str
    income_verified: bool = False


class WorkRequirement(BaseModel):
    """Work requirement tracking information."""
    required: bool = False
    hours_needed: int = 0
    exempt_reason: Optional[str] = None
    current_month_hours: int = 0
    verified: bool = False
    last_updated: Optional[datetime] = None


class Member(BaseModel):
    """
    Represents a Medicaid program member with all relevant information
    needed for eligibility verification and communications.
    """
    id: str
    first_name: str
    last_name: str
    date_of_birth: datetime
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
        today = datetime.now()
        delta = self.eligibility.renewal_date - today
        return 0 < delta.days <= days_threshold

    def get_missing_documents(self) -> List[str]:
        """Return list of documents needed for renewal."""
        # Placeholder - In a real implementation, this would compare
        # required docs against submitted docs
        return []
