"""
Medicaid Assist Architecture Diagram Generator

This script generates a simple architecture diagram showing the Medicaid Assist
agent workflow using matplotlib.
"""

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import matplotlib.path as mpath
import numpy as np
import os

# Create output directory if it doesn't exist
os.makedirs(os.path.dirname(os.path.abspath(__file__)), exist_ok=True)

# Set up the figure
plt.figure(figsize=(12, 8))
ax = plt.gca()
ax.set_xlim(0, 10)
ax.set_ylim(0, 7)

# Remove axes
ax.axis('off')

# Define colors
colors = {
    'eligibility': '#3498db',  # Blue
    'document': '#f39c12',     # Orange
    'work': '#2ecc71',         # Green
    'reminder': '#9b59b6',     # Purple
    'multilingual': '#e74c3c', # Red
    'audit': '#34495e',        # Dark blue/gray
    'arrow': '#95a5a6',        # Light gray
    'background': '#f9f9f9'    # Light background
}

# Define agent boxes
agents = [
    {'name': 'Eligibility Checker Agent', 'x': 2, 'y': 5, 'color': colors['eligibility']},
    {'name': 'Document Assistant Agent', 'x': 5, 'y': 5, 'color': colors['document']},
    {'name': 'Work Requirement Agent', 'x': 8, 'y': 5, 'color': colors['work']},
    {'name': 'Reminder Agent', 'x': 5, 'y': 3, 'color': colors['reminder']},
    {'name': 'Multilingual Chat Agent', 'x': 2, 'y': 1, 'color': colors['multilingual']},
    {'name': 'Audit & Compliance Agent', 'x': 8, 'y': 1, 'color': colors['audit']}
]

# Draw background
background = plt.Rectangle((0.5, 0.5), 9, 6, fill=True, color=colors['background'], 
                         alpha=0.3, zorder=-1, linewidth=2, edgecolor='#dddddd')
ax.add_patch(background)

# Add title
plt.text(5, 6.5, 'Medicaid Assist: LangGraph Agent Workflow', 
         fontsize=16, fontweight='bold', ha='center')

# Draw agent boxes
for agent in agents:
    box = plt.Rectangle((agent['x'] - 1, agent['y'] - 0.5), 2, 1, fill=True, 
                      color=agent['color'], alpha=0.7, linewidth=2, 
                      edgecolor='black')
    ax.add_patch(box)
    plt.text(agent['x'], agent['y'], agent['name'], ha='center', va='center', 
             fontweight='bold', color='white')

# Draw workflow arrows
arrows = [
    # Main flow
    {'start': (2, 4.5), 'end': (2, 4.2), 'end_point': (5, 4.5)},  # Eligibility to Document
    {'start': (5, 4.5), 'end': (5, 4.2), 'end_point': (8, 4.5)},  # Document to Work
    {'start': (8, 4.5), 'end': (8, 4.2), 'end_point': (5, 3)},    # Work to Reminder
    {'start': (5, 2.5), 'end': (5, 2.2), 'end_point': (8, 1)},    # Reminder to Audit
    
    # Direct flows
    {'start': (2, 4.5), 'end': (3, 3.5), 'end_point': (5, 3)},    # Eligibility to Reminder
    {'start': (2, 4.5), 'end': (4, 3), 'end_point': (8, 1)},      # Eligibility to Audit
    
    # Multilingual connection
    {'start': (2, 1), 'end': (3, 1), 'end_point': (8, 1)},        # Multilingual to Audit
]

for arrow in arrows:
    ax.annotate('', xy=arrow['end_point'], xytext=arrow['start'],
               arrowprops=dict(arrowstyle='->', lw=1.5, color=colors['arrow']))

# Add legend for workflow phases
plt.text(1, 0.7, "1. Eligibility Verification", color=colors['eligibility'], fontweight='bold')
plt.text(3, 0.7, "2. Document Collection", color=colors['document'], fontweight='bold')
plt.text(5, 0.7, "3. Work Requirement Tracking", color=colors['work'], fontweight='bold')
plt.text(7.5, 0.7, "4. Compliance Logging", color=colors['audit'], fontweight='bold')

# Add member icon at the start
member_circle = plt.Circle((0.8, 5), 0.3, color='gray', alpha=0.7)
ax.add_patch(member_circle)
plt.text(0.8, 5, "👤", ha='center', va='center', fontsize=14)
plt.text(0.8, 4.5, "Member", ha='center')

# Add arrow from member to workflow
ax.annotate('', xy=(1, 5), xytext=(0.8, 5),
           arrowprops=dict(arrowstyle='->', lw=1.5, color=colors['arrow']))

# Save the diagram
plt.tight_layout()
plt.savefig(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'architecture_diagram.png'), 
            dpi=300, bbox_inches='tight')

if __name__ == '__main__':
    print("Architecture diagram saved to 'docs/architecture_diagram.png'")
