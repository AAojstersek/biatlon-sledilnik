# Requirements — Uvrstitve, točke po mestih, skupni vrstni red

Owner: Maja (PM) · Source: docs/decisions-log.md (D1–D7)

## Purpose
Po koncu tekme zabeležiti doseženo mesto vsakega spremljanega tekmovalca, iz tega po tabeli točk izračunati točke in prikazati skupni vrstni red v kategoriji — da starš vidi, kje je otrok v skupnem seštevku glede na sotekmovalce.

## Features

### F1 — Vnos uvrstitev za tekmo · **must-have**
Scenarij: Po tekmi uporabnik odpre tekmo, gre na Uvrstitve, za Izaka vpiše 3, za Žana 1, za Luko 7 in shrani. Ko se vrne, so vpisana mesta še vedno tam.

Kriteriji sprejemljivosti:
- AC1.1 Za vsako tekmo je s strani tekme dostopen zaslon Uvrstitve.
- AC1.2 Zaslon prikaže vse udeležence te tekme (in samo njih).
- AC1.3 Za vsakega udeleženca je mogoče vpisati mesto kot celo število ≥ 1.
- AC1.4 Polje za mesto je lahko prazno (tekmovalec brez uvrstitve, npr. DNF); prazno mesto = 0 točk in se ne šteje kot udeležba na lestvici.
- AC1.5 Vrednosti, ki niso cela števila ≥ 1 (0, negativna, decimalna, besedilo), se ne shranijo.
- AC1.6 Po shranjevanju in ponovnem odprtju zaslona so prikazana enaka mesta.
- AC1.7 Vpisana mesta je mogoče kasneje spremeniti ali izbrisati.
- AC1.8 Če imata dva udeleženca isto mesto, se prikaže opozorilo, shranjevanje pa je še vedno mogoče.
- AC1.9 Ob vsakem udeležencu so prikazane točke, ki mu jih prinaša vpisano mesto po tabeli kategorije tekme.
- AC1.10 Vnos uvrstitev ne spremeni vnesenih rezultatov strelanja.

### F2 — Tabela točk po mestih, po kategoriji · **must-have**
Scenarij: V Nastavitvah uporabnik za Izaka nastavi 1.→100, 2.→80, 3.→60; za Zalo drugačno tabelo.

Kriteriji sprejemljivosti:
- AC2.1 V Nastavitvah je za vsako kategorijo ločeno mogoče urediti tabelo točk.
- AC2.2 Tabela določa točke za zaporedna mesta od 1. naprej; mesta je mogoče dodajati in odstranjevati (zadnje mesto).
- AC2.3 Točke so cela števila ≥ 0.
- AC2.4 Za mesta, ki jih v tabeli ni, velja nastavljiva vrednost »Ostala mesta« (celo število ≥ 0, privzeto 0). (D13)
- AC2.5 Sprememba tabele ene kategorije ne vpliva na drugo kategorijo.
- AC2.6 Po spremembi tabele so točke na zaslonu Uvrstitve in na Lestvici takoj preračunane za vse pretekle tekme te kategorije.
- AC2.7 Kategorija brez nastavljene tabele daje 0 točk za vsa mesta.
- AC2.8 Ob prvem zagonu nove verzije imata obe kategoriji predizpolnjeno tabelo: 1→40, 2→30, 3→24, 4→20, 5→18, 6→16, 7→14, 8→13, 9→12, 10→11, 11→10 … 19→2, ostala mesta → 1. (D12)
- AC2.9 Predizpolnitev nikoli ne prepiše tabele, ki jo je uporabnik že shranil, in ne spremeni drugih podatkov. (D14)

### F3 — Lestvica (skupni vrstni red) · **must-have**
Scenarij: Uporabnik odpre zavihek Lestvica, izbere Izak, leto 2026 in vidi, da je Izak 2. s 340 točkami iz 5 tekem.

Kriteriji sprejemljivosti:
- AC3.1 V glavni navigaciji je zavihek Lestvica.
- AC3.2 Lestvica je prikazana za eno izbrano kategorijo; uporabnik lahko preklaplja med kategorijami.
- AC3.3 Upoštevane so samo tekme izbrane kategorije.
- AC3.4 Na lestvici so vsi tekmovalci, ki imajo v upoštevanih tekmah vsaj eno vpisano mesto (otrok in sotekmovalci).
- AC3.5 Za vsakega je prikazano: skupno mesto, ime, vsota točk, število tekem z vpisanim mestom, najboljše doseženo mesto.
- AC3.6 Vsota točk = vsota točk iz vseh upoštevanih tekem po trenutni tabeli kategorije.
- AC3.7 Vrstni red: več točk je višje; ob enakih točkah je višje tisti z več 1. mesti, nato več 2. mesti itd.; če je vse enako, si delita isto skupno mesto (naslednje mesto se preskoči, npr. 1, 1, 3), razvrščena po imenu.
- AC3.8 Otrok kategorije je na lestvici vizualno poudarjen.
- AC3.9 Filter po letu: »Vse« (privzeto) ali posamezno leto, ki se pojavi med datumi tekem kategorije; upoštevane so le tekme izbranega leta.
- AC3.10 Če ni nobenega vpisanega mesta za izbrano kategorijo/leto, je prikazano prazno stanje z namigom, kako vnesti uvrstitve.

