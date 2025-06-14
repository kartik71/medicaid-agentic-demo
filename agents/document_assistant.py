"""
Document Assistant Agent

Responsibilities:
- Verifies required documentation for Medicaid eligibility
- Tracks document submission status
- Guides members on missing documentation requirements
- Validates submitted document types and completeness
"""

from typing import Dict, Any, Callable
from langchain_core.language_models.base import BaseLanguageModel
from langchain.prompts import ChatPromptTemplate
from models.state import AgentState
from models.member import Member
from utils.logger import setup_logger

# Set up logger
logger = setup_logger()

def create_document_assistant_agent(llm: BaseLanguageModel) -> Callable:
    """
    Creates a document assistant agent that handles verification and tracking
    of required documentation for Medicaid eligibility.
    
    Args:
        llm: The language model to use
        
    Returns:
        Callable: A function that processes the state
    """
    # System prompt for document assistance
    document_prompt = ChatPromptTemplate.from_messages([
        ("system", """You are a Document Assistant Agent for Medicaid.
        
Your responsibilities:
1. Verify if required documents have been submitted
2. Track document submission status
3. Guide members on what documents are still needed
4. Validate document types and completeness

Use the member information and document requirements to assist with documentation needs.
"""),
        ("human", """
Member information:
{member_json}

Current state:
{state_json}

Based on this information, verify document status and provide guidance on missing documents.
""")
    ])
    
    # Create the chain
    document_chain = document_prompt | llm
    
    def run_document_assistant(state: AgentState) -> AgentState:
        """
        Runs document verification and assistance process for a member.
        
        Args:
            state: The current workflow state
            
        Returns:
            Updated workflow state
        """
        member = state["member"]
        logger.info(f"Running document assistance for member {member.id}")
        
        # In a real implementation, this would:
        # 1. Check document requirements based on program eligibility
        # 2. Verify documents that have been submitted
        # 3. Identify missing documents
        # 4. Provide guidance on how to submit missing documents
        
        # For this skeleton, we'll simulate document checking
        try:
            # Get required documents from state
            required_documents = state.get("documents_required", [])
            
            # Check which documents have been submitted
            submitted_documents = []
            if member.documents:
                for doc in required_documents:
                    if doc in member.documents:
                        submitted_documents.append(doc)
            
            # Update state with submitted documents
            state["documents_submitted"] = submitted_documents
            
            # Determine if all documents are submitted
            all_documents_submitted = len(submitted_documents) == len(required_documents)
            
            # Add to audit log
            state["audit_log"].append({
                "timestamp": "2023-06-13T16:45:00",  # Would be datetime.now() in real implementation
                "agent": "document_assistant",
                "action": "document_verification",
                "member_id": member.id,
                "result": "complete" if all_documents_submitted else "incomplete",
                "missing_documents": [doc for doc in required_documents if doc not in submitted_documents]
            })
            
            logger.info(f"Document assistance completed for member {member.id}")
            
        except Exception as e:
            logger.error(f"Error in document assistance for member {member.id}: {str(e)}")
            # In case of error, log
            state["audit_log"].append({
                "timestamp": "2023-06-13T16:45:00",  # Would be datetime.now() in real implementation
                "agent": "document_assistant",
                "action": "document_verification",
                "member_id": member.id,
                "result": "error",
                "error": str(e)
            })
        
        return state
    
    return run_document_assistant
