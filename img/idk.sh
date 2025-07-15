for i in *.png; do
  [ -e "$i" ] || continue
  output="${i%.png}.jpg"
  convert "$i" -background white -alpha remove -alpha off "$output"
done
