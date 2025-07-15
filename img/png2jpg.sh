#!/bin/bash

find . -type f -name '*.png' | while IFS= read -r file; do
  output="${file%.png}.jpg"

  if [ ! -f "$output" ]; then
    echo "Converting: $file -> $output"
    # Use 'magick convert' if 'convert' conflicts or not found
    if command -v magick >/dev/null 2>&1; then
      magick convert "$file" -background white -alpha remove -alpha off "$output"
    else
      convert "$file" -background white -alpha remove -alpha off "$output"
    fi
  else
    echo "Skipping existing $output"
  fi
done
#lol