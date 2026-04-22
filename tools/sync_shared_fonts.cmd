@echo off
setlocal

set "ROOT=D:\workspace4Codex"
set "FONT_SRC=%ROOT%\resources\font"
set "PRIMARY_FONT=NotoSansCJKsc-Regular.otf"

if not exist "%FONT_SRC%\%PRIMARY_FONT%" (
  echo Missing shared font:
  echo   %FONT_SRC%\%PRIMARY_FONT%
  exit /b 1
)

set "FONT_DEST=%ROOT%\game-first-tetris\assets\fonts"
if not exist "%FONT_DEST%" mkdir "%FONT_DEST%"
copy /y "%FONT_SRC%\%PRIMARY_FONT%" "%FONT_DEST%\" >nul || exit /b 1
echo Synced %PRIMARY_FONT% to %FONT_DEST%

set "FONT_DEST=%ROOT%\game-next-spacewar\assets\fonts"
if not exist "%FONT_DEST%" mkdir "%FONT_DEST%"
copy /y "%FONT_SRC%\%PRIMARY_FONT%" "%FONT_DEST%\" >nul || exit /b 1
echo Synced %PRIMARY_FONT% to %FONT_DEST%

set "FONT_DEST=%ROOT%\raiden-prototype\assets\fonts"
if not exist "%FONT_DEST%" mkdir "%FONT_DEST%"
copy /y "%FONT_SRC%\%PRIMARY_FONT%" "%FONT_DEST%\" >nul || exit /b 1
echo Synced %PRIMARY_FONT% to %FONT_DEST%

set "FONT_DEST=%ROOT%\intespace\assets\fonts"
if not exist "%FONT_DEST%" mkdir "%FONT_DEST%"
copy /y "%FONT_SRC%\%PRIMARY_FONT%" "%FONT_DEST%\" >nul || exit /b 1
echo Synced %PRIMARY_FONT% to %FONT_DEST%

set "FONT_DEST=%ROOT%\space-war\assets\fonts"
if not exist "%FONT_DEST%" mkdir "%FONT_DEST%"
copy /y "%FONT_SRC%\%PRIMARY_FONT%" "%FONT_DEST%\" >nul || exit /b 1
echo Synced %PRIMARY_FONT% to %FONT_DEST%

echo.
echo Shared fonts synced from:
echo   %FONT_SRC%
