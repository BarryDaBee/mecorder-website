---
title: Getting Started
description: Install MeCorder, allow the permissions it needs, make your first recording and find your way around the editor.
order: 1
section: Getting Started
---

## Installation

MeCorder needs **macOS 14 or later on a Mac with Apple Silicon**.

Move MeCorder to your Applications folder and open it. The home window shows recording setup on the left and your recordings on the right.

### Permissions

macOS asks you to allow a few things. Only Screen Recording is required; the rest switch on features as you need them.

| Permission | Why MeCorder asks | Needed for |
| --- | --- | --- |
| Screen Recording | Captures your display or a window. | Always |
| Microphone | Records your narration as its own track. | Microphone audio |
| Camera | Records your webcam as a separate layer. | Webcam |
| Input Monitoring | Records shortcuts like ⌘K so they can be shown in your video. Only shortcuts are stored, never what you type. | Keyboard shortcut display, Key Press events |
| Speech Recognition | Turns your narration into captions, on your Mac. | Captions |
| Accessibility | Reads the name and kind of what you click (a button's title, a field's placeholder). Never a field's contents, and nothing from password fields. | Named events and Program targets |

The home window shows an **Allow…** button next to anything that's missing. After you allow Screen Recording in System Settings, quit and reopen MeCorder so macOS applies it.

**MeCorder → Settings… (⌘,) → Permissions** lists every permission with its current state (*Allowed* or *Not allowed*). **Allow…** asks for a missing one; **Open Settings** opens its page in System Settings, for example to turn it off again.

### Why Accessibility matters

Recording works without Accessibility, but MeCorder then only knows *where* you clicked, so clicks are named by position (*Click top left*). With it, MeCorder also stores *what* you clicked: a button called *Save*, a text field called *Search*. That is what lets the Timeline show *Click Save*, and what lets a [Program](/docs/program#targets) say "when the Save button is clicked" and find that button in any recording, wherever it was on screen.

Names are read while you record, so allow Accessibility **before** recording. Recordings made without it keep their position names, and Programs can't target anything in them.

The first time you record without Accessibility, MeCorder explains what it's for and offers **Open System Settings** or **Record Without**. It only asks once.

## First Recording

1. Open MeCorder.
2. Under **Record**, choose the display or window to record. See [Screen Recording](/docs/recording#screen-recording) for every option.
3. Turn on the microphone, system audio or webcam if you want them.
4. Press **Start Recording** (<kbd>⇧⌘R</kbd>).
5. After the 3-second countdown, do your demo. A small floating panel shows the elapsed time, with pause and stop buttons. It is never captured in the video.
6. Press the red stop button (<kbd>⇧⌘2</kbd>).

MeCorder saves the recording, adds automatic zooms on what you did, and opens it in the editor.

<aside class="callout tip">Do your demo at a steady pace and pause briefly before you click something important. The automatic camera reads clicks, typing and where the cursor settles, and a calm recording gives it cleaner shots.</aside>

## Editing Your Recording

The editor opens with your recording ready to play. Most recordings look good straight away; everything below is for when you want to change something.

### The editor at a glance

| Part | What it does |
| --- | --- |
| **Toolbar** | New Recording, the **Timeline \| Program** switch next to the project's name, **Commands** (<kbd>⌘K</kbd>) and **Export**. In the Program view it also has **Preview**. While an export runs, its progress shows here. |
| **Preview** | Exactly what the export will look like, and the place to edit directly. A tool palette floats above it, and a contextual bar under it offers what applies to the current selection. |
| **Transport** | Go to start, previous frame (hold to rewind), play/pause, next frame (hold to fast forward), the current time, the **Aspect ratio** and **Insert** menus, **Split** and **Keyframe**. |
| **Inspector** | Shows whatever is selected: a scene, event, camera move, keyframe, effect, text or clip. With nothing selected, its title menu opens project settings by category. |
| **Timeline / Program** | Two views of the same edit, switched with <kbd>⌥⌘1</kbd> and <kbd>⌥⌘3</kbd>. |

### Timeline and Program

- **[Timeline](/docs/timeline)** (<kbd>⌥⌘1</kbd>) is where you edit what happened: tracks for scenes, your clips, the camera, clicks, keys, text, effects, webcam and audio.
- **[Program](/docs/program)** (<kbd>⌥⌘3</kbd>) is where you define what the video should do: blocks that say *when* something happens, *do* this. Programs produce ordinary camera moves and effects, which then appear on the Timeline.

Switching views never changes your project. A camera move made in one appears in the other at once.

### Editing in the preview

The tool palette above the preview has **Select** (<kbd>V</kbd>), **Focus** (<kbd>F</kbd>), **Spotlight**, **Highlight**, **Callout** and **Zoom**. Pick a tool and click in the picture: Focus points the camera at what you click, Spotlight dims everything else, Highlight puts a glowing box around it, Callout adds a speech bubble, and Zoom adds a quick punch-in. Tools other than Select work once and hand back to Select; <kbd>⌥</kbd>-click a tool to keep it until you press <kbd>Esc</kbd>.

Events light up under the pointer when they happen near the playhead, with their name (*Click Search*). Click one to select it, and the contextual bar offers what fits: for a click, *Focus, Ripple, Burst, Punch Zoom, Highlight, Callout*.

After each change a short message says what happened, with an **Undo** button.

### The inspector

The inspector follows the selection: select a camera move and it shows the shot's target, zoom and easing; select an effect and it shows that effect's settings. Rarely needed values sit behind labelled disclosures.

For project-wide settings, use the inspector's title menu, which lists the categories this project has: **Camera**, **Cursor**, **Style**, **Webcam**, **Audio**, **Text**, **Captions**, **Effects**, **Keys** and **Trim**. Clicking a track's name on the Timeline opens that track's settings too, and <kbd>⌘K</kbd> finds every category by name (*Camera Settings*).

The ✦ button in the inspector's header opens the [AI Director](/docs/timeline#effects) (<kbd>⇧⌘A</kbd>).

### Command palette

<kbd>⌘K</kbd> opens the command palette. Type what you want (*focus*, *spotlight*, *split scene*, *confetti*, a scene's name) and press Return. Commands for the current selection are listed first.

### Saving and undo

Every change is saved automatically, shortly after you make it. There's no Save command. Undo (<kbd>⌘Z</kbd>) and Redo (<kbd>⇧⌘Z</kbd>) cover every edit, including AI Director changes and Program previews, which are each one undo step.

## Exporting

Press **Export** in the toolbar, or <kbd>⌘E</kbd>. The sheet asks **Where is this going?** and offers YouTube, Social (vertical), Send to someone, and GIF. Pick one, press **Export…**, and choose where to save. The export runs in the background, so you can keep editing.

See [Export](/docs/export) for every setting.
