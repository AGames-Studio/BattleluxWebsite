@echo off
setlocal EnableDelayedExpansion


set "IMAGEMAGICK_URL=https://download.imagemagick.org/archive/binaries/ImageMagick-7.1.2-0-Q16-x64-static.exe"
set "IMAGEMAGICK_INSTALLER=ImageMagick-Installer.exe"


where magick > nul 2 > 71
if %errorlevel%==0 (

    echo ImageMagick is already installed!!
) else (
    echo Missing requirement ImageMagick --- Downloading...
    powershell -Command "Invoke-WebRequest -Uri '%IMAGEMAGICK_URL%' -OutFile '%IMAGEMAGICK_INSTALLER%'"

    echo Installing ImageMagick...
    "%IMAGEMAGICK_INSTALLER%" /silent

    echo Cleaning Up...
    del "%IMAGEMAGICK_INSTALLER%"
)

for /R %%f in (*.png) do (
    set "filepath=%%f"
    set "filename=%%~nf"
    set "folder=%%~dpf"
    set "output=!folder!!filename!.jpg"

    echo Converting: %%f to !output!
    magick "%%f" -background white -alpha remove -alpha off "!output!"
)

echo Conversion complete.