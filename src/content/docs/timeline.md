---
title: Timeline
description: Edit what happened in your recording, track by track - scenes, cuts, camera, cursor, text, effects and audio.
order: 2
section: Timeline
---

## Timeline Overview

The Timeline (<kbd>⌥⌘1</kbd>) is the precise view of your edit. It shows one row, or track, per kind of content, with the playhead running across all of them.

<figure class="doc-demo" data-demo="timeline-tracks"><figcaption>Each kind of content has its own track; the playhead runs across all of them.</figcaption></figure>

| Track | Shows | Header button |
| --- | --- | --- |
| Scenes | Your scenes, by name | ⊕ New scene at the playhead |
| Screen | Your clips, with filmstrip thumbnails | ✂ Split |
| Camera | Camera moves as named blocks (*Focus Search*), the zoom level over time, and keyframes (◆) | ⊕ Focus, zoom in here, show webcam only here, keyframe |
| Clicks | Blue dots for left clicks, red for right clicks | |
| Keys | Captured keyboard shortcuts | |
| Text | Text and callouts | ⊕ Add text or a callout |
| Effects | Effects | ⊕ Open the effect library |
| Webcam | Only if you recorded one | 👁 Show or hide the webcam |
| Mic, System | Audio waveforms, only if recorded | 🔊 Mute or unmute |

Click a track's name to open its settings in the inspector. The track holding the current selection is marked, and a selected scene is tinted across every track. Click empty space to clear the selection.

**Right-click anywhere on the timeline** for actions at that moment: Undo, Redo, Split Here, Focus on Cursor Here, Zoom In Here, New Scene Here, Show Webcam Only Here, Add Confetti Here, Add Text Here and, when something has been cut, Restore Nearest Cut Part.

**Timeline zoom:** use the slider in the footer, **Fit** to fit the whole edit in view, or <kbd>⌘=</kbd> and <kbd>⌘-</kbd>.

### Playing and moving around

| Action | How |
| --- | --- |
| Play / pause | <kbd>Space</kbd>, or <kbd>⌘Return</kbd> |
| Step one frame | <kbd>←</kbd> / <kbd>→</kbd> |
| Step one second | <kbd>⇧←</kbd> / <kbd>⇧→</kbd> |
| Go to start / end | <kbd>Home</kbd> / <kbd>End</kbd> |
| Rewind / fast forward | Hold the previous or next frame button. Fast forward starts at 2× and speeds up to 4× and 8× the longer you hold. |
| Move the playhead | Click or drag in the ruler at the top of the timeline |

### Cutting and trimming

Cuts never change your original recording. Anything you cut can be brought back.

- **Split where you click:** press the ✂ **Split** button to arm the scissors, then click the timeline wherever you want to cut. Each click splits there, until you press <kbd>Esc</kbd> or the button again.
- **Split at the playhead:** press <kbd>S</kbd> or <kbd>⌘B</kbd>, or right-click → **Split Here**.
- **Delete a clip:** click it on the Screen track, then press <kbd>⌫</kbd>.
- **Trim with the edges:** select a clip and drag its highlighted edges.
- **Trim Start to Playhead** (<kbd>⌥⌘[</kbd>) and **Trim End to Playhead** (<kbd>⌥⌘]</kbd>), also in the Trim settings as **Start here** and **End here**.

### Restoring cuts

- Turn on **Show cut parts** (timeline footer or Trim settings) to keep cut footage on the timeline as grey gaps at their original length. Double-click a gap, or right-click → **Restore Cut Part**, to bring it all back, or drag a clip's edge into a gap to bring back part of it.
- The Trim settings' **Cut parts** list has a **Restore** button for every cut.
- Right-click the timeline → **Restore Nearest Cut Part**.

### Removing idle moments

In the Trim settings, **Find idle moments** looks for stretches where nothing moves, clicks or types and nobody is talking; it never suggests cutting into your narration. If you recorded a microphone, **Find pauses** also finds silences while the cursor drifts, which tightens a talk-through without cutting any clicks or typing.

Each suggestion shows on the timeline as an *Idle* marker and in a list, where you choose **Keep** or **Remove**. **Remove all** removes every suggestion at once. Removed idle time is an ordinary cut, so you can restore it.

## Scenes

Scenes divide your video into named sections, like chapters. When a recording is first opened, MeCorder suggests scenes: it starts a new one at long pauses and at big jumps of attention across the screen, and names them after what happens (*Typing*, *Clicks in one area*, *Intro*, *Outro*).

