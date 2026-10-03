/**
 * The product journal. MeCorder has had no public release yet, so entries are
 * development milestones, dated from the app's history. When releases start,
 * add `version` and the page shows it.
 */
export interface Release {
  date: string; // ISO
  version?: string;
  headline: string;
  description: string;
  /** Optional program-notation illustration (rendered as blocks). */
  blocks?: string;
  /** Optional image path under /public. */
  image?: string;
  improvements: string[];
  fixes?: string[];
}

export const RELEASES: Release[] = [
  {
    date: '2026-10-03',
    headline: 'A language for how videos behave',
    description:
      'Programs grew into a small visual language: several WHENs sharing variables, PARALLEL branches, scenes with shots and transitions, an Ask box that turns a sentence into checked blocks, and every effect available as a block. Export became safe and verified.',
    blocks: 'WHEN Click [Save]\nPARALLEL\n  Focus [Save]\nBRANCH\n  Play Sound\nEND\nReset',
    improvements: [
      'The Program view, with an Apple × Scratch design language shared by the Timeline',
      'Ask: describe what should happen; the proposal is validated against the recording before you apply it',
      'Scenes, shots and Cut or Fade transitions, run by the same executor as Programs',
      'Every effect in the library can be played from a Program block',
      'An inspector that follows the selection instead of a twelve-tab toolbox',
      'Import an ordinary video and edit it like a recording',
      'A split tool that cuts where you click, scrubbing in Programs, and hold Previous to rewind',
      'Calmer automatic zooms that ignore mouse noise, with a project-wide zoom switch',
    ],
    fixes: [
      'Exports are checked after rendering and replace the destination atomically; a failure leaves the old file untouched',
      'Recording stops safely if a writer fails, and two recordings can never start at once',
      'Closed editors and AI proposals can no longer overwrite a project',
      '4K exports keep 60 fps',
    ],
  },
  {
    date: '2026-10-02',
    headline: 'Programmable video',
    description:
      'The idea at the heart of MeCorder landed: clicks recorded as named elements, Programs that say what should happen when they occur, and a compiler that turns Programs into ordinary camera keyframes and effects.',
    blocks: 'WHEN Click [Primary Button]\nFocus [Primary Button]\nWait [0.3] seconds\nHighlight [Primary Button]\nReset',
    improvements: [
      'Programs: WHEN an event happens, run blocks; compiled to keyframes and effects in one undo step',
      'Hover, Hover Exit, Scroll, Key Press and Text Input events, normalised from the recording',
      'A block editor with drag-to-insert, several Programs per project and an Events list',
      'IF / ELSE, typed variables with SET, CHANGE and comparisons',
      'Reusable Behaviours with parameters',
      'Export asks where the video is going, and offers YouTube chapters afterwards',
    ],
    fixes: ['Preview drags follow the pointer at full frame rate'],
  },
  {
    date: '2026-10-01',
    headline: 'Ready for real recordings',
    description:
      'Recordings became crash-safe, clicks got names through Accessibility, and the editor gained captions, narration clean-up, looks, iPhone recording and export size targets.',
    improvements: [
      'Record a connected iPhone or iPad',
      'On-device captions and SRT or WebVTT subtitle files',
      'Narration clean-up: background noise removal and levelling; idle cuts never cut through speech',
      'Export quality, file size limits (10 MB to 250 MB) and GIF settings',
      'Looks: save a video’s styling and reuse it',
      'An adaptive cursor that changes on click and drag, and imported fonts for text',
      'Share or copy a finished export straight from the toolbar',
    ],
    fixes: [
      'Interrupted recordings are recovered up to the last couple of seconds',
      'Runaway memory use while the camera zooms',
      'The automatic camera eases back to the full view between distant focuses',
    ],
  },
  {
    date: '2026-09-30',
    headline: 'An editor you work in, not around',
    description:
      'The preview became the place to edit: tools to focus, spotlight and highlight by clicking, a contextual bar for the selection, a ⌘K command palette, fifteen new effects and Effect Studio for building your own.',
    improvements: [
      'Preview tools: Focus, Spotlight, Highlight, Callout and Zoom',
      '15 new effects, organised by what you want to do',
      'Effect Studio: build effects from layers of shapes, motion, glow and fade',
      'Light and dark appearance that follows macOS',
      'A user guide covering every feature',
    ],
  },
  {
    date: '2026-09-29',
    headline: 'First light',
    description:
      'The first build: ScreenCaptureKit recording with the cursor and keys kept separately, an automatic camera, a GPU compositor and exporter, a Timeline editor, effects and the AI Director.',
    improvements: [
      'Record a display or a window, with microphone, system audio and webcam as separate tracks',
      'Cursor and keyboard recorded beside the video, so the cursor can be restyled later',
      'Automatic zooms with easing, follow and framing',
      'Timeline editing with undo for every change',
      'AI Director: edit with a plain-language instruction, applied as one undo step',
    ],
  },
];
