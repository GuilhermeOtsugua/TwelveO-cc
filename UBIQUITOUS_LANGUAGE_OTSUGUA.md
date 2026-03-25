# Ubiquitous Language

## Brand / Page

| Term | Definition | Aliases to avoid |
|------|-----------|-----------------|
| **Otsugua** | The portfolio brand/site for Guilherme Augusto. | TwelveO-cc |
| **Presentation Page** | The main homepage that introduces Otsugua and its featured work. | Home page, main page |

## Homepage Content

| Term | Definition | Aliases to avoid |
|------|-----------|-----------------|
| **Navigation Bar (new)** | The sticky top bar that carries the brand and primary page links. | Nav, navbar |
| **Hero** | The opening section with the brand name and intro copy. | Banner, intro block |
| **Project Card** | One featured project module on the homepage. | Tile, card, work item |
| **Project Visual** | The image or screenshot shown in a project card. | Thumbnail, preview |
| **Project Description** | The short summary line under a project visual. | Outcome, caption |
| **Technical Note** | The code-like explanation attached to a project card. | Snippet, code snippet, hover note |
| **Credibility Strip** | The compact row of proof points below the projects. | Trust bar, stats row |
| **Contact Section** | The final section with direct contact links. | Footer CTA, contact block |

## Interaction

| Term | Definition | Aliases to avoid |
|------|-----------|-----------------|
| **Reveal** | The hover/tap interaction that shows the technical note. | Popup, tooltip, overlay |
| **Fade Out** | The delayed disappearance of a technical note after it opens. | Hide, dismiss |

## Typography

| Term | Definition | Aliases to avoid |
|------|-----------|-----------------|
| **Bodoni Small** | The Bodoni cut used for most display text on the page. | Fraunces, generic serif |
| **Bodoni Hero** | The Bodoni cut used only for the hero `Otsugua` wordmark. | Navbar font, title font |

## Relationships

- An **Otsugua** site contains one **Presentation Page**.
- A **Presentation Page** contains one **Navigation Bar**, one **Hero**, three **Project Cards**, one **Credibility Strip**, and one **Contact Section**.
- Each **Project Card** contains one **Project Visual**, one **Project Description**, and optionally one **Technical Note**.
- A **Reveal** may open a **Technical Note**.
- A **Fade Out** may follow a **Reveal**.

## Example dialogue

> **Dev:** "Should the **Technical Note** open from the **Project Card** or the **Project Visual**?"
> **Domain expert:** "From the **Project Card**. The **Reveal** should feel attached to the whole project, not just the image."
> **Dev:** "And after the **Reveal**, do we keep the **Technical Note** visible?"
> **Domain expert:** "Yes, briefly. Then a **Fade Out** should remove it so the **Project Card** stays dominant."
> **Dev:** "So the **Hero** stays separate, and only the **Project Cards** carry the technical layer?"
> **Domain expert:** "Exactly. The **Hero** introduces Otsugua; the **Project Cards** explain the work."

## Flagged ambiguities

- "Project" was used to mean both the overall portfolio item and the site itself. Use **Otsugua** for the site/brand and **Project Card** for each featured work item.
- "Snippet" and "technical note" were both used for the hover content. Use **Technical Note** as the canonical term.
- "Home page" and "presentation page" were both used. Use **Presentation Page** as the formal term.
