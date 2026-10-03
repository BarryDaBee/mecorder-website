---
title: Advanced
description: Keyboard shortcuts, how MeCorder stores projects on your Mac, and fixes for common problems.
order: 6
section: Advanced
---

## Keyboard Shortcuts

Single-letter shortcuts work in the editor when you're not typing in a text field. Most commands are also in the menus and the command palette (<kbd>⌘K</kbd>), which shows each one's shortcut.

### Recording

| Shortcut | Action |
| --- | --- |
| <kbd>⇧⌘R</kbd> | Start recording |
| <kbd>⇧⌘P</kbd> | Pause / resume recording |
| <kbd>⇧⌘2</kbd> | Stop recording |
| <kbd>⌘N</kbd> | New recording (show the home window) |
| <kbd>⌘O</kbd> | Open a project |
| <kbd>⌘,</kbd> | Settings |

### Playback

| Shortcut | Action |
| --- | --- |
| <kbd>Space</kbd>, <kbd>⌘Return</kbd> | Play / pause |
| <kbd>←</kbd> / <kbd>→</kbd> | Previous / next frame |
| <kbd>⇧←</kbd> / <kbd>⇧→</kbd> | Back / forward one second |
| <kbd>Home</kbd> / <kbd>End</kbd> | Go to start / end |
| Hold previous / next frame | Rewind / fast forward |

### Editing

| Shortcut | Action |
| --- | --- |
| <kbd>⌘Z</kbd> | Undo |
| <kbd>⇧⌘Z</kbd> | Redo |
| <kbd>S</kbd>, <kbd>⌘B</kbd> | Split at the playhead |
| <kbd>⌥⌘[</kbd> | Trim start to playhead |
| <kbd>⌥⌘]</kbd> | Trim end to playhead |
| <kbd>⌫</kbd>, <kbd>⌦</kbd>, <kbd>⌘⌫</kbd> | Delete the selection (clip, camera move, keyframe, text, effect, scene or block) |
| <kbd>Esc</kbd> | Cancel the active tool, or clear the selection |
| <kbd>⌘K</kbd> | Command palette |
| <kbd>⌥⌘↑</kbd> / <kbd>⌥⌘↓</kbd> | Move the selected scene earlier / later |

### Camera

| Shortcut | Action |
| --- | --- |
| <kbd>F</kbd> | Focus: on the selected event or spot, or pick a target in the preview |
| <kbd>V</kbd> | Select tool |
| <kbd>Z</kbd>, <kbd>⌥⌘Z</kbd> | Add zoom at the playhead |
| <kbd>K</kbd>, <kbd>⇧⌘K</kbd> | Add a camera keyframe at the playhead |
| <kbd>W</kbd> | Webcam only at the playhead |
| Drag / pinch the preview | Reframe the selected camera move, or pan / zoom at the playhead |

### Adding things

| Shortcut | Action |
| --- | --- |
| <kbd>T</kbd> | Add text |
| <kbd>C</kbd> | Add confetti |
| <kbd>⇧⌘E</kbd> | Open Effect Studio |
| <kbd>⇧⌘A</kbd> | Ask the AI Director (in the Program view: go to the Ask box) |

### Views and export

| Shortcut | Action |
| --- | --- |
| <kbd>⌥⌘1</kbd> | Show Timeline |
| <kbd>⌥⌘3</kbd> | Show Program |
| <kbd>⌘=</kbd> / <kbd>⌘-</kbd> | Zoom the timeline in / out |
| <kbd>⌘E</kbd> | Export |

### In the Program view

| Shortcut | Action |
| --- | --- |
| <kbd>⌘R</kbd> | Preview: run the scenes and Programs and play the result |
| <kbd>⌘↵</kbd> | Send what's in the Ask box |
| <kbd>⌫</kbd> | Delete the selected block |
| <kbd>Esc</kbd> | Deselect the block |

### In Effect Studio

| Shortcut | Action |
| --- | --- |
| <kbd>⌘S</kbd> | Save |
| <kbd>Return</kbd> | Add at playhead |
| <kbd>Esc</kbd> | Close |

## Project Files

### Where recordings live

Each recording is saved in **~/Movies/MeCorder** as a project named like *Recording 2026-09-30 at 10.42.07.mecorder*.

A `.mecorder` file is a package: it looks like a single file in Finder, but it holds:

- the original screen, audio and webcam recordings, which are never modified
- the cursor, keyboard and event data
- images and fonts you added (backgrounds, custom cursors, channel logos), and copies of the Effect Studio effects the project uses
- `project.json`: your edit, including scenes, Programs, Behaviours and variables

