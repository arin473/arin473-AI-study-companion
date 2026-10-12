@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
"%~dp0run_node.bat" --dummy >nul 2>&1
call "C:\Program Files\nodejs\npm.cmd" %*
