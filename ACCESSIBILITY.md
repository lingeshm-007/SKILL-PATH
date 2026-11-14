# Accessibility (a11y) Statement & Conformance

SkillPath AI is designed and implemented in adherence to **Web Content Accessibility Guidelines (WCAG) 2.1 Level AA** standards to ensure an inclusive, barrier-free learning platform for all students and educators.

---

## ♿ Core Accessibility Implementations

### 1. Perceivable
- **Semantic HTML & Landmark Roles**:
  - `<header role="banner">`
  - `<main id="main-content" role="main" tabIndex="-1">`
  - `<nav role="navigation" aria-label="...">`
  - `<footer role="contentinfo">`
  - `<div role="dialog" aria-modal="true">`
- **Text Alternatives (`alt` Text)**: All images and user avatars feature descriptive `alt` attributes (`alt="Avatar for Lingesh"`). Decorative icons use `aria-hidden="true"`.
- **Contrast & Typography**:
  - Text and UI components exceed the 4.5:1 minimum contrast ratio requirement against their respective backgrounds (using high-contrast Tailwind Slate/Indigo palette).
  - Scalable typography with fluid font sizing (`rem` / `em`).

### 2. Operable
- **Keyboard Navigation**:
  - Full keyboard traversal support for all interactive buttons, inputs, links, and navigation items.
  - Visible focus indicators (`focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:outline-none`).
  - **Skip to Content Link**: An accessible skip link (`<a href="#main-content">Skip to main content</a>`) allows keyboard users to bypass top-level navigation directly to page content.
- **No Keyboard Traps**: Modals and drawers can be opened, navigated, and closed via Escape key or dedicated accessible close buttons.

### 3. Understandable
- **Form Association**:
  - Every `<input>`, `<select>`, and `<textarea>` is bound to an explicit `<label htmlFor="...">` matching its unique `id`.
  - Visual placeholder text is supplemented by screen-reader accessible helper text (`sr-only` where visual space is compact).
  - Standard autocomplete tags (`autoComplete="email"`, `autoComplete="name"`, `autoComplete="current-password"`) facilitate assistive technologies and autofill agents.

### 4. Robust & Dynamic (ARIA)
- **Live Regions**: Toast notifications and real-time agent messages use `role="status"` and `aria-live="polite"` to announce updates to screen readers without interrupting user workflow.
- **Dynamic State Exposure**:
  - Dropdown buttons declare `aria-expanded` and `aria-haspopup="true"`.
  - Active tab navigation buttons expose `aria-current="page"`.
  - Modal containers declare `role="dialog" aria-modal="true" aria-labelledby="..."`.

---

## 🛠 Testing & Compliance Verification
- Automated Lighthouse Accessibility target: **100/100**.
- Screen reader verified against VoiceOver (macOS/iOS) and NVDA (Windows).
