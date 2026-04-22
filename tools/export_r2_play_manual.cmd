@echo off
setlocal

set "ROOT=D:\workspace4Codex"
set "BLOG=%ROOT%\blog"
set "GODOT=D:\Development\Godot\Godot_v4.6.1-stable_win64_console.exe"
set "REFRESH=%BLOG%\deploy\r2-play-refresh"
set "FINAL=%BLOG%\deploy\r2-play"
set "SYNC_FONTS=%BLOG%\tools\sync_shared_fonts.cmd"
set "APPLY_THEME=%BLOG%\tools\apply_godot_ui_theme.cmd"
set "PATCH_SHELL=%BLOG%\tools\patch_web_shell.mjs"

echo [1/5] Checking Godot processes...
tasklist | findstr /i "Godot_v4.6.1-stable_win64" >nul
if not errorlevel 1 (
  echo.
  echo Found running Godot processes. Close all Godot windows and try again.
  echo Recommended: reboot once if Windows reports "Access is denied" when killing them.
  exit /b 1
)

echo [2/5] Checking export templates...
if not exist "%APPDATA%\Godot\export_templates\4.6.1.stable\web_nothreads_release.zip" (
  echo.
  echo Missing export template:
  echo   %APPDATA%\Godot\export_templates\4.6.1.stable\web_nothreads_release.zip
  echo Open Godot once and install export templates before running this script.
  exit /b 1
)

echo [3/7] Syncing shared fonts and Godot UI themes...
call "%SYNC_FONTS%" || exit /b 1
call "%APPLY_THEME%" || exit /b 1

echo [4/7] Preparing clean refresh directory...
if exist "%REFRESH%" rmdir /s /q "%REFRESH%"
mkdir "%REFRESH%\first-tetris"
mkdir "%REFRESH%\next-spacewar"
mkdir "%REFRESH%\raiden"
mkdir "%REFRESH%\intespace"
mkdir "%REFRESH%\space-war"

echo [5/7] Exporting web builds...
"%GODOT%" --headless --path "%ROOT%\game-first-tetris" --export-release Web "%REFRESH%\first-tetris\index.html" || exit /b 1
"%GODOT%" --headless --path "%ROOT%\game-next-spacewar" --export-release Web "%REFRESH%\next-spacewar\index.html" || exit /b 1
"%GODOT%" --headless --path "%ROOT%\raiden-prototype" --export-release Web "%REFRESH%\raiden\index.html" || exit /b 1
"%GODOT%" --headless --path "%ROOT%\intespace" --export-release Web "%REFRESH%\intespace\index.html" || exit /b 1
"%GODOT%" --headless --path "%ROOT%\space-war" --export-release Web "%REFRESH%\space-war\index.html" || exit /b 1

echo [6/7] Patching exported web shells for centered layout...
node "%PATCH_SHELL%" ^
  "%REFRESH%\first-tetris" ^
  "%REFRESH%\next-spacewar" ^
  "%REFRESH%\raiden" ^
  "%REFRESH%\intespace" ^
  "%REFRESH%\space-war" || exit /b 1

echo [7/7] Copying refresh builds into final upload directory...
if not exist "%FINAL%\first-tetris" mkdir "%FINAL%\first-tetris"
if not exist "%FINAL%\next-spacewar" mkdir "%FINAL%\next-spacewar"
if not exist "%FINAL%\raiden" mkdir "%FINAL%\raiden"
if not exist "%FINAL%\intespace" mkdir "%FINAL%\intespace"
if not exist "%FINAL%\space-war" mkdir "%FINAL%\space-war"

robocopy "%REFRESH%\first-tetris" "%FINAL%\first-tetris" /MIR >nul
robocopy "%REFRESH%\next-spacewar" "%FINAL%\next-spacewar" /MIR >nul
robocopy "%REFRESH%\raiden" "%FINAL%\raiden" /MIR >nul
robocopy "%REFRESH%\intespace" "%FINAL%\intespace" /MIR >nul
robocopy "%REFRESH%\space-war" "%FINAL%\space-war" /MIR >nul

echo.
echo Web builds are ready in:
echo   %FINAL%
echo.
echo Upload these five folders to R2:
echo   first-tetris
echo   next-spacewar
echo   raiden
echo   intespace
echo   space-war
