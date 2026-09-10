---
theme: default
title: Slidev Presentation Template
info: |
  Slidev template with separated internal components and page layout examples.
highlighter: shiki
drawings:
  persist: false
transition: fade
fonts:
  sans: NanumSquare
  mono: JetBrains Mono
layout: default
comark: true
---

::deck-title{title="Slidev Presentation Template" kicker="Template System" presenter="Presenter Name" affiliation="Affiliation or Team" context="Component-Based Presentation Template" date="2026.05" logos="University, Lab, Project, Sponsor"}
<!-- Use subtitles only when necessary.
This is a reference document for selecting and assembling components and layouts into new presentations, not a finished talk.
-->
::

---

::kicker
Component · Text
::

# Text and Emphasis

Prioritize standard Slidev Markdown. Most explanatory slides can be built using only short paragraphs, bullet lists, and emphasis.

- Each slide should convey a single claim.
- Limit lists to around three items.
- Restrict emphasis to **bold**, `code`, `teal`{.teal}, `coral`{.coral}, `sage`{.sage}, `amber`{.amber}, `lavender`{.lavender}, and [accent color]{.accent}.

::badge-row
::badge{icon="i-carbon:rule"}
Default
::
::badge{icon="i-carbon:function-math" tone="teal"}
Teal
::
::badge{icon="i-carbon:code" tone="coral"}
Coral
::
::badge{icon="i-carbon:leaf" tone="sage"}
Sage
::
::badge{icon="i-carbon:idea" tone="amber"}
Amber
::
::badge{icon="i-carbon:branch" tone="lavender"}
Lavender
::
::

::note-box
When a paragraph grows too long, trim the content first before wrapping it in boxes or cards. The template is designed to highlight key points for the presenter to speak to, not to hold lengthy source text.
::

---

::kicker
Component · Cards
::

# Cards

::card-grid{columns="3"}
::info-card{title="Default Card" icon="i-carbon:assembly-cluster"}
Standard size designed to comfortably fit two to three lines of description. Use when there are few key items.
::

::info-card{title="Compact" icon="i-carbon:fit-to-screen" tone="teal" density="compact"}
Use when saving space is needed, such as in 3-column layouts or for secondary explanations.
::

::info-card{title="Dense" icon="i-carbon:collapse-all" tone="coral" density="dense"}
Use sparingly only when multiple short labels and single-line descriptions must be arranged together.
::
::

::card-grid{columns="3" density="compact"}
::info-card{title="Problem" icon="i-carbon:warning-alt" tone="coral"}
Briefly state the constraints, risks, or observations that the audience must understand first.
::

::info-card{title="Method" icon="i-carbon:flow-data" tone="sage"}
Present items for parallel comparison, such as methodologies, pipelines, or experimental procedures.
::

::info-card{title="Results" icon="i-carbon:chart-evaluation" tone="teal"}
Summarize numerical metrics, impacts, and qualitative findings.
::
::

---

::kicker
Component · Box
::

# Boxes

::note-box
**Default Box:** Place core assumptions, presenter interpretations, or transition sentences leading into the next slide.
::

::note-box
**Usage Guideline:** Reserve boxes for a single sentence that warrants emphasis. For multiple independent points, a card grid is more suitable.
::

::card-grid{columns="2"}
::info-card{title="Good Use" icon="i-carbon:checkmark-outline" tone="teal"}
Summary statements, cautionary premises, or points for the presenter to elaborate on orally.
::

::info-card{title="Avoid" icon="i-carbon:close-outline" tone="coral"}
Long blockquotes, complex tables, or crowding distinct arguments into a single box.
::
::

---

::kicker
Component · Table
::

# Tables

| Category | Suitable Content | Guideline |
|---|---|---|
| Comparison | Method A/B, Baseline vs. Proposed | Keep columns to 4 or fewer |
| Experiment | Dataset, Conditions, Metrics | Always specify units with numbers |
| Checklist | Feature support status | Prefer concise rationale over simple Yes/No |

::note-box
Tables use standard Markdown table syntax. If sentences inside cells become lengthy, converting them to cards or split slides improves readability.
::

---

::kicker
Component · Code
::

# Code

::template-code{file="src/protocol.rs"}
```rust {1-4|6-9|11-13|all}
enum Command {
    Propose(String),
    Commit(u64),
    Retry(String),
}

fn handle(command: Command) -> Result<u64, String> {
    match command {
        Command::Propose(value) if !value.is_empty() => Ok(value.len() as u64),
        Command::Commit(index) => Ok(index),
        Command::Retry(reason) => Err(reason),
        Command::Propose(_) => Err("empty proposal".into()),
    }
}
```
::

Specify step-by-step line highlighting inside `template-code` code fences, such as `{1-4|6-9|11-13|all}`.

---

::kicker
Component · Formula
::

# Formulas

::card-grid{columns="2"}
::math-panel{title="Definition" icon="i-carbon:function-math"}
$$
\forall r \in Roles.\ \mathrm{project}(S,r)\ \mathrm{is\ defined}
$$

Derive the local type of each role from the global protocol type.
::

::math-panel{title="Progress" icon="i-carbon:checkmark-outline" tone="teal"}
$$
\begin{aligned}
\Gamma \vdash P:S \land compatible(S) \\
\Rightarrow P \Downarrow \lor \exists P'. P \to P'
\end{aligned}
$$

