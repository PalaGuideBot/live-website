#!/bin/bash

URL=${URL:-"https://live.palaguidebot.fr/"}
RTMP_URL=${RTMP_URL:-"rtmp://live.twitch.tv/app/"}
RTMP_KEY=${RTMP_KEY:-"STREAM_TOKEN"}

if [[ -z "$URL" || -z "$RTMP_URL" || -z "$RTMP_KEY" ]]; then
  echo "URL, RTMP_URL ou RTMP_KEY manquant."
  exit 1
fi

Xvfb :99 -screen 0 1920x1080x24 -nolisten tcp -nolisten unix &
export DISPLAY=:99
sleep 2

unclutter -display :99 -idle 0 &

chromium \
  --no-sandbox \
  --disable-gpu \
  --kiosk "$URL" \
  --start-fullscreen \
  --window-size=1920,1080 \
  --window-position=0,0 \
  --disable-infobars \
  --disable-session-crashed-bubble \
  --hide-scrollbars \
  > /dev/null 2>&1 &

sleep 5

ffmpeg \
  -f x11grab -video_size 1920x1080 -i :99.0+0,0 \
  -stream_loop -1 -i music.mp3 \
  -c:v libx264 -preset veryfast -maxrate 3000k -bufsize 6000k -pix_fmt yuv420p \
  -c:a aac -b:a 128k \
  -r 30 -g 60 -f flv "$RTMP_URL$RTMP_KEY"
