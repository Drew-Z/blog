@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
for %%I in ("%SCRIPT_DIR%\..\..") do set "ROOT=%%~fI"
if defined WORKSPACE_ROOT set "ROOT=%WORKSPACE_ROOT%"
set "FONT_SRC=%ROOT%\resources\font"
if defined SHARED_FONT_DIR set "FONT_SRC=%SHARED_FONT_DIR%"
set "PRIMARY_FONT=NotoSansCJKsc-Regular.otf"

if not exist "%FONT_SRC%\%PRIMARY_FONT%" (
  if exist "%ROOT%\game-first-tetris\assets\fonts\%PRIMARY_FONT%" (
    set "FONT_SRC=%ROOT%\game-first-tetris\assets\fonts"
    echo Shared font source not found, using existing Tetris font copy.
  ) else (
    echo Missing shared font:
    echo   %FONT_SRC%\%PRIMARY_FONT%
    echo Set SHARED_FONT_DIR or place the font in game-first-tetris\assets\fonts.
    exit /b 1
  )
)

call :SyncFont "%ROOT%\game-first-tetris\assets\fonts" || exit /b 1
call :SyncFont "%ROOT%\game-next-spacewar\assets\fonts" || exit /b 1
call :SyncFont "%ROOT%\raiden-prototype\assets\fonts" || exit /b 1
call :SyncFont "%ROOT%\intespace\assets\fonts" || exit /b 1
call :SyncFont "%ROOT%\space-war\assets\fonts" || exit /b 1
call :SyncFont "%ROOT%\spacewar II\assets\fonts" || exit /b 1

echo.
echo Shared fonts synced from:
echo   %FONT_SRC%
exit /b 0

:SyncFont
set "FONT_DEST=%~1"
if not exist "%FONT_DEST%" mkdir "%FONT_DEST%"
for %%S in ("%FONT_SRC%\%PRIMARY_FONT%") do set "FONT_SOURCE_FILE=%%~fS"
for %%D in ("%FONT_DEST%\%PRIMARY_FONT%") do set "FONT_DEST_FILE=%%~fD"
if /I "%FONT_SOURCE_FILE%"=="%FONT_DEST_FILE%" (
  echo %PRIMARY_FONT% already present at %FONT_DEST%
  exit /b 0
)
copy /y "%FONT_SOURCE_FILE%" "%FONT_DEST%\" >nul || exit /b 1
echo Synced %PRIMARY_FONT% to %FONT_DEST%
exit /b 0
