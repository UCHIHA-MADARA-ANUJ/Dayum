#!/bin/bash
# OBSIDIAN PROMO FILM v2 — portal gateway + renders + app + cards, ~64s
set -e
cd "$(dirname "$0")"
FF="$(pwd)/ffmpeg"
VID="$(pwd)/../deliverables/video"
REN="$(pwd)/../deliverables/renders"
GATE="$VID/gateway"
FOOT="$VID/footage"
WORK="$VID/work2"
mkdir -p "$WORK"

echo "== 1/8 gateway clip =="
$FF -y -framerate 44 -i "$GATE/f%04d.jpg" -vf "fps=30,scale=1920:1080" -c:v libx264 -preset fast -crf 19 -pix_fmt yuv420p "$WORK/gw.mp4"
$FF -y -i "$WORK/gw.mp4" -t 12.0 -c:v copy "$WORK/gw12.mp4"

echo "== 2/8 cards =="
for c in order66 scattered hunt end; do
  $FF -y -loop 1 -i "$VID/card-$c.png" -t 4.0 -c:v libx264 -preset fast -crf 19 -pix_fmt yuv420p "$WORK/c-$c.mp4"
done
# end card longer
$FF -y -loop 1 -i "$VID/card-end.png" -t 6.5 -c:v libx264 -preset fast -crf 19 -pix_fmt yuv420p "$WORK/c-end.mp4"

echo "== 3/8 render clips (Ken Burns) =="
$FF -y -loop 1 -i "$REN/planet.png" -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='1.06-0.0004*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=120:s=1920x1080:fps=30" -t 4.0 -c:v libx264 -preset fast -crf 19 -pix_fmt yuv420p "$WORK/r-planet.mp4"
$FF -y -loop 1 -i "$REN/warship.png" -vf "scale=2400:1350,zoompan=z='1.12':x='(iw-1920)*on/120':y='(ih-1080)/2':d=120:s=1920x1080:fps=30" -t 4.0 -c:v libx264 -preset fast -crf 19 -pix_fmt yuv420p "$WORK/r-warship.mp4"
$FF -y -loop 1 -i "$REN/helmet.png" -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='1+0.0004*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=120:s=1920x1080:fps=30" -t 4.0 -c:v libx264 -preset fast -crf 19 -pix_fmt yuv420p "$WORK/r-helmet.mp4"
$FF -y -loop 1 -i "$REN/blade.png" -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='1.05-0.0003*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=120:s=1920x1080:fps=30" -t 4.0 -c:v libx264 -preset fast -crf 19 -pix_fmt yuv420p "$WORK/r-blade.mp4"
$FF -y -loop 1 -i "$REN/citadel.png" -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='1+0.0004*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=120:s=1920x1080:fps=30" -t 4.0 -c:v libx264 -preset fast -crf 19 -pix_fmt yuv420p "$WORK/r-citadel.mp4"
$FF -y -loop 1 -i "$REN/probe.png" -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='1.08-0.0005*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=120:s=1920x1080:fps=30" -t 4.0 -c:v libx264 -preset fast -crf 19 -pix_fmt yuv420p "$WORK/r-probe.mp4"

echo "== 4/8 app footage =="
$FF -y -framerate 20 -i "$FOOT/f%04d.jpg" -c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p "$WORK/appraw.mp4"
$FF -y -i "$WORK/appraw.mp4" -filter:v "setpts=PTS/1.25" -an -c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p "$WORK/app.mp4"

echo "== 5/8 assembly =="
cd "$WORK"
cat > list.txt <<LIST
file 'gw12.mp4'
file 'c-order66.mp4'
file 'r-planet.mp4'
file 'r-warship.mp4'
file 'r-helmet.mp4'
file 'app.mp4'
file 'c-scattered.mp4'
file 'r-blade.mp4'
file 'r-citadel.mp4'
file 'r-probe.mp4'
file 'c-hunt.mp4'
file 'c-end.mp4'
LIST
$FF -y -f concat -safe 0 -i list.txt -c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p video_nosound.mp4
cd - >/dev/null

echo "== 6/8 audio mix =="
$FF -y -i "$VID/vo.mp3" -stream_loop 1 -i "$VID/score.wav" -i "$VID/boom.wav" -i "$VID/whoosh.wav" -i "$VID/heartbeat.wav" -i "$VID/probe.wav" -i "$VID/alarm.wav" -i "$VID/riser.wav" \
 -filter_complex "
   [1:a]atrim=0:92,afade=t=in:d=1.5,afade=t=out:st=86:d=3[m];
   [0:a]adelay=16500|16500,volume=1.05[v];
   [2:a]adelay=12000|12000,volume=1.3[b1];
   [2:a]adelay=33000|33000,volume=1.2[b2];
   [2:a]adelay=50000|50000,volume=1.4[b3];
   [2:a]adelay=57000|57000,volume=1.0[b4];
   [3:a]adelay=16000|16000,volume=0.3[w1];
   [3:a]adelay=20000|20000,volume=0.3[w2];
   [3:a]adelay=24000|24000,volume=0.3[w3];
   [3:a]adelay=28000|28000,volume=0.3[w4];
   [3:a]adelay=37000|37000,volume=0.3[w5];
   [3:a]adelay=41000|41000,volume=0.3[w6];
   [3:a]adelay=45000|45000,volume=0.3[w7];
   [4:a]adelay=26000|26000,volume=0.6[h1];
   [4:a]adelay=40000|40000,volume=0.6[h2];
   [4:a]adelay=52000|52000,volume=0.6[h3];
   [5:a]adelay=39000|39000,volume=0.5[p1];
   [5:a]adelay=43000|43000,volume=0.5[p2];
   [6:a]adelay=33000|33000,volume=0.45[al];
   [7:a]adelay=10500|10500,volume=0.55[r];
   [m][v][b1][b2][b3][b4][w1][w2][w3][w4][w5][w6][w7][h1][h2][h3][p1][p2][al][r]amix=inputs=20:duration=longest,atrim=0:92,alimiter=limit=0.95,afade=t=out:st=87:d=4[out]
 " -map "[out]" -ar 44100 -ac 2 "$WORK/mix.wav"

echo "== 7/8 final mux =="
$FF -y -i "$WORK/video_nosound.mp4" -i "$WORK/mix.wav" -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart "$VID/OBSIDIAN-PROMO.mp4"
$FF -i "$VID/OBSIDIAN-PROMO.mp4" 2>&1 | grep -E "Duration|Stream"
echo "== 8/8 DONE =="
