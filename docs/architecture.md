# Architecture — Uvrstitve, točke po mestih, Lestvica

Owner: Rok (Architect) · Inputs: docs/requirements.md, docs/design-spec.md

## Stack (unchanged)
- React 19 + Vite + TypeScript — obstoječe; brez novih odvisnosti.
- Dexie (IndexedDB) + `dexie-react-hooks` `useLiveQuery` — lokalno shranjevanje, samodejno osveževanje zaslonov ob spremembi (pokrije AC2.6 brez dodatne logike).
- Brez backenda: vse je client-side, zato Backend (Jan) v tej nalogi nima dela.

## Data model — **brez spremembe sheme** (F5 / D8)
Dve novi **opcijski, neindeksirani** lastnosti na obstoječih entitetah:

| Entiteta | Nova lastnost | Pomen |
|---|---|---|
| `Competition` | `placements?: Record<competitorId, number>` | doseženo mesto (celo št. ≥ 1); manjkajoč ključ = brez uvrstitve |
| `Category` | `pointsByPlace?: number[]` | `[i]` = točke za mesto `i+1`; `undefined` = tabela še ni bila nastavljena |
| `Category` | `pointsForOtherPlaces?: number` | točke za mesta izven `pointsByPlace` (D13); `undefined` = 0 |

Zakaj tako:
- Dexie shrani cele objekte; neindeksirane lastnosti ne zahtevajo `db.version(2)` ne nadgradnje. **`db.version(1).stores(...)` se NE spreminja** → obstoječa baza se odpre nespremenjena, noben obstoječi zapis se ne prepiše (AC5.1, AC5.2).
- Obstoječi zapisi preprosto nimajo novih lastnosti → koda jih mora obravnavati kot `undefined` (AC5.3).
- Isti vzorec kot obstoječi `startNumbers`.
- Točke se **ne shranjujejo** (D5) — edini vir resnice sta mesto + tabela; ni sinhronizacije, ni zastarelih vrednosti.

Trade-off: brez indeksa ni poizvedb po mestih — ni potrebe, podatkov je malo (desetine tekem), lestvica se računa v pomnilniku.

## Constraints za implementacijo
1. **Brez sprememb v `src/db/db.ts`** (verzija, shema).
2. Zapisi samo prek delnega `update` (`db.competitions.update(id, { placements })`, `db.categories.update(id, { pointsByPlace })`) — nikoli `put` celega objekta, da se ne izgubijo druga polja.
3. `CompetitionEditPage` ostane nespremenjen; ker uporablja delni `updateCompetition`, urejanje tekme ne izbriše `placements`.
4. Vsa koda, ki bere nova polja, mora prenesti `undefined` (`?? {}`, `?? []`).
5. Pri izračunu se upoštevajo samo mesta za **trenutne** `participantIds` tekme (če je bil udeleženec odstranjen, njegovo staro mesto ne šteje). Ob shranjevanju Uvrstitev se zapišejo samo mesta trenutnih udeležencev.
6. Tabela točk se vzame iz **trenutne kategorije tekme** (`competition.categoryId`).
7. Izvoz/uvoz (`src/db/exportImport.ts`) ostane nespremenjen: izvaža cele objekte (vključno z novimi polji), uvoz z `bulkPut` sprejme stare datoteke brez novih polj (AC4.1, AC4.2). `version: 1` formata izvoza ostane.
8. Analiza (`src/utils/stats.ts`) se ne spreminja (AC5.4).
9. Predizpolnitev (D12/D14) v `seedDatabase`: za vsako kategorijo z `pointsByPlace === undefined` delni `update` z privzeto tabelo; nove namestitve dobijo tabelo ob ustvarjanju kategorij. Privzeta tabela je ena konstanta v `src/db/seed.ts`.

## Komponente in odgovornosti
| Modul | Odgovornost |
|---|---|
| `src/types/models.ts` | nova opcijska polja |
| `src/db/repositories/competitions.ts` | `setPlacements(id, placements)` |
| `src/db/repositories/categories.ts` | `setPointsByPlace(id, points)` |
| `src/utils/standings.ts` (nov) | čiste funkcije brez React/Dexie: `pointsForPlace`, `computeStandings`, validacija vnosa (`parsePlace`, `parsePoints`) |
| `src/pages/PlacementsPage.tsx` (nov) | zaslon Uvrstitve, route `/competitions/:id/placements` (izven `MainLayout`) |
| `src/components/settings/PointsTableEditor.tsx` (nov) | urejevalnik tabele v Nastavitvah |
| `src/pages/StandingsPage.tsx` (nov) | zavihek Lestvica, route `/standings` (v `MainLayout`), naložen lazy kot `AnalysisPage` |
| `TabBar`, `Icon`, `LiveEntryPage`, `SettingsPage`, `App` | vstopne točke |

Tok podatkov: Dexie → `useLiveQuery` hooki (`useCompetition(s)`, `useCategories`, `useAllCompetitors`) → čiste funkcije v `standings.ts` → prikaz. Zapisi: komponenta → repozitorij → Dexie → `useLiveQuery` osveži vse zaslone.

## `computeStandings` pogodba
- Vhod: tekme ene kategorije (že filtrirane po letu), vsi tekmovalci, `pointsByPlace`.
- Izhod: vrstice `{ competitorId, name, isChild, points, competitions, bestPlace, rank }`, urejene po AC3.7 (točke ↓, count-back po številu 1., 2., … mest, nato ime); `rank` je enak za popolnoma izenačene, naslednji se preskoči (1, 1, 3).
- Vključeni le tekmovalci z ≥ 1 veljavnim mestom (AC3.4).
- Leto = prvi 4 znaki `competition.date` (ISO).

## Verification hooks za QA
- `npm run build`, `npm run lint`.
- Test ohranitve podatkov: pred posodobitvijo izvozi podatke, po posodobitvi primerjaj število zapisov in Analizo.
