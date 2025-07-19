#!/bin/bash

DISPLAY=:1

# Change INRES and OUTRES values to match your config from above
INRES="1920x1080"
OUTRES="1920x1080"

# Target FPS
FPS="30"

# i-frame interval; should be double of FPS
GOP="30"

# Minimum i-frame interval; should be equal to fps
GOPMIN="30"

# Max is 6
THREADS="2"

# Constant bitrate (should be between 1000k - 3000k)
CBR="3000k"

# One of the many FFMPEG presets
QUALITY="fast"

# Audio rate bitrate
AUDIO_RATE="44100"

# Select a Twitch server to stream to. See this link for info:
# https://help.twitch.tv/s/twitch-ingest-recommendation
SERVER="ingest.global-contribute"

# Stream with ffmpeg
# Leave these unchanged
ffmpeg -stream_loop -1 \
	-i music.mp3 \
	-f x11grab \
	-s "$INRES" \
	-r "$FPS" \
	-i $DISPLAY \
	-f flv \
	-vcodec libx264 \
	-g $GOP \
	-keyint_min $GOPMIN \
	-b:v $CBR \
	-minrate $CBR \
	-maxrate $CBR \
	-pix_fmt yuv420p \
	-s $OUTRES \
	-preset $QUALITY \
	-tune film \
	-acodec libmp3lame \
	-ar $AUDIO_RATE \
	-ac 2 \
	-threads $THREADS \
	-strict normal \
	-bufsize $CBR \
	-shortest \
	"rtmp://$SERVER.live-video.net/app/$RTMP_KEY"