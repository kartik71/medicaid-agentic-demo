"""
Multilingual Chat Agent

Responsibilities:
- Handles real-time, multilingual member interactions
- Provides assistance with enrollment, renewal, and general questions
- Adapts communication to member's language preferences
- Routes complex issues to appropriate specialists
"""

from typing import Dict, Any, Callable
from langchain_core.language_models.base import BaseLanguageModel
from langchain.prompts import ChatPromptTemplate
from models.state import AgentState
from models.member import Member
from utils.logger import setup_logger

# Set up logger
logger = setup_logger()

def create_multilingual_chat_agent(llm: BaseLanguageModel) -> Callable:
    """
    Creates a multilingual chat agent that handles member interactions.
    
    Args:
        llm: The language model to use
        
    Returns:
        Callable: A function that processes the state
    """
    # System prompt for multilingual chat
    chat_prompt = ChatPromptTemplate.from_messages([
        ("system", """You are a Multilingual Chat Agent for Medicaid members.
        
Your responsibilities:
1. Handle real-time member interactions in their preferred language
2. Provide assistance with enrollment, renewal, and general questions
3. Adapt communication style to member preferences
4. Route complex issues to appropriate specialists

Use the member information to provide appropriate multilingual support.
"""),
        ("human", """
Member information:
{member_json}

Current state:
{state_json}

Provide multilingual support based on member's language preference.
""")
    ])
    
    # Create the chain
    chat_chain = chat_prompt | llm
    
    def run_multilingual_chat(state: AgentState) -> AgentState:
        """
        Runs multilingual chat support for a member.
        
        Args:
            state: The current workflow state
            
        Returns:
            Updated workflow state
        """
        member = state["member"]
        logger.info(f"Running multilingual chat for member {member.id}")
        
        try:
            preferred_language = member.contact.preferred_language
            
            # Check if translation is needed
            if preferred_language != "English":
                # Simulate translation service
                logger.info(f"Providing support in {preferred_language} for member {member.id}")
                
                # Add interaction for multilingual support
                state["interactions"].append({
                    "timestamp": "2023-06-13T16:50:00",
                    "agent": "multilingual_chat",
                    "action": "language_support",
                    "result": "provided",
                    "language": preferred_language,
                    "details": f"Communications translated to {preferred_language}"
                })
                
                # Add to audit log
                state["audit_log"].append({
                    "timestamp": "2023-06-13T16:50:00",
                    "agent": "multilingual_chat",
                    "action": "translation_service",
                    "member_id": member.id,
                    "language": preferred_language,
                    "result": "completed"
                })
            else:
                # English - no translation needed
                state["interactions"].append({
                    "timestamp": "2023-06-13T16:50:00",
                    "agent": "multilingual_chat",
                    "action": "language_support",
                    "result": "not_needed",
                    "language": "English",
                    "details": "No translation required"
                })
                
                # Add to audit log
                state["audit_log"].append({
                    "timestamp": "2023-06-13T16:50:00",
                    "agent": "multilingual_chat",
                    "action": "language_check",
                    "member_id": member.id,
                    "language": "English",
                    "result": "no_translation_needed"
                })
            
            logger.info(f"Multilingual chat completed for member {member.id}")
            
        except Exception as e:
            logger.error(f"Error in multilingual chat for member {member.id}: {str(e)}")
            state["audit_log"].append({
                "timestamp": "2023-06-13T16:50:00",
                "agent": "multilingual_chat",
                "action": "language_support",
                "member_id": member.id,
                "result": "error",
                "error": str(e)
            })
        
        return state
    
    return run_multilingual_chat