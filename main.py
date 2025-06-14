#!/usr/bin/env python
"""
Main entry point for the Medicaid Assist application.
This integrates six specialized agents in a LangGraph workflow.
"""

import os
from dotenv import load_dotenv
from typing import Dict, List, Any, TypedDict, Optional
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, END

# Import agent modules
from agents.eligibility_checker import create_eligibility_checker_agent
from agents.reminder import create_reminder_agent
from agents.document_assistant import create_document_assistant_agent
from agents.work_requirement import create_work_requirement_agent
from agents.multilingual_chat import create_multilingual_chat_agent
from agents.audit_compliance import create_audit_compliance_agent

# Import utilities
from utils.logger import setup_logger
from models.member import Member
from models.state import AgentState

# Load environment variables
load_dotenv()

# Set up logging
logger = setup_logger()

def create_medicaid_workflow(model_name: str = "gpt-4", temperature: float = 0.0) -> StateGraph:
    """
    Create the Medicaid Assist workflow using LangGraph.
    
    Args:
        model_name: The LLM model to use
        temperature: The temperature setting for generation
        
    Returns:
        A configured StateGraph representing the workflow
    """
    # Initialize the LLM
    llm = ChatOpenAI(model=model_name, temperature=temperature)
    
    # Create agent instances
    eligibility_agent = create_eligibility_checker_agent(llm)
    reminder_agent = create_reminder_agent(llm)
    document_agent = create_document_assistant_agent(llm)
    work_agent = create_work_requirement_agent(llm)
    chat_agent = create_multilingual_chat_agent(llm)
    audit_agent = create_audit_compliance_agent(llm)
    
    # Initialize the workflow graph
    workflow = StateGraph(AgentState)
    
    # Add nodes for each agent
    workflow.add_node("eligibility", eligibility_agent)
    workflow.add_node("reminder", reminder_agent)
    workflow.add_node("document", document_agent)
    workflow.add_node("work", work_agent)
    workflow.add_node("chat", chat_agent)
    workflow.add_node("audit", audit_agent)
    
    # Define conditional routing based on member state and needs
    def route_from_eligibility(state: AgentState) -> str:
        """Route to appropriate next agent based on eligibility check results."""
        if not state["eligibility_verified"]:
            return "document"  # Need documentation
        elif state["work_requirements_needed"]:
            return "work"  # Need work requirement verification
        else:
            return "reminder"  # Send renewal reminder
    
    # Add conditional routing edges
    workflow.add_conditional_edges(
        "eligibility",
        route_from_eligibility,
        {
            "document": "document",
            "work": "work",
            "reminder": "reminder"
        }
    )
    
    # Add standard edges
    workflow.add_edge("document", "audit")
    workflow.add_edge("work", "audit")
    workflow.add_edge("reminder", "audit")
    workflow.add_edge("chat", "audit")  # Chat can happen anytime but logs to audit
    
    # All paths eventually route to audit for compliance tracking
    workflow.add_edge("audit", END)
    
    # Entry point is the eligibility checker
    workflow.set_entry_point("eligibility")
    
    return workflow

def process_member(member_id: str) -> Dict[str, Any]:
    """
    Process a member through the Medicaid assist workflow.
    
    Args:
        member_id: The ID of the member to process
        
    Returns:
        The final state after workflow completion
    """
    # Get member data
    from storage.member_repository import get_member
    member = get_member(member_id)
    
    # Initialize workflow
    workflow = create_medicaid_workflow()
    
    # Compile the workflow
    app = workflow.compile()
    
    # Set initial state
    initial_state = AgentState(
        member=member,
        eligibility_verified=False,
        work_requirements_needed=False,
        documents_required=[],
        documents_submitted=[],
        work_hours_reported=0,
        interactions=[],
        audit_log=[]
    )
    
    # Execute the workflow
    logger.info(f"Starting workflow for member {member_id}")
    result = app.invoke(initial_state)
    logger.info(f"Workflow completed for member {member_id}")
    
    return result

