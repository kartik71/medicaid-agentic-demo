"""
Member repository for loading and managing member data.
"""

import json
import os
import random
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from models.member import Member, Address, ContactInfo, EligibilityInfo, WorkRequirement

# Simulated in-memory storage
_members: Dict[str, Member] = {}

def create_synthetic_members() -> Dict[str, Member]:
    """Create synthetic member data for demonstration."""
    members = {}
    
    # Sample data for different scenarios
    sample_data = [
        {
            "id": "1",
            "first_name": "Maria",
            "last_name": "Rodriguez",
            "scenario": "renewal_needed",
            "language": "Spanish",
            "work_required": False,
            "documents": ["income_verification", "address_proof"]
        },
        {
            "id": "2", 
            "first_name": "James",
            "last_name": "Johnson",
            "scenario": "work_compliance",
            "language": "English",
            "work_required": True,
            "work_hours": 45,
            "documents": []
        },
        {
            "id": "3",
            "first_name": "Sarah",
            "last_name": "Chen",
            "scenario": "documents_missing",
            "language": "English",
            "work_required": False,
            "documents": ["medical_records", "income_verification", "identity_proof"]
        },
        {
            "id": "4",
            "first_name": "Ahmed",
            "last_name": "Hassan",
            "scenario": "multilingual",
            "language": "Arabic",
            "work_required": True,
            "work_hours": 85,
            "documents": []
        },
        {
            "id": "5",
            "first_name": "Jennifer",
            "last_name": "Smith",
            "scenario": "compliant",
            "language": "English",
            "work_required": False,
            "documents": []
        }
    ]
    
    for data in sample_data:
        # Create address
        address = Address(
            street1=f"{random.randint(100, 9999)} Main St",
            city="Springfield",
            state="IL",
            zip_code="62701"
        )
        
        # Create contact info
        contact = ContactInfo(
            email=f"{data['first_name'].lower()}.{data['last_name'].lower()}@email.com",
            phone=f"555-{random.randint(100, 999)}-{random.randint(1000, 9999)}",
            preferred_language=data["language"],
            language=data["language"],
            preferred_contact_method="Email"
        )
        
        # Create eligibility info
        renewal_date = datetime.now() + timedelta(days=random.randint(30, 90))
        eligibility = EligibilityInfo(
            program="Medicaid",
            status="renewal_needed" if data["scenario"] == "renewal_needed" else "active",
            renewal_date=renewal_date.isoformat(),
            category="Adult",
            income_verified=True,
            required_documents=data["documents"]
        )
        
        # Create work requirement
        work_requirement = WorkRequirement(
            required=data["work_required"],
            hours_needed=80,
            current_month_hours=data.get("work_hours", 0),
            hours_reported=data.get("work_hours", 0),
            verified=data.get("work_hours", 0) >= 80 if data["work_required"] else True,
            exempt_reason=None if data["work_required"] else "not_required",
            exemption_status="none" if data["work_required"] else "not_required"
        )
        
        # Create member
        member = Member(
            id=data["id"],
            first_name=data["first_name"],
            last_name=data["last_name"],
            date_of_birth=(datetime.now() - timedelta(days=random.randint(18*365, 65*365))).isoformat(),
            address=address,
            contact=contact,
            eligibility=eligibility,
            work_requirement=work_requirement,
            documents={doc: {"status": "submitted", "date": datetime.now().isoformat()} for doc in data["documents"][:1]},  # Some docs submitted
            household_size=random.randint(1, 4)
        )
        
        members[data["id"]] = member
    
    return members

def load_members() -> Dict[str, Member]:
    """Load members into the repository."""
    global _members
    if not _members:
        _members = create_synthetic_members()
    return _members

def get_member(member_id: str) -> Optional[Member]:
    """Get a member by ID."""
    return _members.get(member_id)

def get_all_members() -> List[Member]:
    """Get all members."""
    return list(_members.values())

def get_all_member_ids() -> List[str]:
    """Get all member IDs."""
    return list(_members.keys())

def get_members_by_status(status: str) -> List[Member]:
    """Get members by eligibility status."""
    return [member for member in _members.values() if member.eligibility.status == status]

def update_member(member_id: str, member: Member) -> None:
    """Update a member in the repository."""
    _members[member_id] = member