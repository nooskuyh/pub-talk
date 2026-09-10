# Slidev Reuse Guidelines

This repository is a template used to convert new PDFs, papers, reports, or lecture materials into Slidev presentations. `slides.md` is not a finished presentation narrative, but a catalog for selecting and combining internal components and page layouts.

## Core Principles

A page in `slides.md` is fundamentally an example demonstrating a single internal component, rather than a fixed page layout.

- Use Slidev's native syntax if it can handle this much more cleanly.
- Primarily rely on text-driven exposition; use cards sparingly only when component separation is distinct.
- Tables, cards, boxes, code blocks, formulas, metrics, and flow steps are modular building blocks to combine within a presentation.
- Treat structures as page layout examples only when the visual arrangement itself is the goal (such as split left/right images, 3:7 ratio, top-bottom stacked, or center photo).
- Keep normal Markdown, flex, and grid for content with a clear reading order. Use Slidev's built-in `VDrag` / `v-drag` only for elements that benefit from direct visual positioning, resizing, overlap, or rotation.
- When creating a new presentation, select the necessary components and rearrange them to fit your content rather than copying example slides verbatim.
- Prefer Slidev Markdown, Comark block components, code fences, Markdown tables, and KaTeX formulas over raw HTML.
- NanumSquare from `public/fonts/` is used by default to ensure consistent font rendering regardless of CDN availability.
- Use animations freely when appropriate, but avoid excessive separation.


Maintain the design system:

- Single white background
- NanumSquare default typeface
- Neutral card borders
- Restrict colors to short text accents, icons, badges, and numbers
- Preserve existing spacing, border radii, shadows, and heading sizes
- Retain the bottom-right page number from `global-bottom.vue`

## Files to Preserve

- `style.css`: Visual system, component styling, layout styles
- `global-bottom.vue`: Global slide page number
- `components/`: Reusable components used in Markdown
- `layouts/`: Custom layouts used when page arrangement is the primary goal
- `package.json`: Slidev runner scripts and dependencies

Only modify `style.css` when a layout cannot be expressed with existing components. Any new style must extend the current system rather than introducing a separate color palette per deck.

## Authoring Syntax

Use the following syntax whenever possible:

```md
::card-grid{columns="3"}
::info-card{title="Problem" icon="i-carbon:warning-alt" tone="coral"}
Briefly describe constraints, risks, or observations that the audience must understand first.
::
::
```

Use Slidev code fences for code:

````md
```ts {1-3|5-7|all}
type Message<T> = {
  from: Role
  to: Role
  payload: T
}
```
````

Use Markdown tables for tables:

```md
| Category | Suitable Content | Guideline |
|---|---|---|
| Comparison | Method A/B | Keep columns to 4 or fewer |
```

Use KaTeX blocks for formulas:

```md
$$
\Gamma \vdash P : S \Rightarrow P \Downarrow \lor \exists P'. P \to P'
$$
```

## Procedure for Converting New Presentations

1. Extract the presentation structure from the source material first.
2. Outline draft slides at the sentence level.
3. Select appropriate internal components for each claim.
   Determine whether a card, table, box, code block, formula, metric, or flow best showcases the key idea.
4. Choose the composition mode after the content is known.
   Use a normal layout for aligned, sequential content; use native `VDrag` for image-heavy arrangements that need direct manipulation; use `<Place>` only for deliberately fixed coordinates.
5. Replace icons, labels, images, code, formulas, and table contents to fit the new topic.
6. Run `npm run dev` to visually compose and review free-form slides.
7. Run `npm run build` and verify that there is no overflow on the 16:9 canvas.

## Internal Components

### Text and Emphasis

Prioritize standard Markdown:

- Short paragraphs
- Lists of around three items
- Limited emphasis such as `**bold**`, `` `code` ``, or `[accent]{.accent}`

When a paragraph becomes long, trim the text first before wrapping it in boxes or cards.

### Cards

Use `card-grid` and `info-card`.

Suitable for:

- Presentation agenda / structure
- Key challenges
- Contributions
- Comparison points
- Summary of results

Include meaningful icons in card titles:

```md
::info-card{title="Correctness" icon="i-carbon:checkmark-outline" tone="teal"}
Compare the correspondence between model checker counterexamples and type checker errors.
::
```