Target state property: either terminating successfully or able to take a step.
::
::

---

::kicker
Component · Metrics
::

# Metrics

::metric-row
::metric-item{value="3" label="protocol families"}
::
::metric-item{value="4" label="failure effects"}
::
::metric-item{value="2" label="target runtimes"}
::
::metric-item{value="30%" label="guard reduction target"}
::
::

::note-box
Use metrics only to enlarge numbers for the presenter to explain verbally. If metric definitions are complex, elaborate on them in the next slide using tables or experimental setups.
::

---

::kicker
Component · Flow
::

# Step Flow

::flow-steps
::flow-step{number="1" title="Structure Input"}
Extract the core argument structure of the presentation from papers, reports, or experimental data first.
::

::flow-step{number="2" title="Select Components"}
Choose the building blocks—cards, tables, code, formulas, or images—that best showcase each key point.
::

::flow-step{number="3" title="Arrange Layout"}
Apply screen layouts like split, 3:7, stacked, or center photo only after the content has been decided.
::
::

---
layout: split-left
---

::left::

::image-frame{src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80" alt="Datacenter equipment" caption="Example: Image area presenting system context first"}
::

::right::

::kicker
Layout · Image Left
::

# Photo Left · Description Right

A layout that presents visual context first before providing interpretation.

- Ideal for datacenters, experimental equipment, and field photos
- Organize right-hand text in the order: problem, assumption, observation
- Replace images with local files under `public/` before the final presentation

---
layout: split-right
---

::left::

::kicker
Layout · Image Right
::

# Description Left · Photo Right

Present theoretical arguments or procedures first, followed by implementation examples or screenshots on the right.

::note-box
Recommended flow: Explain core rules → Present implementation image → Detail code or experimental conditions in subsequent slides.
::

::right::

::image-frame{src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80" alt="Code editing screen" caption="Example: Image area for explaining code, compilers, or runtime tools"}
::

---
layout: split
ratio: "3:7"
---

::left::

::kicker
Layout · Ratio Split
::

# Proportional Layout

Directly specify the left-to-right ratio, such as `ratio: "3:7"`. Adjust according to content weight, e.g., `5:5`, `6:4`, `7:3`, `8:2`.

::right::

::template-code{file="pipeline.ts"}
```ts
const stages = [
  'extract-claims',
  'choose-components',
  'compose-layout',
  'build-and-review',
]
```
::

::note-box
Place only one item in the wide area. If code and tables must both be shown, divide them across two slides.
::

---
layout: stacked
---

::top::

::kicker
Layout · Top Bottom
::

# Top-Bottom Stacked Layout

Place conclusions or questions at the top, and position supporting materials below.

::bottom::

::card-grid{columns="3"}
::info-card{title="Top" icon="i-carbon:text-font"}
Place a single-sentence claim, research question, or experimental conclusion.
::

::info-card{title="Bottom" icon="i-carbon:table"}
Place supporting evidence such as tables, cards, or diagrams.
::

::info-card{title="Transition" icon="i-carbon:arrow-right" tone="teal"}
After explaining the evidence, transition into detailed items on the next slide.
::
::

---
layout: center-photo
---

::title::

::kicker
Layout · Center Photo
::

# Center Photo Layout

::image::

::image-frame{src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1500&q=80" alt="Code on laptop" caption="Example: Large single scene layout with interpretation at the bottom"}
::

::caption::

Use when the presenter speaks while referring to the image. Keep bottom text concise, limited to key observation points and transition sentences to the next slide.

---
dragPos:
  freeform-primary: 216,166,294,172,-28
  freeform-detail: 572,193,340,204
  freeform-callout: 637,88,286,92
---

::kicker
Composition · Native VDrag
::

# Image-Heavy Free-Form Composition

<img v-drag="'freeform-primary'" class="composition-photo" src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80" alt="Datacenter equipment">

<VDrag pos="freeform-detail">
  <div class="composition-photo">
    <img src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80" alt="Code editor detail">
  </div>
</VDrag>

<VDrag pos="freeform-callout">
  <div class="composition-callout">
    <p><strong>Compose with Slidev itself.</strong><br>Double-click, move, resize, and rotate while the slide remains interactive.</p>
  </div>
</VDrag>

<Place :x="70" :y="452" :width="430" :z="20">
  <Badge icon="i-carbon:locked">Fixed annotation with Place</Badge>
</Place>

---

::kicker
Composition · Decision Guide
::

# Structure First, Free-Form When It Matters

| Content need | Authoring choice | Behavior |
|---|---|---|
| Ordered explanation or comparison | Markdown + flex/grid layout | Flows predictably |
| Image collage or visual annotation | Native Slidev drag elements | Move, resize, rotate, and persist visually |
| Deliberately fixed canvas coordinate | `<Place>` | Static absolute placement |

::note-box
Do not build drag handlers, resize controls, snapping, or coordinate persistence. Slidev already owns those interactions; this template only documents how to use them.
::

---

::deck-title{title="Choose Only the Pieces You Need" kicker="Template End" presenter="Q&A" context="Slidev component catalog" date="2026.05"}
Each slide in this template is not part of a finished presentation narrative, but an example of components and layouts you can take and use when creating new presentations.
::
