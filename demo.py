"""
Medicaid Assist Workflow Demo

This script demonstrates the Medicaid Assist agent workflow by processing
synthetic member data through the complete agent pipeline.
"""

import os
import sys
import json
from datetime import datetime
from typing import Dict, List, Any, Optional

# Import project modules
from main import create_workflow, process_member
from storage.member_repository import load_members, get_member, get_members_by_status
from models.member import Member
from utils.logger import setup_logger

# Set up logger
logger = setup_logger()

def print_header(text: str):
    """Print a formatted header."""
    print("\n" + "=" * 80)
    print(f" {text} ".center(80, "="))
    print("=" * 80)

def print_section(text: str):
    """Print a formatted section header."""
    print("\n" + "-" * 80)
    print(f" {text} ".center(80, "-"))
    print("-" * 80)

def format_member_info(member: Member) -> str:
    """Format member information for display."""
    return f"""
    ID: {member.id}
    Name: {member.first_name} {member.last_name}
    Eligibility Status: {member.eligibility.status}
    Renewal Date: {member.eligibility.renewal_date}
    Required Documents: {', '.join(member.eligibility.required_documents) if member.eligibility.required_documents else 'None'}
    Work Requirement: {'Required' if member.work_requirement.required else 'Not Required'}
    Work Hours: {member.work_requirement.hours_reported}
    Language: {member.contact.language}
    Contact Preference: {member.contact.preferred_contact_method}
    """

def pretty_print_state(state: Dict[str, Any]):
    """Format and print the workflow state."""
    # Extract basic info
    member = state["member"]
    interactions = state.get("interactions", [])
    audit_log = state.get("audit_log", [])
    
    print(f"\nMember: {member.first_name} {member.last_name} (ID: {member.id})")
    
    # Print eligibility info
    print(f"\nEligibility Status: {member.eligibility.status}")
    print(f"Renewal Date: {member.eligibility.renewal_date}")
    
    if state.get("eligibility_verified"):
        print("✅ Eligibility verification complete")
    else:
        print("❌ Eligibility verification incomplete")
        
    # Print document requirements
    if state.get("documents_required"):
        print("\nRequired Documents:")
        for doc in state["documents_required"]:
            doc_status = "✅ Submitted" if doc in state.get("documents_submitted", []) else "❌ Missing"
            print(f"  - {doc}: {doc_status}")
    else:
        print("\n✅ No documents required")
    
    # Print work requirement info
    if member.work_requirement.required:
        work_status = "✅ Compliant" if member.work_requirement.hours_reported >= 80 else "❌ Non-compliant"
        print(f"\nWork Requirement: {work_status} ({member.work_requirement.hours_reported}/80 hours)")
        if member.work_requirement.exemption_status != "none":
            print(f"  Exemption Status: {member.work_requirement.exemption_status}")
    else:
        print("\n✅ No work requirements")
        if member.work_requirement.exemption_status != "none":
            print(f"  Exemption Reason: {member.work_requirement.exemption_status}")
    
    # Print interactions
    if interactions:
        print(f"\nInteractions ({len(interactions)}):")
        for i, interaction in enumerate(interactions[-3:], 1):  # Show last 3 interactions
            print(f"  {i}. Agent: {interaction['agent']}")
            print(f"     Action: {interaction['action']}")
            print(f"     Result: {interaction['result']}")
    
    # Print audit summary
    if audit_log:
        print(f"\nAudit Log: {len(audit_log)} entries recorded")
        if state.get("compliance_status"):
            print(f"Compliance Status: {state['compliance_status']}")

def run_demo():
    """Run the Medicaid Assist workflow demo."""
    print_header("MEDICAID ASSIST WORKFLOW DEMO")
    
    # Load members from the synthetic data
    print("Loading synthetic member data...")
    members = load_members()
    print(f"Loaded {len(members)} members")
    
    # Get samples of different member types for demo
    print("\nFinding sample members for demonstration...")
    
    # Member needing renewal
    renewal_members = get_members_by_status("renewal_needed")
    renewal_sample = renewal_members[0] if renewal_members else None
    
    # Member with work requirements
    work_req_members = [m for m in members.values() if m.work_requirement.required]
    work_sample = next((m for m in work_req_members if m.work_requirement.hours_reported < 80), None)
    
    # Member needing documents
    doc_members = [
        m for m in members.values() 
        if m.eligibility.required_documents and len(m.eligibility.required_documents) > 0
    ]
    doc_sample = doc_members[0] if doc_members else None
    
    # Member with a different language preference
    lang_members = [m for m in members.values() if m.contact.language != "English"]
    lang_sample = lang_members[0] if lang_members else None
    
    # Process each sample through the workflow
    samples = [
        ("Member Needing Renewal", renewal_sample),
        ("Member Below Work Requirements", work_sample),
        ("Member Missing Documents", doc_sample),
        ("Non-English Speaking Member", lang_sample)
    ]
    
    # Display member info and run workflow for each sample
    for name, member in samples:
        if member:
            print_section(f"PROCESSING {name.upper()}: {member.first_name} {member.last_name}")
            print(format_member_info(member))
            
            print("\nRunning agent workflow...")
            result = process_member(member.id)
            
            print("\nWorkflow complete! Final state:")
            pretty_print_state(result)
            
            # Add a pause for readability
            input("\nPress Enter to continue to next sample...")
        else:
            print(f"\nNo sample available for: {name}")
    
    print_header("DEMO COMPLETE")
    print("""
The Medicaid Assist workflow has demonstrated:

1. Eligibility verification
2. Document requirement identification
3. Work requirement compliance checking
4. Member notification generation
5. Multilingual support
6. Audit logging and compliance verification

This demo used synthetic data to simulate real-world Medicaid member scenarios.
    """)

if __name__ == "__main__":
    try:
        run_demo()
    except Exception as e:
        logger.error(f"Error in demo: {str(e)}")
        print(f"\nError: {str(e)}")
        import traceback
        traceback.print_exc()
