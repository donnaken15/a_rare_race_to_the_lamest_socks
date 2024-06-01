# mp3_speedrun
Test different versions and/of programs to see which can
decode and encode the fastest and generate a CSV of the results. (WIP!!)

Programs and pipe chains include:
- SoX (2012, +opus, manual rebuild)
- LAME
- Helix
- ffmpeg
- SoX &rarr; Helix
- ffmpeg &rarr; Helix

Methods include:
- Generic stream redirection, (command prompt) uses a thread of total CPU usage across 2-3 processes
- Asynchronously reading and writing stream blocks to maximize CPU
- Simply timing dedicated external programs/scripts that perform the same actions

ffmpeg decodes audio significantly faster than SoX

stupid SoX requires a temp file to merge audio tracks together (recent versions I think)

To run:
```batch
bun run main.js
```
This project was created using `bun init` in bun v1.1.0. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

Exclusively created for Windows/Bundows.
