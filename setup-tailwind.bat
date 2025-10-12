@echo off
echo ✅ Starting Tailwind clean install...

:: Navigate to project folder
cd /d "C:\Users\giant\Projects\Personal\Class-Attendance-Project"

:: Remove old installs
echo Removing node_modules and package-lock.json...
rmdir /s /q node_modules
del /f /q package-lock.json

:: Clear npm cache
echo Clearing npm cache...
npm cache clean --force

:: Install all project dependencies fresh
echo Installing project dependencies...
npm install --legacy-peer-deps

:: Install Tailwind + PostCSS + Autoprefixer explicitly
echo Installing Tailwind, PostCSS, Autoprefixer...
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest --legacy-peer-deps --force

:: Verify Tailwind binary exists
if exist node_modules\.bin\tailwindcss (
    echo ✅ Tailwind binary found!
) else (
    echo ❌ Tailwind binary NOT found — installation failed
    pause
    exit /b 1
)

:: Build Tailwind CSS once
echo Building Tailwind CSS...
.\node_modules\.bin\tailwindcss -i ./src/css/index.css -o ./dist/output.css

:: Start watching for changes
echo Watching Tailwind CSS for changes...
.\node_modules\.bin\tailwindcss -i ./src/css/index.css -o ./dist/output.css --watch

pause