Because your edit is stored separately from the media, everything stays editable and cuts can always be undone. To move or back up a project, copy the whole `.mecorder` file.

### Saving and recovery

- **Autosave:** every change is saved shortly after you make it, and the file is replaced in one step so a save is never half-written. Quitting saves too.
- **The previous save:** each save keeps the one before as `project.previous.json`. If a project can't be opened because its data is damaged, MeCorder offers **Try Recovery**, which opens it as it was one save earlier and keeps the unreadable file as `project.damaged.json`.
- **Newer projects:** a project saved by a newer version of MeCorder isn't opened by an older one, rather than being downgraded and losing what was done in the newer version. Older projects are upgraded when you open them.
- **Interrupted recordings** come back as projects marked *(Recovered)*. See [Recording](/docs/recording#if-something-interrupts-the-recording).

### The library

The right side of the home window lists your recordings with a thumbnail, duration and last-modified time.

- Click a recording to open it. You can open several projects at once, each in its own window.
- Right-click for **Open**, **Show in Finder** and **Move to Trash**.
- **Open…** (<kbd>⌘O</kbd>) opens a project from anywhere, and double-clicking a `.mecorder` file in Finder works too.
- The ↗ button shows the recordings folder in Finder.
- **Try the Example Project** opens a short demo with scenes, shots, a Behaviour, a PARALLEL, a variable and a fade, ready to explore the [Program view](/docs/program). It works offline.

### Other files

- Effects you save in Effect Studio live in `~/Library/Application Support/MeCorder/EffectLibrary.json` and appear in every project.
- Crash reports and a log of recording events stay on your Mac. **MeCorder → Settings… → Diagnostics → Show in Finder** opens them so you can attach them to a bug report.

## Troubleshooting

**"MeCorder needs Screen Recording permission" even after I allowed it.**
Quit MeCorder and open it again. macOS only applies Screen Recording permission when an app launches.

**My Program doesn't do anything.**
The recording was probably made without Accessibility, so it has no element names and Programs have nothing to match. The Program view says so, and the events list is empty. Allow Accessibility (MeCorder → Settings… → Permissions) and record again. Also check that the WHEN block's event really happens in the recording (the events list shows every event and which Programs answered it), and that no warnings are waiting beside **Preview**.

**Clicks are named *Click top left* instead of the button's name.**
Allow **Accessibility** before you record. Names are read while recording, so earlier recordings keep their position names.

**A Program's camera move doesn't play.**
A camera move you placed by hand takes priority: if one falls inside the Program's camera move, the Program keeps its effects but skips the move. Remove or move your keyframe and press **Preview** again.

**No keyboard shortcuts in my video, or Key Press Programs never fire.**
Turn on **Capture keyboard shortcuts** and allow **Input Monitoring** before you record. Shortcuts can't be added to a recording afterwards.

**The Webcam settings say there's no webcam track.**
Turn on **Record webcam** before recording. The same applies to the microphone and system audio.

**The automatic zooms aren't what I want.**
Try another **Automatic** style (Calm, Balanced or Lively) in the Camera settings, or adjust **Fine-tune automatic zooms**. Your own keyframes are kept. You can also ask the AI Director, for example "make the zooms more subtle", or turn off **Zoom in this project** to show the whole screen.

**The camera stays zoomed in between actions in an older project.**
Projects keep the camera they were made with. Choose a style or press **Regenerate** in the Camera settings to get the newer automatic camera. Your own keyframes are kept.

**A recording says *(Recovered)*.**
MeCorder or the Mac stopped while you were recording, and MeCorder rebuilt the project from what was saved. Everything up to a couple of seconds before the interruption is there.

**A project won't open.**
If its data is damaged, press **Try Recovery** to open the previous save. If it was saved by a newer MeCorder, open it in that version.

**Transcribe says speech recognition isn't allowed or isn't installed.**
Allow MeCorder under System Settings → Privacy & Security → Speech Recognition, and add your language under System Settings → Keyboard → Dictation so it can run on your Mac.

**My iPhone isn't in the source list.**
Connect it with a cable, unlock it, and tap *Trust* if it asks. It can take a few seconds to appear.

**I cut too much.**
Turn on **Show cut parts** and double-click the grey gap, or use **Restore** in the Trim settings. Undo (<kbd>⌘Z</kbd>) works too.

**The AI Director or the Ask box doesn't understand my request.**
Without an API key, the built-in interpreter only understands common phrasings. Rephrase it using the examples, or add an Anthropic API key for free-form requests.
