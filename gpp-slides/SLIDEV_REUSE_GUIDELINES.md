# Slidev Reuse Guidelines

This repository is a template used to convert new PDFs, papers, reports, or lecture materials into Slidev presentations. `slides.md` is not a finished presentation narrative, but a catalog for selecting and combining internal components and page layouts.

## Core Principles

A page in `slides.md` is fundamentally an example demonstrating a single internal component, rather than a fixed page layout.

- Primarily rely on text-driven exposition; use cards sparingly only when component separation is distinct.
- Tables, cards, boxes, code blocks, formulas, metrics, and flow steps are modular building blocks to combine within a presentation.
- Treat structures as page layout examples only when the visual arrangement itself is the goal (such as split left/right images, 3:7 ratio, top-bottom stacked, or center photo).
- When creating a new presentation, select the necessary components and rearrange them to fit your content rather than copying example slides verbatim.
- Prefer Slidev Markdown, Comark block components, code fences, Markdown tables, and KaTeX formulas over raw HTML.
- NanumSquare from `public/fonts/` is used by default to ensure consistent font rendering regardless of CDN availability.

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
4. Choose page layouts only when screen structuring is genuinely required.
   Use layout examples only when the relationship between images and descriptions, content width, or top-bottom hierarchy is clear.
5. Replace icons, labels, images, code, formulas, and table contents to fit the new topic.
6. Run `npm run build` and verify that there is no overflow on the 16:9 canvas.

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

## Commands

```bash
npm run dev
npm run build
```