### Boxes

Use `note-box` for core assumptions, cautions, or transition sentences:

```md
::note-box
The core goal of this slide is to reduce discrepancies between specification and implementation at the type level.
::
```

If multiple independent items must be presented, use a card grid instead of a box.

### Tables

Use standard Markdown tables. Keep the number of columns to 4 or fewer, and write concise sentences within cells. If cell content becomes lengthy, convert to cards or a split layout.

### Code

Use Slidev code fences instead of raw HTML code blocks. Use `template-code` to add a filename when necessary:

````md
::template-code{file="pipeline.ts"}
```ts
const stage = 'compose-layout'
```
::
````

### Formulas

Place KaTeX blocks inside `math-panel`. Rather than presenting full complex proofs, include only key equations that the presenter will explain:

```md
::math-panel{title="Progress" icon="i-carbon:function-math"}
$$
\Gamma \vdash P : S \Rightarrow \exists P'. P \to P'
$$
::
```

### Metrics

Use `metric-row` and `metric-item` only when prominently highlighting numbers for the presenter to explain:

```md
::metric-row
::metric-item{value="30%" label="guard reduction target"}
::
::
```

### Flow

Use `flow-steps` and `flow-step` when explaining a 3–4 step process.

### Click Animations and Reveals

Prioritize native Slidev click syntax (`<v-clicks>` / `v-click`) with standard Markdown lists over raw HTML elements:

````md
<v-clicks>

- First point
- Second point
- Third point

</v-clicks>
````

- Prefer slide frontmatter `class:` (e.g., `class: question-slide`) for slide-level styling rather than wrapping slides in extra container `<div>` tags.
- For full-slide overlay reveals (e.g., reactions, spotlight callouts), use a structured HTML container with `v-click` and scoped CSS classes to maintain clean separation and ensure content never overflows the 16:9 frame:
  ```html
  <div v-click class="wrong-overlay">
    <img :src="'/imgs/wrong.png'" alt="WRONG!" class="wrong-img" />
  </div>
  ```
- Prioritize Slidev Markdown for presentation text; use raw HTML selectively when specific custom layouts, components, or precise DOM structures genuinely require it.

## Page Layouts

Use page layouts only when screen structure itself is required. Rather than keeping example sentences verbatim, adapt them to the arguments and evidence of the new presentation.

### Proportional Split Layout

Use `layout: split` and specify `ratio`:

```md
---
layout: split
ratio: "6:4"
---

::left::
Left content

::right::
Right content
```

Usable examples:

- `ratio: "5:5"`: Equal weight
- `ratio: "6:4"`: Left description slightly larger
- `ratio: "7:3"`: Left argument, right supporting evidence
- `ratio: "8:2"`: Right side used as a small annotation
- `ratio: "3:7"`: Left short claim, right wide code/table/diagram

### Photo Left · Description Right

`layout: split-left`

Suitable for:

- System contexts where photos or screenshots should be shown first
- Equipment, field, product, or experimental setup descriptions
- When an image serves as the starting point for the presenter's explanation

### Description Left · Photo Right

`layout: split-right`

Suitable for:

- Pairing an implementation example after a theoretical claim
- Showing screen captures or outcome images following a procedure description
- When the left-side text should lead the logic

### 3:7 Layout

`layout: ratio-3-7`

Suitable for:

- Short claims on the left
- Wide code, tables, diagrams, or experimental results on the right
- When the material itself is more important than secondary explanations

Place only one piece of material in the wide area.

### Top-Bottom Stacked Layout

`layout: stacked`

Suitable for:

- Conclusion or question on top
- Supporting cards, tables, code, or diagrams below
- When hierarchy within a single screen must be distinct

### Center Photo Layout

`layout: center-photo`

Suitable for:

- Displaying a single large visual while the presenter explains it orally
- When the photo is the primary content of the slide
- Keeping only observation points and slide transitions at the bottom

## Free-Form Visual Composition

Free-form composition is an exception for visually led slides, not a replacement for the existing layouts. Use it for collages, annotated screenshots, overlapping images, rotated artifacts, and other arrangements where direct manipulation communicates the relationship better than rows or columns.

