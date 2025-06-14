"""
Reminder Agent

Responsibilities:
- Sends automated, personalized notifications to members
- Manages communication via SMS, email, and app notifications
- Tracks member communication preferences
- Ensures timely reminders for renewal deadlines
"""

from typing import Dict, Any, Callable
from langchain_core.language_models.base import BaseLanguageModel
from langchain.prompts import ChatPromptTemplate
from models.state import AgentState
from models.member import Member
from utils.logger import setup_logger

# Set up logger
logger = setup_logger()

def create_reminder_agent(llm: BaseLanguageModel) -> Callable:
    """
    Creates a reminder agent that sends personalized notifications to members.
    
    Args:
        llm: The language model to use
        
    Returns:
        Callable: A function that processes the state
    """
    # System prompt for generating personalized reminders
    reminder_prompt = ChatPromptTemplate.from_messages([
        ("system", """You are a Reminder Agent for Medicaid members.
        
Your responsibilities:
1. Generate personalized notifications for members based on their status
2. Select the appropriate notification channel (SMS, email, app notification)
3. Adapt communication style to member preferences and language
4. Ensure members are notified about upcoming deadlines and requirements

Use the member information to create appropriate, personalized reminders.
"""),
        ("human", """
Member information:
{member_json}

Eligibility status:
{eligibility_status}

Documents required:
{documents_required}

Work requirements:
{work_requirements}

Generate appropriate personalized reminders for this member.
""")
    ])
    
    # Create the chain
    reminder_chain = reminder_prompt | llm
    
    def send_reminders(state: AgentState) -> AgentState:
        """
        Generates and sends reminders to a member based on their current status.
        
        Args:
            state: The current workflow state
            
        Returns:
            Updated workflow state
        """
        member = state["member"]
        logger.info(f"Generating reminders for member {member.id}")
        
        # In a real implementation, this would:
        # 1. Determine what notifications are needed
        # 2. Generate personalized content using the LLM
        # 3. Send through appropriate channels (SMS/email/app)
        # 4. Track delivery status
        
        # For this skeleton, we'll simulate reminder generation and sending
        try:
            # Determine member's preferred contact method and language
            preferred_method = member.contact.preferred_contact_method
            preferred_language = member.contact.preferred_language
            
            # Simulate reminder content generation
            reminder_content = f"Important Medicaid reminder for {member.first_name} {member.last_name}"
            
            if state["eligibility_verified"] and not state["work_requirements_needed"]:
                reminder_type = "renewal_reminder"
                reminder_content += " - Your Medicaid benefits need to be renewed"
            elif not state["eligibility_verified"]:
                reminder_type = "documentation_needed"
                reminder_content += " - Documentation needed for your Medicaid benefits"
            elif state["work_requirements_needed"]:
                reminder_type = "work_verification_needed"
                reminder_content += " - Please report your work hours"
            
            # Simulate sending notification
            # In real implementation, this would call notification service APIs
            logger.info(f"Sending {reminder_type} via {preferred_method} in {preferred_language} to member {member.id}")
            
            # Update state - track the communication
            notification = {
                "timestamp": "2023-06-13T16:30:00", # Would be datetime.now() in real implementation
                "channel": preferred_method,
                "language": preferred_language,
                "type": reminder_type,
                "content": reminder_content,
                "status": "sent"  # Would track actual delivery status in real implementation
            }
            
            state["interactions"].append(notification)
            
            # Add to audit log
            state["audit_log"].append({
                "timestamp": "2023-06-13T16:30:00", # Would be datetime.now() in real implementation
                "agent": "reminder",
                "action": "send_notification",
                "member_id": member.id,
                "notification_type": reminder_type,
                "channel": preferred_method
            })
            
            logger.info(f"Reminder sent to member {member.id}")
            
        except Exception as e:
            logger.error(f"Error sending reminder to member {member.id}: {str(e)}")
            # In case of error, log the failure
            state["audit_log"].append({
                "timestamp": "2023-06-13T16:30:00", # Would be datetime.now() in real implementation
                "agent": "reminder",
                "action": "send_notification",
                "member_id": member.id,
                "result": "error",
                "error": str(e)
            })
        
        return state
    
    return send_reminders
