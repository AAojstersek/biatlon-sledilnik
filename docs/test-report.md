# Test report — Uvrstitve, točke po mestih, Lestvica

Owner: Eva (QA) · Date: 2026-10-07 · Against: docs/requirements.md (incl. D12–D14)

Method: production build (`vite build` + `vite preview`) driven by Playwright/Chromium at 390×844 (phone). For F5, data was written with the **previous build (HEAD 013f7af)**; then the **new build** was opened on the same origin and browser profile, as a real update would be. `npm run build` and `npm run lint`: clean. No console errors.

## Results

| AC | Result | Note |
|---|---|---|
| **F5 — Ohranitev podatkov** | | |
| AC5.1 | PASS | All stores byte-identical after the update (2 categories, 5 competitors, 2 competitions with start numbers + notes, 12 results, 5 presets). The only difference is the intended points table added to categories (AC2.8). DB version unchanged. |
| AC5.2 | PASS | No re-entry or import needed. |
| AC5.3 | PASS | Existing competitions have no placements; Lestvica is empty until places are entered. |
| AC5.4 | PASS | Analysis text for Izak + Drugi identical between old and new build. |
| **F1 — Uvrstitve** | | |
| AC1.1 | PASS | Trophy button → `/competitions/:id/placements`. |
| AC1.2 | PASS | Exactly the 3 participants, ordered by start number. |
| AC1.3–1.4 | PASS | Integers ≥ 1; empty field allowed and saved as "no placement". |
| AC1.5 | PASS | `0`, `-1`, `2.5`, `abc` → red border, message shown, Shrani disabled. |
| AC1.6–1.7 | PASS | Values persist; a cleared placement is removed (competitor then drops off the standings). |
| AC1.8 | PASS | Duplicate place → orange rows + warning; still savable. |
| AC1.9 | PASS | Points shown per row from the category table. |
| AC1.10 | PASS | Shooting results unchanged after saving placements. |
| Design: discard | PASS | Back with unsaved changes asks for confirmation; with no changes it goes straight back. |
| Arch. constraint 3 | PASS | Saving "Uredi tekmo" keeps placements, start numbers and notes. |
| **F2 — Tabela točk** | | |
| AC2.1–2.3 | PASS | Per-category editor; add rows, remove only the last; empty, negative or non-numeric values block saving; persists after reload. |
| AC2.4 | PASS | Places beyond the table get the »Ostala mesta« points (20. → 1, 35. → 1 with the default table). |
| AC2.5 | PASS | Editing Izak leaves Zala on the default table. |
| AC2.6 | PASS | Changing the table immediately recomputes Uvrstitve and Lestvica. |
| AC2.7 | PASS | No table → 0 points (unit check). |
| AC2.8 | PASS | After the update, both categories hold 40/30/24/20/18/16/14/13/12/11/10/9/8/7/6/5/4/3/2 with Ostala mesta 1. |
| AC2.9 | PASS | A table saved by the user survives app restarts (prefill does not overwrite it). |
| D11 | PASS | Switching category with unsaved edits asks for confirmation; Prekliči keeps the edits, Zavrži switches. |
| **F3 — Lestvica** | | |
| AC3.1–3.6 | PASS | Tab present; per category; columns #, Ime, Točke, Tekme, Najb.; sums correct (Žan 1.+2. = 180, Izak 3.+1. = 160). |
| AC3.7 | PASS | Equal points → count-back (Žan [1,2] ahead of Izak [1,3]); fully equal → shared rank (1, 1). |
| AC3.8 | PASS | Child row highlighted. |
| AC3.9 | PASS | Year filter (2025 shows only that competition); resets to »Vse« when the category is switched. |
| AC3.10 | PASS | Empty state »Ni uvrstitev«. |
| **F4 — Varnostna kopija** | | |
| AC4.1 (export) | PASS | The export contains `placements`, `pointsByPlace` and `pointsForOtherPlaces`. |
| AC4.1 (import into an **empty** app) | PASS (retest after D15/D16) | Fresh app: one Izak + one Zala, presets not duplicated, Analiza and Lestvica match the source. Importing into the same app removes nothing. |
| AC4.2 | PASS | An old-format export imports without errors. |

## Findings (all resolved)

1. **[FIXED — D15/D16]** **Importing into a fresh app duplicates categories** — *pre-existing bug, not caused by this feature; traces to implementation of import (Jan/Ana) + requirement gap (Maja).*
   - Expected: after importing a backup into an empty app, Uvrstitve and Lestvica match the source.
   - Actual: a fresh app first seeds its own Izak/Zala categories (new random ids), and the import adds the backup's categories next to them. Result: »Izak Izak Zala Zala« in Analiza and Lestvica, and the imported data sits behind the second tab. Reproducible with the previous build as well (Analiza shows the same duplication).
   - Impact: restoring a backup on a new phone. Importing into the **same** app the backup came from works correctly (same ids).
2. **[FIXED — D15]** *Minor:* a category imported from an old backup has no points table until the next app start, when it gets the default. *Traces to: Architect (constraint 9).*

3. **[FIXED — D16]** Found on retest: default presets were duplicated in the same way (Šprint ×2 …). After the fix, an existing preset is removed only when the backup has a preset with the same name.

Regression after the fixes: full suite rerun against data written by the previous build — 43/43 PASS, F5 data identical.

---

# Test report v2 — Prenova videza

Owner: Eva (QA) · Date: 2026-10-07 · Against: requirements v2 (V1–V4). Production build in Chromium, 393 pt wide. For V3, the safe areas (top 62 pt, bottom 34 pt) were subtracted from the viewport, because Chromium has no `env(safe-area-*)`.

| AC | Result | Note |
|---|---|---|
| V1.1–V1.4 | PASS | GO tokens (light and dark), large titles on tab pages, frosted sub-page headers, inset cards, GO tab bar (screenshots reviewed). |
| V1.5 | PASS | »Dodaj mesto« uses GO's green +. Delete is GO's red −; a preset needs a second tap on »Izbriši«. |
| V1.6 | PASS | theme-color #F5F5F7 / #000 follows the theme; app icon unchanged (D20). |
| V2.1–V2.4 | PASS | Bout fields and number pad read only the frozen `--shot-*` tokens, which hold the old values; 58 pt, radius 14 and layout unchanged. The selection ring is no longer clipped at the left edge. Entry flow unchanged (43/43 functional checks). |
| V3.1 | PASS | No page-level horizontal scroll on any screen. Only the preset chip row scrolls sideways, as before. |
| V3.2 | PASS (by construction) | Header uses `env(safe-area-inset-top)`, tab bar and number pad use `env(safe-area-inset-bottom)`. **Confirm on the device.** |
| V3.3 | PASS | 5 competitors × 4 bouts fully visible above the open number pad (5th row ends at 602, pad starts at 605). |
| V3.4 | PASS | Small glyphs (back, header actions, ×, −) have extended 44 pt hit areas. |
| V3.5 | PASS (by construction) | iOS-only rule keeps every field at ≥ 16 px. **Confirm on the device.** |
| V4.1 | PASS | Samodejno / Svetla / Temna; persists across a reload; status-bar colour follows it. |
| F1–F5 regression | PASS | 43/43 checks on data written by the pre-feature build; data identical. |