Scenes live on the **Scenes** track, and the [Program view](/docs/program#scenes-and-shots) lists them too, as numbered chapters with their shots.

- **Select** a scene by clicking it. The inspector shows its name, times, transition, camera moves and events.
- **Rename** it by double-clicking it, or in the inspector's **Name** field.
- **Resize** scenes by dragging the edge between two of them. Edges snap to events, camera moves and the playhead.
- **Add** one with ⊕ on the Scenes track, **Timeline → New Scene at Playhead**, or right-click → **New Scene Here**. The scene at the playhead is split in two.
- **Reorder** with **Move Scene Earlier** / **Move Scene Later** (<kbd>⌥⌘↑</kbd> / <kbd>⌥⌘↓</kbd>). The scene's footage moves, and its zooms, effects and text go with it. Each move is one undo step. After you reorder scenes, only edges between scenes that still follow each other in the recording can be dragged.
- **Transition:** each scene's inspector sets how it hands over to the next one, **Cut** or **Fade** with a length.

The contextual bar under the preview offers *Rename, Split, Merge, Feature Reveal* for a selected scene. Clicking the Scenes track's name opens the Program view, where scenes, shots and transitions are laid out together.

After export, a project with more than one scene can copy a chapter list for YouTube. See [Video](/docs/export#video).

## Camera

The camera decides which part of the screen fills the frame at each moment. It can zoom in, pan, follow the cursor, and switch to the webcam. Project-wide camera settings are under **Camera** in the inspector's title menu.

<figure class="doc-demo" data-demo="camera-follow"><figcaption>The automatic camera zooms to each click and eases back out between places.</figcaption></figure>

### Automatic camera

When you stop recording, MeCorder generates zooms from what you did.

- **Zoom in this project:** turn it off to show the whole screen throughout. Every zoom is kept and comes back when you turn it on again (also **Timeline → Turn Zooms Off**).
- **Automatic:** choose a style.

| Style | What it does |
| --- | --- |
| **Off** | No automatic zooms. Your own camera moves, the AI Director's and Programs' still play. |
| **Calm** | Few, steady shots that hold on the area you work in. |
| **Balanced** | Zooms on what you click and type, ignoring noise. |
| **Lively** | Closer, quicker shots, including where the cursor rests. |

**Fine-tune automatic zooms** has the details: **Zoom level** (1.2× to 4×), **Zoom on clicks**, **Zoom while typing**, **Zoom when the cursor rests**, **Ignore noise** (double-clicks count once, clicks in a large editor become one shot of it, typing frames its field), **Merge clicks within**, **Shortest shot**, **Transition**, **Anticipation** (how early the camera starts moving), **Hold after action** and **Motion** (the [easing](#easing) curve).

Changing the style or a fine-tune setting remakes the automatic zooms straight away, as one undo step. Zooms you edited or added yourself are kept. **Regenerate** (also **Timeline → Regenerate Automatic Camera**) remakes them on demand, and **Clear** removes either the automatic keyframes or all keyframes.

Between two actions, the camera glides straight across only when the next one is close by and comes soon after. Otherwise it eases back out to the full view before zooming in on the next place, so each focus reads as its own shot.

Automatic zooms fill the time that your own camera moves, the AI Director's and Programs' leave free.

### Follow and framing

- **Follow the cursor when zoomed** keeps the cursor in view while zoomed in, with a **Free movement area** (how far the cursor can roam before the camera moves) and **Follow speed**.
- **Smart reframing for vertical & square** crops around the action on portrait and square canvases, instead of shrinking the whole screen.

### Adding camera moves yourself

| How | What it adds |
| --- | --- |
| <kbd>F</kbd>, then click something in the preview (or **Focus** in the contextual bar) | Points the camera at it. Focus picks the zoom, arrives just before the moment, holds through anything nearby and eases back out before the next camera move. If a camera move already covers that moment, Focus re-aims it. |
| <kbd>Z</kbd> (or **Add Zoom**) | A complete zoom in, hold and zoom out at the playhead, aimed at the cursor. |
| <kbd>K</kbd> (or **Keyframe**) | A keyframe that holds the camera as it looks right now. |
| Double-click the Camera track | A keyframe at that point. |
| Drag or pinch the preview | Pans or zooms the keyframe at the playhead, creating one if needed. |

### The shot editor

Selecting a camera move (a block on the Camera track) shows it in the inspector as a shot:

- its name (*Focus Search*, *Follow cursor*, *Webcam*) and where it came from: **Automatic**, **Manual**, **AI Director** or **Program**
- **Target:** what it points at. The ⌖ button lets you click a new target in the preview.
- **Zoom** (1.05× to 5×), **Duration**, **Easing**, and **Show webcam only** if you recorded a webcam
- **Target**, **Closer**, **Wider** and **Longer** as quick actions
- **Timing & position:** the exact **From / To** times, the target's **X / Y**, and **Aim at Cursor**
- **Keyframes:** the keyframes that make up the move; click one to edit it precisely

A selected camera move also shows its frame in the preview. When the camera is wide, the frame is a dashed rectangle you can drag. When you're inside the shot, drag the picture to reframe it and pinch to zoom.

### Keyframes

Selecting a single keyframe (a diamond on the Camera track) shows its **Zoom** (1× to 5×), **Position** (X / Y), **Easing** and **Show webcam only**, with **Rotation** (−15° to 15°), the exact **Time** and the easing curve under **Motion**. When the keyframe belongs to a camera move, **Whole Shot** takes you back to the move.

Keyframes on the Camera track are coloured by where they came from. Drag a diamond to move it, or right-click it for **Delete Keyframe**.

### Easing

Easing controls how a camera move speeds up and slows down: **Linear**, **Ease In**, **Ease Out**, **Ease In-Out**, **Spring** (with a Bounciness slider), **Cinematic**, **Custom Curve** (four Bézier values) and **Hold (Jump)**, which cuts instantly. A small graph shows the curve.

### Webcam

If you recorded your webcam, it appears as an overlay you can restyle under **Webcam** in the inspector's title menu:

- **Show webcam**
- **Shape:** Circle, Rounded Rectangle, Square or Full Width
- **Position:** Bottom Right, Bottom Left, Top Right, Top Left, or Custom
- **Size**, **Corner radius**, **Border** and border colour, **Shadow**, **Opacity**, **Mirror**

The eye button on the Webcam track shows or hides it quickly.

**Webcam only:** press <kbd>W</kbd> to cut to the webcam full-frame at the playhead. It eases in, holds for 3 seconds and eases back to the screen, which suits an intro, an aside or a sign-off. It's also in **Insert → Webcam Only**, the Camera track's ⊕ menu and right-click → **Show Webcam Only Here**. Webcam-only moments are camera moves, so they can be edited like any shot.

## Cursor

The cursor is recorded separately from the video, so you can restyle it after recording. Open **Cursor** from the inspector's title menu.

<figure class="doc-demo" data-demo="cursor-styles"><figcaption>An Adaptive cursor changes with what the mouse was doing: pointing, clicking, dragging.</figcaption></figure>

- **Show cursor:** on or off.
- **Appearance:** **Adaptive** (the default), **Native** (the real macOS cursor, including I-beams and hands), **Arrow**, **Dot** (with a colour) or **Custom Image**.
- **Adaptive** picks a look for each moment:
  - **Normally:** *As recorded* by default.
  - **On click:** shown while a button is held, and for a moment after a quick click. Default: *Pointing hand*.
  - **While dragging:** shown once the pointer moves with the button held. Default: *Grabbing hand*.

  The looks are *As recorded*, *Arrow*, *Pointing hand*, *Open hand*, *Grabbing hand*, *Text cursor*, *Crosshair*, *Dot* and *Custom image*.
- **Size:** 50% to 200%.
- **Glow** and **Highlight** (each with a colour) and **Shadow**.
- **Motion:** **Movement smoothing** turns shaky movement into smooth glides; **Tidy movement** holds the cursor still through hand tremor and straightens aimless wiggles between clicks; **Hide when idle** hides it after it stops moving for a set time.

### Click effects

**Left click** and **Right click** each have their own animation: **None**, **Ripple**, **Ring**, **Pulse** or **Scale**, with a colour, size and duration. **Shrink cursor on click** gives a small squeeze on each click.

For more dramatic click effects, use Click Ripple, Click Burst and Cursor Glow from the [effects](#effects).

### Keyboard shortcut display

If **Capture keyboard shortcuts** was on while you recorded, the shortcuts you pressed (like ⌘C or ⇧⌘P) appear on screen as key caps. Plain typing is never shown or stored. Shortcuts can't be added to a recording afterwards.

Under **Keys** in the inspector's title menu:

| Setting | Options |
| --- | --- |
| Show shortcuts | On or off |
| Position | Bottom Centre, Bottom Left, Bottom Right or Top Centre |
| Theme | Dark, Light or Glass |
| Size | How big the key caps are |
| Animation | Fade, Pop or Slide |
| Show for | How long each stays on screen |

## Text

Press <kbd>T</kbd> to add text at the playhead. For other kinds, use the **Insert** menu under the video, the Text track's ⊕ button, or right-click → **Add Text Here**.

There are six kinds: **Text**, **Label**, **Arrow**, **Circle**, **Rectangle** and **Highlight**. Each lasts 3 seconds by default.

- **Place it** by dragging it in the preview. Drag the corner to resize, or drag an arrow's ends.
- **Change its timing** by dragging it on the Text track, or dragging its right edge to change its length.
- **Edit it** in the inspector:
  - Text and Label: the text, font, size, text colour and background.
  - Shapes: stroke colour and width, and fill. Highlight has a single colour.
  - **Animation:** None, Fade, Scale, Slide or Pop, and **From / To** times.
  - **Position:** **Screen (moves with zoom)** keeps it on the thing it points at; **Canvas (stays in place)** keeps it fixed in the frame, like a title.

**Fonts:** the font menu offers the system font and every font imported into the project. **Import Font…** adds .ttf, .otf or .ttc files. They're copied into the project, so text looks the same on any Mac and nothing is installed on your system.

### Captions

MeCorder turns your narration into captions. Speech recognition runs on your Mac; your audio isn't uploaded. Open **Captions** from the inspector's title menu (or <kbd>⌘K</kbd> → *Transcribe Narration*) and press **Transcribe Narration**. The first time, macOS asks to allow Speech Recognition.

Once it's done, captions appear in the video and you can set:

- **Show captions**, **Position** (bottom or top), **Look** (Boxed, Outline or Light) and **Size**
- **Highlight the spoken word**, with a colour
- **Lines** and **Line length**
- each caption's text: click its time to jump there, and click the text to fix a word

**Export Subtitles…** saves an SRT or WebVTT file. Times follow your edit: cut parts are left out and later captions move up. Captions sit above key caps when both are at the bottom.

## Effects

Add effects from the **Add Effect** library (Effects settings, the Effects track's ⊕, or the **Insert** menu), arranged by what you want to do:

- **Quick effects:** Focus, Highlight, Spotlight, Zoom, Callout, Click and Shake.
- **Presets:** effects made of several others, such as Feature Reveal, New Feature, Achievement, Bug Found and Deploy Success.
- **My effects:** effects you made in [Effect Studio](#effect-studio).
- **All effects:** every effect by category.

**Where an effect lands** depends on what's selected:

- **An event, a spot, a scene or a camera move:** the effect is attached to it. A Click Ripple on a click ripples on that click; an effect on a camera move lands when the camera arrives.
- **Nothing, and the effect goes somewhere on screen** (Spotlight, Callout, Highlight, a preset): the pointer becomes a targeting cursor. Click the preview where it should go.
- **Nothing, and the effect covers the frame** (Confetti, CRT, Glitch, Flash, Like and Subscribe): it's added at the playhead.

<kbd>⌘K</kbd> finds any effect by name, and <kbd>C</kbd> adds confetti at the playhead. A preset can be taken apart with **Break Apart**, which turns it into separate effects you can retime one by one.

### Working with an effect

- **Move it** by dragging it on the Effects track; drag its right edge to change its length.
- **Place it** by dragging its marker in the preview.
- **Adjust it** in the inspector, which is titled with the effect's name. Its actions turn it off without deleting it, replay it, and **Shuffle** effects with an element of chance for a different random layout.

### The effects

MeCorder has 20 built-in effects in eight categories.

| Category | Effect | What it does |
| --- | --- | --- |
| Interaction | **Click Ripple** | A ripple spreads out from every click. |
| | **Click Burst** | Sparks burst out of every click. |
| | **Cursor Glow** | A soft glow follows the cursor. |
| | **Cursor Spotlight** | Dims the screen except for a pool of light around the cursor or a fixed point. |
| Camera | **Punch Zoom** | A quick zoom in and back out on top of the camera. |
| | **Screen Shake** | Shakes the whole frame, like an impact. |
| Developer | **Code Highlight** | Dims everything except a box, to draw attention to a few lines of code. |
| | **Bug Found** | A glitchy jolt, a red flash, a ring and a label on the bug. |
| | **Deploy Success** | A punch-in, a green burst, confetti and a banner. |
| Creator | **Feature Reveal** | Spotlights a spot, pushes in and tags it as new. |
| | **New Feature** | Rings a spot, sparkles it and labels it as new. |
| | **Like and Subscribe** | A call to action: a pointer clicks Like, then Subscribe, then rings the bell, with an optional channel name, logo and bell ding. |
| Game | **Achievement** | A punch zoom, a burst, a glow, confetti and a banner. |
| Annotation | **Focus Ring** | A glowing box that pulses around a spot. |
| | **Callout** | A speech bubble pointing at a spot, or a banner across the top. |
| Visual | **Glitch** | Split colour channels and torn lines. |
| | **Pixelate** | Turns the frame into big pixels, easing in and out. |
| | **CRT** | Scanlines, glow, noise and dark corners, like an old tube monitor. |
| | **Flash** | A bright flash that fades out. |
| Celebration | **Confetti** | A burst of confetti over the whole frame: Burst, Side Cannons or Shower. |

Click Ripple, Click Burst, Cursor Glow and Focus Ring are *recipe* effects: their **Plays** setting chooses **Each click**, **Follow cursor** or **Fixed point**, and you can customise them in Effect Studio. Every effect is also available as a block in [Programs](/docs/program#actions).

### Effect Studio

Effect Studio lets you build your own effects without code, as a chain of simple steps, with a live preview. Open it with **Insert → Effect Studio…** (<kbd>⇧⌘E</kbd>). To start from a built-in, right-click a recipe effect's tile and choose **Edit in Effect Studio**, or select a placed one and press **Customise in Effect Studio**; you get an editable copy.

An effect is built from:

- **Trigger:** **Each click**, **Follow cursor** or **Fixed point**, plus an **Effect colour** that can be changed each time you use the effect.
- **Layers**, each a column of steps: **Position** (an offset from the trigger point), **Shape** (Circle, Ring, Square, Rounded Box, Star, Spark or Text, with **Copies** that spread in a circle like a burst), **Motion** (size, spread, spin, easing, delay, duration, repeat), **Glow** and **Fade**.
- **Output**, which combines the layers.

**Save** (<kbd>⌘S</kbd>) stores the effect on your Mac, under **My effects** in every project. **Add at Playhead** saves it and adds it to the project. A project keeps its own copy of every studio effect it uses, so it renders the same on another Mac.

### AI Director

The AI Director edits your video from a plain-language instruction. Open it with the ✦ button in the inspector's header, or <kbd>⇧⌘A</kbd>. Type an instruction and press **Send**, for example:

- "Make the zooms more subtle."
- "Remove the boring parts but don't change the intro."
- "Make this 30 seconds."
- "Don't zoom above 1.5x."
- "Create a vertical version for TikTok."

It replies with a **Proposed:** list of changes (zooms, pans, cuts, trims, camera style, aspect ratio), which plays in the preview straight away. **Apply** keeps it as one undo step, **Discard** puts things back, and another instruction refines it. Its keyframes are ordinary keyframes marked *AI Director*.

Without an API key, a built-in offline interpreter handles common instructions. With your own Anthropic API key (stored in your Mac's Keychain), free-form requests work too. Only your instruction and a compact text summary of the recording are sent: event timings and positions, the current keyframes and cuts. **Your video and audio never leave your Mac.**

### Background, frame and looks

Under **Style** in the inspector's title menu:

- **Aspect ratio:** Landscape 16:9, Vertical 9:16, Square 1:1, Social 4:5, Classic 4:3, Match Recording, or Custom (also in the **Aspect ratio** menu under the video).
- **Padding**, **Corner radius**, **Shadow** and **Border**.
- **Background:** None, Solid Colour, Gradient (eight presets or your own), Image (with optional blur) or Blurred Screen.
- **Screen frame:** None, macOS Window, Browser (with the address bar text you choose) or Device Bezel.
- **Look:** save everything about how a video is styled under a name, apply it to another project, and choose the look every new recording starts with.

## Audio

Under **Audio** in the inspector's title menu (or click the Mic or System track's name), the **Microphone** and **System audio** tracks each have **Mute** and **Volume** (0% to 200%). The speaker buttons on the Mic and System tracks mute them too.

### Clean up narration

- **Reduce background noise** removes hum, fans, keyboard noise and room echo, using Apple's voice isolation.
- **Level volume** evens out loud and quiet passages and brings the narration to a standard loudness, without clipping.

MeCorder makes a cleaned-up copy the first time you turn either on (a few seconds per minute of audio) and uses it for playback and export. Your original recording is kept, and turning the settings off goes back to it.
