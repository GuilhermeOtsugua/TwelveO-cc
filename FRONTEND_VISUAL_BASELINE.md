# Front-End Visual QA Baseline

Use this before any future visual improvement pass.

## Core standard

Treat each featured surface as a product slice, not a decorated content block. The long-term target is "website within the website" realism: a viewer should feel like they are looking into a real interface, not reading a stylized explanation of one.

The interface must carry the argument before the note text does.

## Default workflow

1. Capture fresh desktop and mobile renders before editing.
2. Identify the focal region, the supporting regions, and the intended scan path.
3. List visible defects first.
4. Remove duplication and low-value scaffolding before adding anything new.
5. Re-render after each substantial pass.
6. Update tests and snapshots only after manual visual review.

## What counts as a real defect

- Repeated buttons, pills, labels, or cards that say the same thing.
- Misaligned headers, labels, baselines, or card tops.
- Overflowing or overlapping text and UI.
- Forced wrapping that makes one sibling look broken next to another.
- Empty vertical slabs or cards with too much dead space.
- Bands or regions that are too close together or too far apart.
- Sibling regions with noticeably inconsistent sizing without a clear reason.
- A supporting region competing with the focal region.
- A mobile stack that loses the desktop hierarchy.
- Copy that is doing work the interface should be doing.

## Working rules

- If two elements communicate the same state, keep one.
- Prefer shorter labels over wider cards.
- Prefer stronger hierarchy over more components.
- Prefer changing the underlying content structure when the problem is verbosity.
- Do not hide a hierarchy problem with more decorative styling.
- Do not accept "technically fits" as good enough if the result still looks cramped or awkward.
- Preserve believable product behavior and information density.
- On mobile, preserve order and importance, not just presence.

## Manual review checklist

Before calling a pass complete, check:

- Can the focal action or state be understood within a few seconds?
- Does the surface still read well before opening any explanatory note?
- Do similar cards share a consistent rhythm, padding, and title alignment?
- Are any statuses, chips, or buttons wider than they need to be?
- Is any region carrying obvious filler text or filler UI?
- Does any card look tall only because the copy is weak or repetitive?
- Does the desktop composition feel intentional instead of evenly distributed by default?
- Does mobile still feel like one product, not unrelated boxes stacked vertically?

## Testing principles

- Test visible behavior and durable structure, not long prose.
- Use feature tests to assert the existence of major regions, note hooks, and meaningful states.
- Use visual tests to guard the whole section and each major surface on desktop and mobile.
- Add focused interaction tests for toggles, reveals, and state changes.
- Add overflow checks for critical text containers, badges, pills, and status rows.
- Only update snapshots after comparing the render and confirming the change is an improvement.
- A passing snapshot is not proof of quality by itself. Manual review is still required.

## Evidence expected from an improvement run

- Fresh before/after renders for desktop and mobile.
- A short list of concrete defects fixed.
- Structural or behavioral tests updated where useful.
- Visual snapshots updated only after review.
- A note about what still looks wrong if the pass is intentionally partial.

## Pass modes

### Conservative pass

Use when the composition is fundamentally correct.

- Fix overflow, spacing, alignment, and sizing inconsistencies.
- Shorten labels and rebalance padding.
- Keep the same region structure.

### Hierarchy pass

Use when the page works but still feels scaffolded.

- Reduce repeated support elements.
- Reweight focal versus supporting regions.
- Remove UI that explains instead of proving.

### Structural pass

Use when the surface still does not feel like a real product slice.

- Merge or remove weak regions.
- Recompose the scan path.
- Allow meaningful layout change in order to make the interface read as an actual embedded product surface.
