---
title: Program
description: Describe what your video should do with visual blocks - when something happens in the recording, do these camera moves and effects.
order: 3
section: Program
---

## Introduction

A Program says what the video should do whenever something happens in your recording. You describe it once, and MeCorder applies it to every matching moment:

```program
WHEN Click [Create Project]
Focus [Create Project]
Wait [0.3] seconds
Highlight [Create Project]
Reset
```

Read it as a sentence: *when Create Project is clicked, focus the camera on it, wait a moment, put a glowing box around it, then put the camera back.* If you click Create Project three times in the recording, all three clicks get the same treatment.

Programs are built from visual blocks that snap together, like Scratch. There's no code to type.

<figure class="doc-demo" data-demo="program-run"><figcaption>Preview runs the blocks against the recording; each block lights up as it plays.</figcaption></figure>

### What a Program produces

A Program describes intent. When it runs, it produces **ordinary camera keyframes and effects**, the same kind you'd add by hand. They appear on the Timeline's Camera and Effects tracks, marked as coming from a Program, and you can inspect them there like anything else. Preview and export draw them exactly as they draw everything else.

- **One undo step.** Running a Program is one undo step: <kbd>⌘Z</kbd> takes all of its output away at once.
- **Replaced, not stacked.** Running a Program again first removes what it made last time, so you never get duplicates.
- **Your hand edits win.** If a camera move you placed by hand falls inside a Program's camera move, the Program keeps its effects but skips that camera move. Camera moves are ranked: yours first, then the AI Director's, then Programs', then automatic zooms, which fill whatever time is left.

### The Program view

Open it with the **Timeline | Program** switch in the toolbar, **Timeline → Show Program**, <kbd>⌥⌘3</kbd>, or <kbd>⌘K</kbd> → *Program Blocks*.

