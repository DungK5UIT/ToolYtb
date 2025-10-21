@echo off
echo 🌐 Starting Chrome with CORS disabled...

"C:\Program Files\Google\Chrome\Application\chrome.exe" --user-data-dir="C:/Chrome-dev-session" --disable-web-security --disable-features=VizDisplayCompositor --new-window http://localhost:3000

echo ✅ Chrome started with CORS disabled!
echo ⚠️  Use only for development!
pause
