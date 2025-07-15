#!/bin/bash

# ANSI color codes
RED=$(tput setaf 1)
GREEN=$(tput setaf 2)
CYAN=$(tput setaf 6)
BOLD=$(tput bold)
RESET=$(tput sgr0)






find . -type f -name '*.html' | while IFS= read -r file; do

  matches=$(grep -nE 'img/[^"]+\.jpg\b' "$file")

  if [ -n "$matches" ]; then
    echo "${CYAN}${BOLD}Stagging: $file${RESET}"

    echo "$matches" | while IFS= read -r line; do
      linenum=$(echo "$line" | cut -d: -f1)
      content=$(echo "$line" | cut -d: -f2-)

      echo "$content" | grep -oE 'img/[^"]+\.jpg\b' | while IFS= read -r match; do
        replaced=$(echo "$match" | sed 's/\.jpg$/.png/')
        printf "%s:%s: %s%s%s → %s%s%s\n" \
          "$file" "$linenum" \
          "$RED" "$match" "$RESET" \
          "$GREEN" "$replaced" "$RESET"
      done
    done

    sed -i 's|\(img/[^"]*\)\.jpg\b|\1.png|g' "$file"
  fi
done

echo "${GREEN}All HTML files processed.${RESET}"
#lol