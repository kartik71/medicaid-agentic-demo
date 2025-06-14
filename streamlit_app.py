"""
Medicaid Assist - Streamlit Demo Application

This Streamlit app provides a visual interface for demonstrating the
Medicaid Assist agentic workflow using synthetic member data.
"""

import streamlit as st
import pandas as pd
import json
import time
from datetime import datetime
import matplotlib.pyplot as plt
import seaborn as sns
import altair as alt
import numpy as np
from PIL import Image
import os

# Import project modules
from main import process_member, simulate_workflow
from models.state import AgentState
from storage.member_repository import get_member, get_all_members, get_all_member_ids, update_member, load_members
from utils.logger import setup_logger

# Load members data
if 'members_loaded' not in st.session_state:
    load_members()  # Load members only once
    st.session_state.members_loaded = True

# Set page config
st.set_page_config(
    page_title="Medicaid Assist Agentic AI Demo",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for styling
st.markdown("""
<style>
    .main-header {color:#1E88E5; font-size:40px; font-weight:bold; margin-bottom:0px}
    .sub-header {color:#424242; font-size:20px; margin-top:0px}
    .agent-box {
        border:1px solid #ddd;
        border-radius:5px;
        padding:10px;
        margin-bottom:10px;
    }
    .agent-header {
        font-weight:bold;
        border-bottom:1px solid #eee;
        padding-bottom:5px;
        margin-bottom:10px;
    }
    .stat-box {
        background-color:#f8f9fa;
        border-radius:5px;
        padding:10px;
        text-align:center;
    }
    .highlight-text {color:#1E88E5; font-weight:bold}
    div[data-testid="stVerticalBlock"] div[style*="flex-direction: column;"] div[data-testid="stVerticalBlock"] {
        background-color: #f9f9f9;
        border-radius: 5px;
        padding: 10px;
        margin-bottom: 10px;
    }
</style>
""", unsafe_allow_html=True)

def run_demo_with_progress():
    """Run the workflow with a progress bar and animations"""
    placeholder = st.empty()
    progress_text = "Running Medicaid Assist agentic workflow..."
    progress_bar = st.progress(0)
    
    # Initialize state
    member = get_member(member_id)
    initial_state = AgentState(
        member=member,
        interactions=[],
        audit_log=[],
        documents_required=[],
        documents_submitted=[],
        eligibility_verified=False,
        work_requirements_met=False
    )
    
    # Simulate the workflow with progress updates
    state = initial_state.copy()
    
    # Step 1: Eligibility Check (20%)
    with placeholder.container():
        st.subheader("🧐 Eligibility Checker Agent")
        st.write("Verifying member eligibility status...")
    time.sleep(1)
    progress_bar.progress(20)
    
    # Update state with eligibility results
    state["eligibility_verified"] = True
    if member.eligibility.required_documents:
        state["documents_required"] = member.eligibility.required_documents
    
    # Add interaction for eligibility check
    state["interactions"].append({
        "timestamp": datetime.now().isoformat(),
        "agent": "eligibility_checker",
        "action": "check_eligibility",
        "result": "completed",
        "details": f"Status: {member.eligibility.status}, Renewal: {member.eligibility.renewal_date}"
    })
    
    # Add to audit log
    state["audit_log"].append({
        "timestamp": datetime.now().isoformat(),
        "agent": "eligibility_checker",
        "action": "eligibility_verification",
        "member_id": member.id,
        "status": "completed"
    })
    
    # Step 2: Document Assistant (40%)
    if state["documents_required"]:
        with placeholder.container():
            st.subheader("📄 Document Assistant Agent")
            st.write("Checking required documentation...")
        time.sleep(1)
        
        # Simulate document checking
        documents_submitted = []
        for doc in state["documents_required"]:
            if member.documents and doc in member.documents:
                documents_submitted.append(doc)
        
        state["documents_submitted"] = documents_submitted
        
        # Add document processing interaction
        state["interactions"].append({
            "timestamp": datetime.now().isoformat(),
            "agent": "document_assistant",
            "action": "check_documents",
            "result": "completed" if len(documents_submitted) == len(state["documents_required"]) else "pending",
            "details": f"Submitted: {len(documents_submitted)}/{len(state['documents_required'])}"
        })
        
        # Add to audit log
        state["audit_log"].append({
            "timestamp": datetime.now().isoformat(),
            "agent": "document_assistant",
            "action": "document_validation",
            "member_id": member.id,
            "status": "completed" if len(documents_submitted) == len(state["documents_required"]) else "incomplete"
        })
    
    progress_bar.progress(40)
    
    # Step 3: Work Requirement (60%)
    if member.work_requirement.required:
        with placeholder.container():
            st.subheader("💼 Work Requirement Agent")
            st.write("Verifying reported work hours...")
        time.sleep(1)
        
        # Check if work hours are sufficient
        hours_reported = member.work_requirement.hours_reported
        hours_required = 80
        state["work_requirements_met"] = hours_reported >= hours_required
        
        # Add work requirement interaction
        state["interactions"].append({
            "timestamp": datetime.now().isoformat(),
            "agent": "work_requirement",
            "action": "verify_hours",
            "result": "compliant" if state["work_requirements_met"] else "non_compliant",
            "details": f"Hours: {hours_reported}/{hours_required}"
        })
        
        # Add to audit log
        state["audit_log"].append({
            "timestamp": datetime.now().isoformat(),
            "agent": "work_requirement",
            "action": "work_verification",
            "member_id": member.id,
            "status": "compliant" if state["work_requirements_met"] else "non_compliant",
            "hours": hours_reported
        })
    
    progress_bar.progress(60)
    
    # Step 4: Reminder Agent (75%)
    with placeholder.container():
        st.subheader("🔔 Reminder Agent")
        st.write("Generating personalized reminders...")
    time.sleep(1)
    
    # Determine what reminders are needed
    reminders = []
    
    if member.eligibility.status == "renewal_needed":
        reminders.append(f"Your Medicaid benefits expire on {member.eligibility.renewal_date}. Please renew soon.")
    
    if state.get("documents_required") and len(state.get("documents_submitted", [])) < len(state["documents_required"]):
        missing_docs = set(state["documents_required"]) - set(state.get("documents_submitted", []))
        reminders.append(f"Please submit the following documents: {', '.join(missing_docs)}")
    
    if member.work_requirement.required and not state.get("work_requirements_met"):
        reminders.append(f"You need to report {80 - member.work_requirement.hours_reported} more work hours this month.")
    
    # Store the reminders
    state["reminders"] = reminders
    state["reminders_sent"] = len(reminders) > 0
    
    # Add reminder interaction if any reminders were generated
    if reminders:
        state["interactions"].append({
            "timestamp": datetime.now().isoformat(),
            "agent": "reminder",
            "action": "send_notifications",
            "result": "sent",
            "details": f"{len(reminders)} reminders sent via {member.contact.preferred_contact_method}"
        })
        
        # Add to audit log
        state["audit_log"].append({
            "timestamp": datetime.now().isoformat(),
            "agent": "reminder",
            "action": "notification_sent",
            "member_id": member.id,
            "status": "completed",
            "channel": member.contact.preferred_contact_method
        })
    
    progress_bar.progress(75)
    
    # Step 5: Multilingual Support (85%)
    if member.contact.language != "English":
        with placeholder.container():
            st.subheader("🌐 Multilingual Chat Agent")
            st.write(f"Translating communications to {member.contact.language}...")
        time.sleep(1)
        
        state["multilingual_supported"] = True
        state["interactions"].append({
            "timestamp": datetime.now().isoformat(),
            "agent": "multilingual_chat",
            "action": "translate_communications",
            "result": "translated",
            "details": f"Content translated to {member.contact.language}"
        })
        
        # Add to audit log
        state["audit_log"].append({
            "timestamp": datetime.now().isoformat(),
            "agent": "multilingual_chat",
            "action": "translation",
            "member_id": member.id,
            "language": member.contact.language,
            "status": "completed"
        })
    else:
        state["multilingual_supported"] = False
    
    progress_bar.progress(85)
    
    # Step 6: Audit & Compliance (100%)
    with placeholder.container():
        st.subheader("🧾 Audit & Compliance Agent")
        st.write("Validating compliance status...")
    time.sleep(1)
    
    # Check compliance status
    compliance_issues = []
    
    if member.work_requirement.required and not state.get("work_requirements_met"):
        compliance_issues.append("Work requirements not met")
    
    if state.get("documents_required") and len(state.get("documents_submitted", [])) < len(state["documents_required"]):
        compliance_issues.append("Missing required documents")
    
    if member.eligibility.status == "inactive":
        compliance_issues.append("Inactive eligibility status")
    
    # Set compliance status
    state["compliance_status"] = "compliant" if not compliance_issues else "non_compliant"
    if compliance_issues:
        state["compliance_issues"] = compliance_issues
    
    # Add audit interaction
    state["interactions"].append({
        "timestamp": datetime.now().isoformat(),
        "agent": "audit_compliance",
        "action": "verify_compliance",
        "result": state["compliance_status"],
        "details": ", ".join(compliance_issues) if compliance_issues else "No compliance issues"
    })
    
    # Add to audit log
    state["audit_log"].append({
        "timestamp": datetime.now().isoformat(),
        "agent": "audit_compliance",
        "action": "compliance_verification",
        "member_id": member.id,
        "status": state["compliance_status"],
        "issues": compliance_issues if compliance_issues else []
    })
    
    progress_bar.progress(100)
    placeholder.empty()
    
    return state
