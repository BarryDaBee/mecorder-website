---
title: Export
description: Export an MP4, MOV or GIF for YouTube, social, chat or email - with subtitles, chapters and a file checked before it's saved.
order: 5
section: Export
---

## Export Settings

Press **Export** in the toolbar, or <kbd>⌘E</kbd>. The sheet asks **Where is this going?**

| Destination | What you get |
| --- | --- |
| **YouTube** | 16:9, 1080p, 60 fps MP4. |
| **Social (vertical)** | 9:16, 1080p, 30 fps MP4 for Shorts, TikTok and Reels. |
| **Send to someone** | An MP4 under 25 MB, small enough for email and chat. This is the default. |
| **GIF** | No sound, 15 fps, up to 800 px, loops. |

**More options** opens every setting below. MeCorder remembers whether you left it open, and remembers your export settings for each project.

### Presets

| Preset | Aspect | Resolution | Frame rate |
| --- | --- | --- | --- |
| YouTube 1080p | 16:9 | 1080p | 60 fps |
| YouTube 4K | 16:9 | 4K | 60 fps |
| YouTube Shorts | 9:16 | 1080p | 60 fps |
| TikTok | 9:16 | 1080p | 30 fps |
| Instagram Reels | 9:16 | 1080p | 30 fps |
| Instagram Feed | 4:5 | 1080p | 30 fps |
| Custom | Your project's | Your choice | Your choice |

A preset sets the resolution and frame rate, and exports at its aspect ratio **without changing your project's canvas**. So you can export a 16:9 YouTube video and a 9:16 TikTok from the same project. Use **Smart reframing** in the Camera settings so vertical and square exports crop around the action.

The sheet shows the exact output size, aspect ratio and length, and the expected file size, before you export.

## Video

| Setting | Options |
| --- | --- |
| **Format** | MP4, MOV or GIF |
| **Codec** | H.264 or HEVC (H.265). MOV also offers ProRes 422. |
| **Resolution** | 720p, 1080p, 1440p or 4K |
| **Frame rate** | 30 or 60 fps |
| **Include audio** | Narration, system audio and effect sounds, mixed in. Turn it off for a silent video. |
| **Quality** | High, Balanced or Small file. See [Quality](#quality). |
| **File size** | No limit, Under 10 MB (GitHub, Discord), Under 25 MB (email), Under 100 MB (Slack previews) or Under 250 MB |
| **Subtitles** | None, SRT file or WebVTT file |

### File size targets

With a file size limit, MeCorder picks the bitrate to fit, and encodes again if the first try comes out too big.

### Subtitles

If you've [transcribed your narration](/docs/timeline#captions), **Subtitles** saves an SRT or WebVTT file next to the video. Times follow your edit: cut parts are left out and later captions move up.

### Saving, sharing and chapters

Press **Export…** and choose where to save. The export runs in the background, and the toolbar shows its progress, with a button to cancel. It exports the project as it was when you pressed Export, so you can keep editing without changing the video being made.

When it's done:

- **Show Export** reveals the file in Finder; clicking the file name opens it.
- **Share** sends it with AirDrop, Mail, Messages or another app.
- **Copy** puts the video on the clipboard, to paste into Slack, Mail or a GitHub comment.
- **Chapters** (with more than one [scene](/docs/timeline#scenes)) copies a chapter list made from your scene names, such as *0:00 Intro*, *0:12 Open settings*, at their place in the exported video. Paste it into a YouTube description; YouTube shows chapters when there are at least three.

If an export fails, the toolbar says why and offers to export again with the same settings.

## GIF

Choose **GIF** as the destination or format. GIFs have their own settings:

| Setting | Options |
| --- | --- |
| **Frame rate** | 10, 15, 20, 25 or 30 fps (15 by default) |
| **Size** | Longest side up to 480, 640, 800, 960 or 1280 px (800 by default) |

GIFs have no audio and loop. Lower frame rates and sizes make much smaller files.

## Quality

| Quality | What it's for |
| --- | --- |
| **High** | The default, and the best picture. |
| **Balanced** | About half the size of High. |
| **Small file** | The smallest files, for chat and email. |

ProRes has no quality setting. With a **File size** limit, the limit decides the bitrate.

### Preview equals export

The preview and the export are drawn by the same renderer, frame by frame at the export's frame rate, so what you see in the editor is what you get in the file. Before exporting, MeCorder makes sure that's true:

- It checks the project: every named element a [Program](/docs/program) block uses must be in the recording, and the media files must be there.
- If your Programs' output is out of date, it runs them again first, as one undo step, so the preview shows exactly what will be exported.

### How an export runs

<figure class="doc-demo" data-demo="export-steps"><figcaption>Every export is prepared, rendered, checked and only then put in place.</figcaption></figure>

1. **Preparing**, including a check that there's enough free disk space.
2. **Rendering**, with the frame being written (*Rendering · frame 482 / 1200*).
3. **Checking the file**: MeCorder reads the finished video back and checks its duration, size, frame rate and audio.
4. **Finalising**: the checked file replaces the destination in one step.

The work happens in a private temporary folder that is always cleaned up. If anything fails, or you cancel, a file already at the destination is left untouched, and you get a plain explanation with the technical code for a bug report.