### Choose the Smallest Appropriate Tool

| Need | Use | Why |
|---|---|---|
| Ordered text, comparisons, repeated cards, aligned evidence | Markdown plus flex/grid layouts | Preserves reading order and predictable flow |
| Visual positioning, resizing, overlap, or rotation | Slidev `VDrag` / `v-drag` | Uses Slidev's native editor and persistence |
| Fixed coordinates that should not be interactively edited | `<Place>` | Provides a deterministic absolute wrapper only |

Do not introduce custom mouse handlers, resize handles, snapping, selection state, coordinate stores, or layout engines. `VDrag` already supplies those editing behaviors.

### Recommended VDrag Pattern

Give each draggable element a stable name in slide frontmatter. Use `v-drag` directly on a single element such as an image, and `<VDrag>` when positioning a component or a group of elements.

```md
---
dragPos:
  hero-image: 72,118,520,310,-2
  observation: 624,158,280,132,1
---

<img
  v-drag="'hero-image'"
  src="/images/experiment.jpg"
  alt="Experimental setup"
  class="composition-photo"
>

<VDrag pos="observation">
  <NoteBox>
    The highlighted region is the observation the presenter discusses.
  </NoteBox>
</VDrag>
```

The five stored values are `left, top, width, height, rotation` in Slidev canvas coordinates. Use `_` for height when text should determine its own height, for example `624,158,280,_,1`.

Native editing workflow:

1. Start the deck with `npm run dev` and open the target slide.
2. Double-click a draggable element to select it.
3. Drag to move it, use the native handles to resize or rotate it, and hold Shift while dragging to preserve its aspect ratio.
4. Use the arrow keys for small position adjustments.
5. Click outside the element to finish. Slidev writes the updated values back to `slides.md`.
6. Review presenter mode and export after the composition is stable.

Keep semantic slide content live inside `VDrag`: images remain images, links remain links, and Slidev components and click animations remain available. Do not flatten a composed slide into a screenshot merely to preserve its arrangement.

### Deterministic Placement with Place

`<Place>` is a static absolute-positioning wrapper. Its coordinates use Slidev's logical pixel canvas with the origin at the top-left. It has no editor, drag state, or persistence behavior.

```md
<Place :x="72" :y="438" :width="420" :z="20">
  <Badge icon="i-carbon:location">Fixed source annotation</Badge>
</Place>
```

Available properties are `x`, `y`, `width`, `height`, `rotate`, and `z`. Only `x` and `y` are required. Use `<Place>` when coordinates come from a deliberate static specification, when an anchored label must not move during visual editing, or when reproducing a known figure geometry. If an author is expected to adjust the object by eye, use `VDrag` instead.

### Composition Guardrails

- Keep headings and explanatory sequences in normal flow unless their placement is itself part of the visual composition.
- Prefer named `dragPos` entries so positions are easy to review and maintain.
- Keep final images under `public/`; external URLs are drafting placeholders only.
- Check that draggable content does not cover navigation targets or the bottom-right page number.
- Treat free-form coordinates as intentionally fixed for the 16:9 Slidev canvas, not as a responsive layout.
- Avoid positioning large paragraphs. Free-form slides should remain image-heavy and orally explainable.

## Images and Assets

- Save final presentation images as local files under `public/`.
- Use external images only during the drafting phase.
- Reconstruct simple diagrams from source PDFs using template components.
- Use screenshots only when precise visual materials are necessary.
- Write concise, factual captions.

## What Not to Change

- Background color
- Fonts
- Global slide padding
- Card border styling
- Page number position
- Key heading sizes
- Color system
- Global footer behavior

## Checklist Before Completion

- `npm run build` passes.
- All slides fit within the 16:9 canvas.
- Text does not overflow outside cards or buttons.
- Icons render properly.
- Images load or are saved locally.
- Colors are restricted to text accents, icons, badges, and numbers.
- Page layout examples are tailored to the new presentation content.
- Structured slides still use normal flow; only visually composed elements use `VDrag` or `<Place>`.
- Every `dragPos` entry has a stable, descriptive identifier and remains inside the 16:9 canvas.

## Commands

```bash
npm run dev
npm run build
```
