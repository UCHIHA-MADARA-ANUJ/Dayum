#!/bin/bash
# OBSIDIAN FILM CONDUCTOR v2 — robust, visible errors
set -e
cd "$(dirname "$0")"
FF="$(pwd)/ffmpeg"
VID="$(pwd)/../deliverables/video"
REN="$(pwd)/../deliverables/renders"
FOOT="$VID/footage"
WORK="$VID/work"
mkdir -p "$WORK"

echo "== 1/7 stills -> clips =="
$FF -y -loop 1 -i $REN/planet.png -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='1+0.0004*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=70:s=1920x1080:fps=30" -t 3.2 -c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p $WORK/p1.mp4
$FF -y -loop 1 -i $REN/sigil.png -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='1+0.0004*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=70:s=1920x1080:fps=30" -t 3.2 -c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p $WORK/p2.mp4
$FF -y -loop 1 -i $REN/helmet.png -vf "scale=2400:1350,zoompan=z='1.12':x='(iw-1920)*on/70':y='(ih-1080)/2':d=70:s=1920x1080:fps=30" -t 3.2 -c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p $WORK/p3.mp4
$FF -y -loop 1 -i $REN/warship.png -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='1.08-0.0003*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=70:s=1920x1080:fps=30" -t 3.2 -c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p $WORK/p4.mp4
$FF -y -loop 1 -i $REN/throne.png -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='1+0.0004*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=70:s=1920x1080:fps=30" -t 3.2 -c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p $WORK/p5.mp4
$FF -y -loop 1 -i $REN/probe.png -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='1.1-0.0005*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=70:s=1920x1080:fps=30" -t 3.2 -c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p $WORK/p6.mp4
$FF -y -loop 1 -i $REN/planet.png -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='1.06-0.0003*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=70:s=1920x1080:fps=30" -t 3.2 -c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p $WORK/p7.mp4
echo "   stills done"

echo "== 2/7 cards =="
$FF -y -loop 1 -i $VID/card-order66.png  -t 8.0 -c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p $WORK/c1.mp4
$FF -y -loop 1 -i $VID/card-obsidian.png -t 8.0 -c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p $WORK/c2.mp4
$FF -y -loop 1 -i $VID/card-hunt.png    -t 8.0 -c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p $WORK/c3.mp4
$FF -y -loop 1 -i $VID/card-end.png     -t 8.0 -c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p $WORK/c4.mp4
echo "   cards done"

echo "== 3/7 footage -> clip =="
$FF -y -framerate 30 -i "$FOOT/f%04d.png" -c:v libx264 -preset fast -crf 19 -pix_fmt yuv420p $WORK/appraw.mp4
$FF -y -i $WORK/appraw.mp4 -filter:v "setpts=PTS/1.35" -an -c:v libx264 -preset fast -crf 19 -pix_fmt yuv420p $WORK/app.mp4
echo "   app clip done"

echo "== 4/7 assembly =="
cd $WORK
cat > list.txt <<LIST
file 'c1.mp4'
file 'p1.mp4'
file 'c2.mp4'
file 'p2.mp4'
file 'p3.mp4'
file 'c3.mp4'
file 'p4.mp4'
file 'app.mp4'
file 'p6.mp4'
file 'p7.mp4'
file 'c4.mp4'
file 'p5.mp4'
LIST
$FF -y -f concat -safe 0 -i list.txt -c:v libx264 -preset fast -crf 19 -pix_fmt yuv420p video_nosound.mp4
cd - >/dev/null
echo "   assembly done"

echo "== 5/7 audio mix =="
$FF -y -i $VID/vo.mp3 -i $VID/score.wav -i $VID/boom.wav -i $VID/alarm.wav -i $VID/whoosh.wav -i $VID/riser.wav -i $VID/static.wav -i $VID/heartbeat.wav -i $VID/probe.wav \
 -filter_complex "
   [1:a]atrim=0:62,afade=t=in:d=1.5,afade=t=out:st=60:d=2[m];
   [0:a]adelay=3500|3500,volume=1.0[v];
   [2:a]adelay=1000|1000,volume=1.4[b];
   [3:a]adelay=52000|52000,volume=0.5[al];
   [4:a]adelay=28000|28000,volume=0.5[w];
   [5:a]adelay=58000|58000,volume=0.6[r];
   [6:a]adelay=63000|63000,volume=0.5[s];
   [7:a]adelay=9000|9000,volume=0.7[h];
   [8:a]adelay=45000|45000,volume=0.6[p];
   [m][b][h][p][w][al][r][s]amix=inputs=8,atrim=0:62,alimiter=limit=0.95[a];
   [a][v]amix=inputs=2,atrim=0:62,afade=t=out:st=59:d=3[out]
 " -map "[out]" -ar 44100 -ac 2 $WORK/mix.wav
ls -la $WORK/mix.wav

echo "== 6/7 final mux =="
$FF -y -i $WORK/video_nosound.mp4 -i $WORK/mix.wav -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart $VID/OBSIDIAN-PROMO.mp4
$FF -i $VID/OBSIDIAN-PROMO.mp4 2>&1 | grep -E "Duration|Stream"
echo "DONE"
