Galgame Player - Portable Version
==============================

System Requirements
------------------
- Windows 7 or higher
- Java 17 or higher

Quick Start
-----------
Option 1: Use PowerShell (Recommended)
1. Right-click on "quick-start.ps1"
2. Select "Run with PowerShell"
3. Wait for service to start
4. Open browser: http://localhost:8080

Option 2: Use Batch File
1. Double-click "start.bat"
2. Wait for service to start
3. Open browser: http://localhost:8080

Option 3: Use PowerShell with Details
1. Right-click on "start.ps1"
2. Select "Run with PowerShell"
3. Follow the on-screen instructions

Features
--------
- Game Library: Browse and manage games
- Game Details: View game info and saves
- Game Player: Play visual novels
- Admin Panel: Upload games, scripts and images

Directory Structure
------------------
galgame-backend-1.0.0.jar  - Backend service
frontend/                       - Frontend static files
start.bat                       - Simple batch launcher
start.ps1                       - PowerShell launcher with details
quick-start.ps1                 - Quick PowerShell launcher
data/                          - Database files (auto-created)
uploads/                       - Uploaded images (auto-created)

Notes
-----
1. Database files are created automatically on first run
2. Database files are saved in the data directory
3. Uploaded images are saved in the uploads directory
4. Close the command window to stop the service
5. Port 8080 must be available

Known Issues
------------
- You may see some SQL warnings about the user table on startup
- This is normal and does not affect functionality
- The user table is reserved for future authentication features

Troubleshooting
---------------
Q: Script shows encoding errors or garbled text?
A: Use the PowerShell scripts (start.ps1 or quick-start.ps1) instead

Q: "Java not found" error?
A: Install Java 17 or higher from: https://www.oracle.com/java/technologies/downloads/

Q: Port 8080 already in use?
A: Close the application using port 8080, or modify the port configuration

Q: How to view the database?
A: Visit http://localhost:8080/h2-console with default connection settings

Q: How to backup data?
A: Backup the data directory and uploads directory

For more troubleshooting information, see "故障排除.txt" (Troubleshooting Guide)

Technical Support
-----------------
If you encounter any issues, please contact the technical support team.

Version Information
------------------
Version: 1.0.0
Release Date: 2026-03-03