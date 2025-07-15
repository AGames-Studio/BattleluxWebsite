@echo off
setlocal EnableDelayedExpansion

call img/png2jpg.bat
if %errorlevel% neq 0 (
    echo Failed to convert png to jpg. Aborting.
    exit /b %errorlevel%
)



for /f "tokens=2 delims=:" %%a in ('"prompt $E & for %%b in (1) do rem"') do set "ESC=%%a"
set "RED=%ESC%[31m"
set "GREEN=%ESC%[32m"
set "CYAN=%ESC%[36;1m"
set "RESET=%ESC%[0m"

echo.

for /R %%F in (*.html) do (
    set "file=%%F"
    set "found="

   
    for /f "tokens=1* delims=:" %%A in ('findstr /n /r "img/[^""]\+\.png" "%%F"') do (
        set "lineNum=%%A"
        set "line=%%B"
        set "found=1"

        for /f "tokens=* delims=" %%M in ('echo(%%B ^| powershell -Command "[regex]::Matches($_, 'img/[^\""]+\.png') | ForEach-Object { $_.Value }"') do (
            set "match=%%M"
            set "replace=%%M"
            set "replace=!replace:.png=.jpg!"

            echo !CYAN!!file!!RESET!:!lineNum!: !RED!!match!!RESET! → !GREEN!!replace!!RESET!
        )
    )

    
    if defined found (
        powershell -Command "(Get-Content -Raw '%%F') -replace 'img/([^\""]+)\.png\b', 'img/$1.jpg' | Set-Content '%%F'"
    )
)

echo.
echo %GREEN%All HTML files processed.%RESET%
endlocal

pause

::lol