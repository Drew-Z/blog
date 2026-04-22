@echo off
setlocal

set "ROOT=D:\workspace4Codex"
set "FONT_NAME=NotoSansCJKsc-Regular.otf"

call :write_theme "%ROOT%\game-first-tetris\assets\fonts\ui_theme.tres"
call :write_theme "%ROOT%\game-next-spacewar\assets\fonts\ui_theme.tres"
call :write_theme "%ROOT%\raiden-prototype\assets\fonts\ui_theme.tres"
call :write_theme "%ROOT%\intespace\assets\fonts\ui_theme.tres"
call :write_theme "%ROOT%\space-war\assets\fonts\ui_theme.tres"

echo.
echo Godot UI themes now use:
echo   res://assets/fonts/%FONT_NAME%
exit /b 0

:write_theme
set "THEME_FILE=%~1"
if not exist "%~dp1" mkdir "%~dp1"
> "%THEME_FILE%" echo [gd_resource type="Theme" load_steps=2 format=3]
>> "%THEME_FILE%" echo.
>> "%THEME_FILE%" echo [ext_resource type="FontFile" path="res://assets/fonts/%FONT_NAME%" id="1"]
>> "%THEME_FILE%" echo.
>> "%THEME_FILE%" echo [resource]
>> "%THEME_FILE%" echo default_font = ExtResource("1")
>> "%THEME_FILE%" echo default_font_size = 16
echo Updated %THEME_FILE%
exit /b 0
