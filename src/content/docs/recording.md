---
title: Recording
description: Choose what to record, at what size and frame rate, with which audio - and what MeCorder saves while you record.
order: 4
section: Recording
---

## Screen Recording

Recording setup is on the left of the home window. If the editor is open, **File → New Recording…** (<kbd>⌘N</kbd>) brings the home window back.

### Choosing a source

Under **Record**, pick the **Source**:

- **A display:** any connected display.
- **A window:** a single window, listed as *App: Window title*.
- **An iPhone or iPad:** connect it with a cable and unlock it, and it appears under *iPhone and iPad*. Tap *Trust* if it asks. A device is recorded at its own resolution, with its sound; the Mac's cursor and shortcuts aren't recorded for it.

**Frame rate** is **60 fps** or **30 fps**.

### Options

| Option | What it does |
| --- | --- |
| **Capture keyboard shortcuts** | Records shortcuts like ⌘C so they can be shown on screen and used by Key Press [triggers](/docs/program#triggers). Needs Input Monitoring. |
| **Record text typed into fields** | Appears once shortcuts are captured. Keeps the text you type into fields, for Programs that react to it. Off by default, and never reads password fields. |
| **Accessibility** | While it isn't allowed, an **Allow…** row offers it, so clicks get names like *Click Save* and Programs have [targets](/docs/program#targets). |
| **3-second countdown** | A large 3, 2, 1 on screen before recording starts. |

### Starting and stopping

Press **Start Recording** (<kbd>⇧⌘R</kbd>). MeCorder hides its own windows, and its floating control panel is never captured in the video. The panel shows:

- a blinking red dot (orange while paused) and the elapsed time
- a microphone level meter
- **Pause / Resume** (<kbd>⇧⌘P</kbd>)
- **Stop** (<kbd>⇧⌘2</kbd>)

The MeCorder icon in the menu bar shows the elapsed time too. Its menu has **Pause/Resume Recording**, **Stop Recording** and **Discard Recording**, which throws the recording away. During the countdown it offers **Cancel**.

When you stop, MeCorder finishes the files, generates automatic zooms, and opens the project in the editor.

### What gets recorded

The screen video, microphone, system audio and webcam are saved as separate files. The cursor is **not** burned into the video: its position, clicks, drags, scrolls and appearance are saved separately, together with your keyboard shortcuts. That's why you can change the cursor's size, hide it, smooth its movement or remake the zooms at any time after recording.

With Accessibility allowed, MeCorder also notes what each click, hover and field was: an element's kind and its name, such as a button called *Save*. It never reads a field's contents (unless you turned on **Record text typed into fields**), and from password fields only that they are one.

### If something interrupts the recording

MeCorder writes the recording so that very little can be lost.

| What happens | What MeCorder does |
| --- | --- |
| The app quits unexpectedly or the Mac loses power | Everything up to the last couple of seconds is kept. Next time MeCorder opens, it turns the recording into a project marked *(Recovered)* and tells you. |
| The Mac is about to sleep, the recorded window or display goes away, the iPhone is unplugged, or the disk is almost full | Stops, saves what it has, opens it, and says why. |
| The screen locks | Pauses, so the lock screen isn't in the video. Press Resume when you're back. |

## Multiple Displays

With more than one display connected, each one is listed as a source; pick the one you'll demo on. You can also record a single window, on any display.

The pointer is only tracked while it's on the recorded display or inside the recorded window. Clicks, scrolls and movement on another display, or outside a recorded window, are left out, so the automatic camera never chases something the viewer can't see, and Programs never react to it.

## Resolution

**Resolution** sets the size of the screen recording. The line under it shows the exact size you'll get.

| Setting | What you get |
| --- | --- |
| **Retina (native)** | Every pixel of the display, at its full Retina resolution. |
| **Standard (1×)** | One pixel per point: on a Retina display, half the width and height of native. |
| **Up to 2560 px** | Native size, scaled down so the longest side is at most 2560 pixels. |
| **Up to 1920 px** | Native size, scaled down so the longest side is at most 1920 pixels. |

Zooms look sharpest from a Retina recording, because the camera has real pixels to zoom into. The export's own resolution is chosen separately when you [export](/docs/export#video).

## Audio

Each audio source is recorded as its own track, so you can mute it, change its volume or clean it up later on the [Timeline](/docs/timeline#audio).

- **Microphone:** turn it on and pick an input. The level meter shows your voice live, and the mic button mutes it. Narration can later become [captions](/docs/timeline#captions), transcribed on your Mac.
- **System audio:** records sound from your apps as a separate track.

### Webcam

**Record webcam:** pick a camera and check yourself in the preview. The webcam is recorded as its own layer, so its shape, size and position can be changed afterwards, and you can cut to it full-frame. See [Webcam](/docs/timeline#webcam).

### Keyboard shortcuts

**Capture keyboard shortcuts** records the shortcuts you press so they can appear as key caps in the video. Plain typing is never shown or stored as characters. Shortcuts can't be added afterwards, so turn this on before you record.

<aside class="callout note">Turn on the microphone, system audio, webcam and shortcut capture <em>before</em> you record. A track that wasn't recorded can't be added later.</aside>