| Area | What's there |
| --- | --- |
| **Left sidebar** | Your scenes as numbered chapters, with their shots and transitions, then your Programs. |
| **Centre** | The video, the largest thing in the window, with a scrubber under it. |
| **Blocks palette** | Every block, by category. Click one to add it after the selected block, or drag it into place. |
| **Canvas** | The blocks of whatever you're editing, under a breadcrumb that says what that is. |
| **Inspector** | Appears only while a block is selected, with that block's settings. |
| **Ask box** | *What should happen?* floats over the canvas. See [Ask](#ask). |
| **Execution strip** | Under the canvas: what is running at the playhead (*Demo › Search › Focus Search*) and the time. |

### Preview and Play Again

**Preview** (<kbd>⌘R</kbd>) runs your scenes and Programs on the recording, commits the result as one undo step and plays it from just before the first moment it affects. **Play Again** replays the last preview.

While the video plays, the block that is running lights up with an accent outline and a marker beside it, and the execution strip names it. When several blocks run at once (see [PARALLEL](#parallel)), all of them light up.

If something needs fixing first, such as a block with no target or a variable that no longer exists, a warning with a count appears beside Preview. Click it for the list. Errors stop Preview from running until they're fixed; warnings, such as two branches sharing the camera, don't.

## Triggers

Every Program starts with a **WHEN** block (yellow): the event it reacts to. Choose the event in the block's first slot, and its details in the slots after it.

| Trigger | Fires when | Details |
| --- | --- | --- |
| **Click** | An element is clicked. Double-clicks count once. | A named element, **Any button** or **Anything clicked** |
| **Hover** | The pointer settles on an element for a quarter of a second or more. | A named element, or **Any element** |
| **Hover Exit** | The pointer leaves an element it was hovering over. | A named element, or **Any element** |
| **Scroll** | You scroll, once per scroll gesture, with a trackpad or a mouse. | **Up**, **Down**, **Left**, **Right** or **Any direction** |
| **Key Press** | A key is pressed with exactly the modifiers you choose. Return and Enter count as the same key. | The key, from those pressed in the recording first, then Return, Escape, Tab, Space, Delete and the arrows |
| **Text Input** | You type into a field. | A named field, or **Any field** |
| **Time** | A moment of the recording is reached: **AT** a time, in seconds. | The time |

```program
WHEN Key Press [⌘K]
Focus [Search Field]
```

```program
AT [12.5] s
Play [Confetti]
```

### Any button, anything clicked

**Any button** reacts to every button click; **Anything clicked** reacts to every click on an element the recording has a name for. Use them with an [IF](#conditions) to tell clicks apart in one Program.

### What each trigger needs

- **Click, Hover, Hover Exit** and **Text Input** need the recording to say what was under the pointer, which needs [Accessibility](#targets) while recording.
- **Key Press** needs **Capture keyboard shortcuts** (and Input Monitoring) while recording. Shortcuts and named keys such as Return, Tab and Esc are recorded; plain typed characters never are.
- **Text Input** always notes *which* field you typed into. The text itself is only kept if **Record text typed into fields** was on (it's under Capture keyboard shortcuts, off by default, and never reads password fields).

Older recordings, made before these events were recorded, only have clicks.

## Actions

After the WHEN come the actions, which run strictly one after another in recording time, starting at the moment of the event.

| Block | Category | What it does | Settings |
| --- | --- | --- | --- |
| **Focus** [target] | Camera | Moves the camera onto the element, at the project's usual focus zoom (the same as the Focus tool). | **Target**, **Move time** (0.4 s) |
| **Zoom Out** | Camera | Zooms the camera back out to the whole screen. | **Move time** (0.4 s) |
| **Reset** | Camera | Puts the camera back to how it was before this Program's moves, and ends highlights. | **Move time** (0.4 s) |
| **Highlight** [target] | Effects | Puts a glowing Focus Ring around the element, sized to fit it, and holds it. | **Target**, **Hold** (0.6 s) |
| **Play** [effect] | Effects | Plays any effect from the library, including your Effect Studio effects, where the event happened. | **Effect** |
| **Wait** [seconds] | Control | Pauses before the next block. | **Duration** (0.3 s) |
| **Wait Until** [event] | Control | Pauses until the next matching event in the recording. | An event, with its element, direction, key or time |
| **Play Sound** | Sound | Plays a short ding, mixed into the video's audio. | |

The palette's Effects section lists every effect by category; a Play block's menu switches it to any other. Programs written by the [Ask box](#ask) can also contain a **Zoom to** [n]× block.

```program
WHEN Click [Save]
Play [Click Ripple]
Focus [Save]
Wait Until Click [Done]
Reset
```

### Timing

Each block starts when the one before has finished:

- **Focus**, **Zoom Out** and **Reset** take their move time, and occupy the camera while they move.
- **Highlight** takes its hold time; a later Reset ends it.
- **Wait** takes its duration, starting once the camera move before it has finished.
- **Wait Until** lasts until the next matching event. If it never comes, it waits to the end of the recording and says so.
- **Play** [effect] and **Play Sound** take no time: they start where the blocks before have got to. Click effects (Click Ripple, Click Burst) are the exception: they play at the moment of the event that started the Program.

For a click on Create Project at **10.0 s**, the Program at the top of this page runs like this:

| Block | Runs |
| --- | --- |
| Focus [Create Project] | 10.0 – 10.4 s (camera moves in) |
| Wait [0.3] seconds | 10.4 – 10.7 s |
| Highlight [Create Project] | 10.7 – 11.3 s (default 0.6 s hold) |
| Reset | 11.3 – 11.7 s (camera moves back, highlight ends) |

If a block's target isn't in the recording, that block does nothing but still takes its time, and the run report says why (*couldn't find Save in the recording, so the camera stayed put*).

## Targets

Blocks never point at screen coordinates. They point at **targets**: named elements described by *what they are*, such as a button labelled *Sign In*, read from the app's accessibility information while you recorded.

<figure class="doc-demo" data-demo="semantic-target"><figcaption>A raw x/y position becomes a named target: what the element is, not where it was.</figcaption></figure>

A target stores the element's kind and label, never its position. MeCorder finds it again in each recording, so the same Program keeps working if the window moved, the recording has a different resolution, or you record the demo again tomorrow.

### Choosing a target

Click a block's target slot for a menu of the elements the recording knows about, or choose **Pick in Preview…** and click the element in the video. MeCorder picks the recorded element under your click, nearest in time. If nothing named was there, it refuses rather than guessing.

### Naming targets

The first time you use an element, it gets a name such as *Primary Button*. Choosing the same element again reuses that name, so one name means one element throughout the Program. Rename it under **Target details** in the block's inspector, and the new name appears in every block that uses it.

### When a target can't be found

Targets only come from what MeCorder recorded. A recording made **without Accessibility** has no element names, so there's nothing to target: the canvas says so, and Programs match nothing in it rather than guess from positions. Allow Accessibility for MeCorder in System Settings › Privacy & Security, then record again.

<aside class="callout planned"><strong>Planned.</strong> Finding elements visually, for apps that don't expose accessibility information, isn't built yet. Today, an app without accessibility names can't be targeted.</aside>

## Program Blocks

### Block categories

Colour belongs to the blocks; the rest of the window stays neutral. Every block also carries its category's icon, so it never depends on colour alone.

| Category | Colour | Blocks |
| --- | --- | --- |
| Events | Yellow | WHEN, AT, and a shot that starts on an event |
| Camera | Blue | Focus, Zoom Out, Reset |
| Effects | Purple | Highlight, Play [effect] |
| Control | Orange | Wait, Wait Until, IF, PARALLEL |
| Variables | Red-orange | Set, Change, and variables used as values |
| Conditions | Cyan | The pointed slot inside an IF |
| Sound | Pink | Play Sound |
| Behaviours | Indigo | Run, and a Behaviour's Define block |
| Scenes | Green | A shot that starts after the one before, a scene's start and end |

Blocks read as sentences: *Focus [Get Started]*, *Wait [0.5] seconds*, *Change [clicks] by [1]*. Values sit in white slots; click one to change it.

### Adding and arranging blocks

- **Add** a block by clicking it in the palette (it goes after the selected block) or dragging it into place. While you drag, the blocks part and an insertion line shows where it will land.
- **Reorder** by dragging a block within the script, or into or out of an IF or PARALLEL. A block moved between branches is moved, never copied.
- **Select** a block by clicking it; the inspector slides in with its settings. <kbd>Esc</kbd> or a click on the empty canvas deselects.
- **Delete** with <kbd>⌫</kbd>.
- **Right-click** a block (or use its inspector) for **Move Up**, **Move Down**, **Duplicate** and **Delete**. They're also available to VoiceOver.

Every block edit is one undo step.

### Several Programs

The **Programs** group in the sidebar holds all of a project's Programs. **+** adds one; each Program's menu has **Rename**, **Clear Blocks** and **Delete Program**. Preview runs every Program together. If one fails, it's reported and the rest still run.

### Several WHENs in one Program

A Program can react to more than one event. Click a WHEN in the palette's Events section to add another WHEN of that kind to the current Program. Each WHEN appears as a tab above the canvas; its tab menu has **Remove This WHEN**.

All the WHENs in a Program share its [variables](#variables), so one event can set something a later one reads:

```program
WHEN Hover [Search Field]
Set [hovered] to [true]
```

```program
WHEN Hover Exit [Search Field]
Set [hovered] to [false]
```

Different Programs never share variables.

### The events list

The events button beside Preview lists the recording's events (clicks, hovers, scrolls, key presses, text input) in time order, and which Programs answered each one. Click a row to go to that moment.

## Conditions

### IF and ELSE

An **IF** block does one thing or another depending on the event. It has a THEN branch and an ELSE branch, and either may be empty, which means "do nothing and carry on". After the IF, the script continues with the next block.

```program
WHEN Click [Any button]
IF Target matches [Primary Button]
  Focus [Primary Button]
  Wait [0.3] seconds
  Highlight [Primary Button]
ELSE
  Reset
END
Reset
```

Choose the condition type in the IF's inspector:

| Condition | True when |
| --- | --- |
| **Target Matches** | The element that started the Program is the target you choose. |
| **Compare Variable** | A variable compares with a value or another variable: `==`, `!=`, `>`, `>=`, `<` or `<=` (the ordering comparisons are for Numbers only). |

While a preview plays, the IF shows TRUE or FALSE for the event being played; the branch it took is lit and the other is dimmed and marked *skipped*.

<aside class="callout planned"><strong>Planned.</strong> An IF can contain a PARALLEL, and a PARALLEL branch can contain an IF, but an IF directly inside another IF isn't supported yet. Loops (repeat blocks) aren't built.</aside>

### Variables

Variables remember things between events, such as how many times something was clicked.

- **Make a Variable** in the palette's Variables section: give it a name, a type and a starting value.
- **Types:** **Number**, **Boolean** (true or false) and **String** (text). Values are never converted between types, so the text "3" isn't the number 3.
- **Set** [variable] to [value] gives it a value, either fixed or another variable's.
- **Change** [variable] by [amount] adds to a Number (use a negative amount to subtract).

```program
WHEN Click [Next]
Change [clicks] by [1]
IF [clicks] >= [3]
  Play [Confetti]
END
```

Every Preview starts each variable from its starting value, and events are handled in time order, so a later event sees the value an earlier one left. Renaming a variable updates every block that uses it; deleting one asks first, then removes its Set and Change blocks. While the video plays, a state panel shows each variable's value at the playhead.

MeCorder checks variables before Preview: an unknown variable, setting the wrong type, changing a non-Number or an impossible comparison is listed as a problem to fix.

<aside class="callout planned"><strong>Planned.</strong> Variables belong to one Program (and its Behaviours). Variables shared across a whole project aren't built yet.</aside>

### PARALLEL

A **PARALLEL** block starts several branches at the same moment and continues with the next block when the longest has finished.

```program
WHEN Click [Publish]
PARALLEL
  Focus [Publish]
  Wait [0.5] seconds
BRANCH
  Highlight [Publish]
BRANCH
  Play Sound
END
Reset
```

Use **+ Add branch** or the **Branches** count in the inspector; each branch can be moved or removed. Branches can hold any block, including IF, Wait Until, Run and another PARALLEL. During Preview each branch shows *waiting*, *running* or *complete*.

Two branches may read the same variable but can't both change it, because the result would depend on which ran first; Preview refuses until you fix it. When two branches use the same thing at once (the camera, the cursor, highlights or the whole picture), you get a warning. A Focus and a Zoom that start together are combined into one camera move.

## Reusable Behaviours

A **Behaviour** is a set of blocks you define once and run from any Program or shot, like a custom block in Scratch.

```program
WHEN Click [Sign In]
Run [Emphasise] Target [Sign In]
```

### Creating a Behaviour

1. Select the first block, then shift-click the last block in the same script.
2. Right-click and choose **Create Behaviour…**.
3. Name it and tick which elements should become **parameters**, so each use can choose its own target.

The blocks move into the new Behaviour, and a **Run** block takes their place, bound to the same elements, so nothing changes in the video. It's one undo step. You can also start an empty one with **Make a Behaviour** in the palette's Behaviours section.

### Running and editing

Drag a Behaviour from the palette to make a **Run** block, or add one and pick the Behaviour from its menu. Each parameter has its own menu: the **current event target** (the element that started the Program), any element from the recording, or, inside another Behaviour, that Behaviour's own parameters.

Click a Behaviour in the palette (or **Edit Behaviour** on a Run block) to open its blocks, under a **Define** block with its name and parameters. Parameters are targets; **+ Parameter** adds one. The header shows how many places use it.

A Behaviour uses the variables of whichever Program runs it, matched by name. While previewing, its blocks light up whichever Program is running them.

### Changes apply everywhere

Programs refer to a Behaviour, not a copy of it, so editing a Behaviour changes what every Program and shot using it does the next time you press Preview.

A Behaviour can run other Behaviours, but never itself, directly or through others. Behaviours that would make such a loop are greyed out in the Run menu, and MeCorder refuses to run one before anything plays.

## Scenes and Shots

Beyond Programs that react anywhere in the recording, you can direct the video scene by scene. The sidebar's **Scenes** group lists your [scenes](/docs/timeline#scenes) in playback order, as numbered chapters with their length and a frame from each.

Each scene has three parts, each a script of ordinary blocks:

- **ENTER** runs as the scene starts: *When [Demo] starts*.
- **Shots** run in order. A shot starts either **after the shot before ends** or **when something happens**: a WHEN with any [trigger](#triggers), whose blocks can use that event's element.
- **EXIT** runs as the scene ends: *When [Demo] ends*. A Reset in EXIT returns the camera to how it was before the scene began.

```program
WHEN Click [Search]
Focus [Search]
Wait Until Text Input [Search Field]
Reset
```

### Editing scenes and shots

- **+** on the Scenes heading starts a new scene at the playhead, splitting the scene there in two.
- A scene's menu has **Rename**, **Add Shot**, **Move Up**, **Move Down** and **Delete Scene**. Drag scenes and shots to reorder them.
- Click a shot (or ENTER or EXIT) to open its blocks. The breadcrumb shows where you are (*Video › Demo › Search*), and the header has the shot's name, how it starts, and its **Length**: **Auto** (as long as its blocks take) or **Fixed** (the next shot starts after exactly this long).

Wait, Wait Until, AT, IF, PARALLEL, variables and Behaviours all work inside shots. A scene's parts share the video's variables.

### Transitions

Between two scenes in the sidebar, a quiet chip says how one hands over to the next. Click it to choose **Cut** or **Fade** of 0.2, 0.4, 0.8 or 1.2 seconds. A Fade dips through black: the outgoing scene fades out over the first half of the length and the next fades in over the second. The same choice is in a selected scene's inspector on the Timeline.

Preview runs the scenes and the Programs together, as one undo step. While the video plays, the execution strip shows the scene, shot, block and whether it's running, waiting, between shots or in a transition.

## Ask

The **Ask** box (*What should happen?*) floats over the canvas. Describe what you want in plain words and press <kbd>⌘↵</kbd>:

- "When I click Save, zoom in and ripple."
- "Make this shot wait until I type in the search field."
- "Fade between the intro and the demo."

It works on what you're editing: the box shows its scope, and a selected block is "this". Suggestions for the current level appear when you click into it. In Program view, <kbd>⇧⌘A</kbd> and the ✦ button in a block's inspector put the cursor in the box.

### Proposals

The answer is a **proposal**, never a change: the blocks it would add, drawn in their real shapes and colours inside a dashed outline marked SUGGESTION. Before anything is shown as ready, MeCorder checks it:

1. it's well formed;
2. it only uses blocks and events MeCorder has; anything else is listed as unsupported;
3. every target matches an element in the recording, by name, then by words, then by kind. If several match equally, you're asked to **Choose…**; if none does, it says *Target not found* and suggests close matches;
4. the result is a valid Program, with sound variables and no Behaviour loops;
5. PARALLEL branches don't conflict.

Each check shows a tick or a cross. **Apply** adds the blocks as one undo step, after which they're ordinary blocks you can edit, save and play like any others. **Discard** throws the proposal away. **Details** shows exactly what was asked and what came back.

### Offline or Claude

- **Offline:** without an API key, a built-in interpreter understands common phrasings and goes through exactly the same checks. It works without a network connection.
- **Claude:** with your own Anthropic API key, set up for the [AI Director](/docs/timeline#ai-director), free-form requests work too.

Only text is sent: what you're editing and its blocks, the current scene and time, the recording's element names and kinds, your Behaviours, variables, Programs and scenes, and the first events. No video, audio, file names or internal ids ever leave your Mac.