def simulate_workflow(state: AgentState) -> AgentState:
    """
    Simulate the workflow for demonstration purposes without using an actual LLM.
    This allows the demo to run without requiring API keys.
    
    Args:
        state: The initial state
        
    Returns:
        The simulated final state
    """
    logger.info("Simulating workflow for demonstration")
    
    # Make a copy of the state to avoid modifying the original
    state = state.copy()
    member = state["member"]
    
    # Step 1: Eligibility Checker
    logger.info("Simulating eligibility check")
    state["eligibility_verified"] = True
    
    # Determine required documents based on the member's status
    if member.eligibility.required_documents:
        state["documents_required"] = member.eligibility.required_documents
    
    # Add an interaction for the eligibility check
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
    
    # Step 2: Route based on eligibility results
    if state["documents_required"]:
        # Document Assistant processing
        logger.info("Simulating document assistant")
        
        # Simulate document checking
        documents_submitted = []
        for doc in state["documents_required"]:
            # Check if the document is already on file
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
    
    # Step 3: Check work requirements if applicable
    if member.work_requirement.required:
        logger.info("Simulating work requirement check")
        
        # Check if enough hours are reported
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
    
    # Step 4: Generate reminders
    logger.info("Simulating reminder generation")
    
    # Determine what reminders are needed
    reminders = []
    
    if member.eligibility.status == "renewal_needed":
        reminders.append(f"Your Medicaid benefits expire on {member.eligibility.renewal_date}. Please renew soon.")
    
    if state.get("documents_required") and len(state.get("documents_submitted", [])) < len(state["documents_required"]):
        missing_docs = set(state["documents_required"]) - set(state.get("documents_submitted", []))
        reminders.append(f"Please submit the following documents: {', '.join(missing_docs)}")
    
    if member.work_requirement.required and not state.get("work_requirements_met"):
        reminders.append(f"You need to report {80 - member.work_requirement.hours_reported} more work hours this month.")
    
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
    
    # Step 5: Simulate multilingual support if needed
    if member.contact.language != "English":
        logger.info(f"Simulating multilingual support for {member.contact.language}")
        
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
    
    # Step 6: Final audit and compliance check
    logger.info("Simulating audit and compliance verification")
    
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
    
    return state

def process_member_with_simulation(member_id: str) -> Dict[str, Any]:
    """
    Process a member through the Medicaid assist workflow with simulation.
    
    Args:
        member_id: The ID of the member to process
        
    Returns:
        The final state after workflow completion
    """
    # Get member data
    from storage.member_repository import get_member
    member = get_member(member_id)
    
    # Initialize workflow
    workflow = create_medicaid_workflow()
    
    # Compile the workflow
    app = workflow.compile()
    
    # Set initial state
    initial_state = AgentState(
        member=member,
        eligibility_verified=False,
        work_requirements_needed=False,
        documents_required=[],
        documents_submitted=[],
        work_hours_reported=0,
        interactions=[],
        audit_log=[]
    )
    
    # Execute the workflow with simulation
    logger.info(f"Starting workflow for member {member_id}")
    result = simulate_workflow(initial_state)
    logger.info(f"Workflow completed for member {member_id}")
    
    return result

if __name__ == "__main__":
    # Example usage
    import argparse
    
    parser = argparse.ArgumentParser(description="Medicaid Assist workflow")
    parser.add_argument("--member_id", type=str, help="Member ID to process")
    parser.add_argument("--run_api", action="store_true", help="Run as API server")
    
    args = parser.parse_args()
    
    if args.run_api:
        # Start API server
        import uvicorn
        from api.app import app
        
        uvicorn.run(app, host="0.0.0.0", port=8000)
    elif args.member_id:
        # Process single member
        result = process_member_with_simulation(args.member_id)
        print(f"Processing completed for {args.member_id}")
        print(f"Eligibility status: {result['eligibility_verified']}")
        print(f"Audit logs generated: {len(result['audit_log'])}")
    else:
        print("Please provide --member_id or --run_api flag")
