#!/bin/bash

# ANSI color codes
RED=$(tput setaf 1)
GREEN=$(tput setaf 2)
CYAN=$(tput setaf 6)
BOLD=$(tput bold)
RESET=$(tput sgr0)


bash img/png2jpg.sh




find . -type f -name '*.html' | while IFS= read -r file; do

  matches=$(grep -nE 'img/[^"]+\.png\b' "$file")

  if [ -n "$matches" ]; then
    echo "${CYAN}${BOLD}Stagging: $file${RESET}"

    echo "$matches" | while IFS= read -r line; do
      linenum=$(echo "$line" | cut -d: -f1)
      content=$(echo "$line" | cut -d: -f2-)

      echo "$content" | grep -oE 'img/[^"]+\.png\b' | while IFS= read -r match; do
        replaced=$(echo "$match" | sed 's/\.png$/.jpg/')
        printf "%s:%s: %s%s%s → %s%s%s\n" \
          "$file" "$linenum" \
          "$RED" "$match" "$RESET" \
          "$GREEN" "$replaced" "$RESET"
      done
    done

    sed -i 's|\(img/[^"]*\)\.png\b|\1.jpg|g' "$file"
  fi
done

echo "${GREEN}All HTML files processed.${RESET}"
