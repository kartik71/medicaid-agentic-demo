
import json
import os
import random
from models.member import Member

# Simulated in-memory storage
_members = {}

def load_members():
    global _members
    # Load 5 fake members
    for i in range(1, 6):
        _members[str(i)] = Member(
            id=str(i),
            name=f"Member {i}",
            age=random.randint(20, 60),
            eligibility_status="Pending",
            language="English",
            documents_submitted=[],
            compliance_flags=[]
        )

def get_member(member_id):
    return _members.get(member_id)

def get_all_members():
    return list(_members.values())

def get_all_member_ids():
    return list(_members.keys())

def update_member(member_id, member):
    _members[member_id] = member