### F4 — Varnostna kopija · **must-have**
- AC4.1 Izvoz podatkov vsebuje vpisana mesta in tabele točk; po uvozu v prazno aplikacijo sta Uvrstitve in Lestvica enaki kot pred izvozom.
- AC4.2 Uvoz starejše datoteke (brez mest in tabel) deluje brez napake.

### F5 — Ohranitev obstoječih podatkov · **must-have** (zahteva uporabnika)
Scenarij: Uporabnik ima v aplikaciji že vnesene kategorije, tekmovalce, tekme, startne številke, rezultate strelanja in predloge. Po namestitvi nove verzije je vse to še vedno tam.

- AC5.1 Po posodobitvi aplikacije so vse obstoječe kategorije, tekmovalci, tekme (vključno s startnimi številkami in opombami), rezultati strelanja in predloge nespremenjeni in vidni kot prej.
- AC5.2 Posodobitev ne zahteva ponovnega vnosa ali uvoza podatkov.
- AC5.3 Obstoječe tekme so brez vpisanih mest in se na Lestvici ne pojavijo, dokler uporabnik ne vpiše uvrstitev.
- AC5.4 Analiza (strelska statistika) za obstoječe podatke kaže enake številke kot pred posodobitvijo.

## Out of scope (ta verzija)
- Črtanje najslabših rezultatov (npr. »šteje najboljših 5 tekem«).
- Različne tabele točk po vrsti tekme (šprint, zasledovanje …).
- Samodejni izračun mesta iz časov ali strelanja.
- Lestvica čez obe kategoriji skupaj.
- Izvoz lestvice (PDF/CSV).

---

# Requirements v2 — Prenova videza (slog GO koledar / Budget)

Owner: Maja (PM) · Source: decisions-log D17–D18

## Purpose
Aplikacija naj bo videti in se obnaša kot uporabnikovi aplikaciji GO koledar in Budget, da so vse tri ena družina. Vnos strelov ostane enak. Glavna naprava je iPhone 16 Pro.

## Features

### V1 — Vizualni jezik GO · **must-have**
Scenarij: uporabnik odpre Biatlon takoj po GO koledarju; barve, pisava, glava, kartice in spodnja vrstica so videti iz iste družine.
- AC-V1.1 Barve, pisava, zaobljenosti in sence se ujemajo z GO (svetla in temna tema), vključno s temno modrim poudarkom (v temni temi belim).
- AC-V1.2 Vsi glavni zavihki imajo velik naslov kot GO; podstrani (tekma, uvrstitve, urejanje) imajo prosojno glavo kot GO.
- AC-V1.3 Seznami in nastavitve so v zaobljenih karticah z razmikom od roba, kot v GO.
- AC-V1.4 Spodnja vrstica z zavihki je kot v GO (prosojna, neizbrani zavihki sivi, izbrani v barvi besedila).
- AC-V1.5 Gumbi za dodajanje in brisanje v nastavitvah sledijo vzorcu GO (zelen »+«, rdeč »–«, brisanje v dveh dotikih ali s potrditvijo).
- AC-V1.6 Barva statusne vrstice ustreza novi barvni shemi; ikona aplikacije ostane nespremenjena (D20).

### V2 — Vnos strelov ostane enak · **must-have**
- AC-V2.1 Polja strelišč (L1, S1 …) imajo enako velikost (min. 58 × 58), obliko in razporeditev kot zdaj.
- AC-V2.2 Obarvanje polj je enako: 0 zgrešenih zeleno, ≥ 1 rdeče, izbrano polje z modrim obročem.
- AC-V2.3 Številčnica (0–5) ima enako velikost tipk, razporeditev in obnašanje (izbrana tipka modra, samodejni skok na naslednje prazno strelišče).
- AC-V2.4 Vnos traja enako število dotikov kot zdaj.

### V3 — Prilagoditev za iPhone 16 Pro · **must-have**
- AC-V3.1 Pri širini 393 pt in višini 852 pt ni vodoravnega drsenja na nobenem zaslonu.
- AC-V3.2 Vsebina se ne skriva pod Dynamic Islandom ali pod spodnjim indikatorjem (varni robovi upoštevani), tudi kot nameščena aplikacija na začetnem zaslonu.
- AC-V3.3 Na zaslonu vnosa strelov je pri 4 streliščih vidnih vsaj 5 tekmovalcev, ko je številčnica odprta.
- AC-V3.4 Vsi gumbi in dotikalne površine so vsaj 44 × 44 pt.
- AC-V3.5 Polja za vnos besedila ne povzročijo povečave strani ob dotiku.

### V4 — Izbira teme · **must-have** (D19)
- AC-V4.1 V Nastavitvah je izbira Svetla / Temna / Samodejno kot v GO; izbira se zapomni na napravi.

## Out of scope
- Nove funkcije ali spremembe obnašanja (razen V4).
- Velikost pisave A−/A+ iz GO.
- Namizni pogled.
- Spremembe podatkov — vsi vnosi ostanejo (F5 velja naprej).
