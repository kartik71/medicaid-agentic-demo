#!/usr/bin/env python
"""
Azure Web App entry point for Medicaid Assist application.
This file serves as the entry point for the Azure Web App service.
"""

import os
import streamlit as st
import subprocess
import sys

if __name__ == "__main__":
    # Get port from Azure environment or use default
    port = int(os.environ.get("PORT", 8000))
    
    # Use subprocess to run the streamlit app with the correct command for Azure
    subprocess.run([
        sys.executable, "-m", "streamlit", "run", 
        "streamlit_app.py", 
        "--server.port", str(port), 
        "--server.address", "0.0.0.0",
        "--server.enableCORS", "false",
        "--server.enableXsrfProtection", "false"
    ])