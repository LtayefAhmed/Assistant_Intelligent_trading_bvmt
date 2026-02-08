@echo off
cd /d "%~dp0"

echo Installing dependencies...
call npm install

echo Starting Frontend Server...
call npm run dev
