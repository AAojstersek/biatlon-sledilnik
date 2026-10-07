# Decisions Log

Owner: Luka (Lead)

## 2026-10-07 — Uvrstitve, točke po mestih, skupni vrstni red

Goal (user): po koncu tekme za vsakega tekmovalca vpisati doseženo mesto; iz mesta in tabele točk v Nastavitvah izračunati skupne točke in skupni vrstni red.

Decisions confirmed by the user:
- D1 — Vnos mesta: ločen zaslon »Uvrstitve«, dostopen s strani tekme (ne v vrstici živega vnosa, ne v obrazcu tekme).
- D2 — Tabela točk: ena tabela **po kategoriji** (Izak / Zala imata vsak svojo).
- D3 — Prikaz: nov zavihek **Lestvica** v spodnji vrstici.

Defaults proposed by Lead, accepted with plan approval:
- D4 — Mesta izven tabele prinesejo 0 točk.
- D5 — Točke se ne shranjujejo; vedno se izračunajo iz mesta in trenutne tabele (sprememba tabele preračuna lestvico).
- D6 — Lestvica ima filter po letu (»Vse« + posamezna leta).
- D7 — Izenačenja: točke ↓, nato count-back (več 1. mest, 2. mest …), nato ime; enaki rezultati delijo mesto.

Routing: PM (Maja) → requirements.md → **checkpoint 1** → UI/UX (Nina) + Architect (Rok) → **checkpoint 2** → Frontend (Ana; backend ni potreben – vse je lokalni Dexie) → QA (Eva) → **checkpoint 3**.

## 2026-10-07 — Ohranitev obstoječih vnosov
- D8 — Uporabnik zahteva, da vsi dosedanji vnosi ostanejo. Dodano v requirements.md kot F5 (must-have). Rok (Architect) mora to zagotoviti v architecture.md; nameravani pristop iz načrta (nova opcijska polja, brez spremembe sheme baze) je skladen s tem, končna odločitev je Rokova.

## 2026-10-07 — Checkpoint 1 approved; design + architecture
- Requirements approved by user ("naprej").
- design-spec.md (Nina) and architecture.md (Rok) written. No open questions between roles.
- D9 — Rok: no Dexie schema/version change; new optional fields only (satisfies F5).
- D10 — Nina: Lestvica tab appended last so existing tab order is unchanged.
- Open for user: switching category in points editor discards unsaved edits without confirmation (Nina's note).
- D11 — User: switching category in the points editor with unsaved edits asks for confirmation. design-spec.md updated. Checkpoint 2 closed; routing to Frontend (Ana).

## 2026-10-07 — Implementation note (Ana → Eva)
Built: model fields + repos (`setPlacements`, `setPointsByPlace`), `src/utils/standings.ts`, `src/utils/startNumbers.ts` (shared sort, also used by LiveEntryGrid), PlacementsPage (+ trophy button on competition header), PointsTableEditor in Settings (with D11 confirm), StandingsPage + Lestvica tab (lazy), `IconTrophy`, `--color-warning(-soft)` tokens. `db.ts` and `exportImport.ts` untouched.
Deviations/gaps:
- Loading vs. missing competition on Uvrstitve both show »Tekma ne obstaja« briefly — same behaviour as existing LiveEntryPage (hook can't distinguish).
- Points field: empty value counts as invalid (spec: "prazno polje" → rdeča obroba), so a new row must be filled before saving.

## 2026-10-07 — User request during QA: prefilled points table
- D12 — User supplied the official table: 1→40, 2→30, 3→24, 4→20, 5→18, 6→16, 7→14, 8→13, 9→12, 10→11, 11→10, 12→9, 13→8, 14→7, 15→6, 16→5, 17→4, 18→3, 19→2, **ostali → 1**. Prefill it so the user need not type it; it stays editable.
- D13 — "ostali → 1" supersedes D4 (places beyond the table = 0). New per-category setting »Ostala mesta« (default 0). Missing placement (empty) still = 0 points.
- D14 — Prefill applies to both categories, only where no table was ever saved (`pointsByPlace` undefined); a table the user saved (even empty) is never overwritten. No other existing data is touched (F5).

## 2026-10-07 — QA done → checkpoint 3
- test-report.md: all F1–F3, F5 criteria PASS; AC4.1 FAIL from the pre-existing import bug (fresh app duplicates categories). Escalated to user — out of this feature's scope.

## 2026-10-07 — Fix: import into a fresh app duplicates categories (user approved)
- D15 — On import, an existing category is removed (with its competitors) when: its id is not in the backup, the backup has a category of the same kind, and it has no competitions. Categories with competitions are never removed. Also: categories imported without a points table get the default table right after import (fixes test-report finding 2).
- D16 — Same root cause for presets: on import, an existing preset is removed if its id is not in the backup but the backup has a preset with the same name.
- QA retest after D15/D16: all criteria PASS (43/43 UI checks + import scenarios). Awaiting user approval at checkpoint 3.
