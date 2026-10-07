# Design spec — Uvrstitve, točke po mestih, Lestvica

Owner: Nina (UI/UX) · Input: docs/requirements.md (checkpoint 1 approved)

Vsi novi zasloni sledijo obstoječemu iOS slogu (glava `PageHeader`, kartice `SettingsSection`, `SegmentedControl`, `EmptyState`, tabela kot v »Drugi« v Analizi). Besedila so v slovenščini.

## Flow F1 — Vnos uvrstitev
1. Seznam tekem → tap na tekmo → stran tekme (živi vnos).
2. V glavi strani tekme je nov gumb z ikono pokala (pred svinčnikom), aria-label »Uvrstitve«.
3. Tap → zaslon **Uvrstitve** (cel zaslon, brez spodnje vrstice, kot »Uredi tekmo«).
   - Glava: naslov »Uvrstitve«, podnaslov ime tekme, gumb Nazaj.
4. Uporabnik vpiše mesta in tapne **Shrani** → shrani in vrne na stran tekme.
5. Nazaj brez shranjevanja: če ni sprememb, takoj nazaj; če so spremembe, `ConfirmDialog` »Zavrži spremembe?« (Zavrži / Prekliči).

### Zaslon Uvrstitve
- Ena kartica, v njej vrstica na udeleženca, vrstni red kot v živem vnosu (po startni številki).
- Vrstica: [startna št. značka] ime [značka »otrok«] · desno: polje mesta (ozko, numerična tipkovnica, placeholder »–«) in pod/ob njem drobno sivo »100 t.«.
- Pod kartico gumb **Shrani** (primary, cela širina).

Stanja:
| Stanje | Prikaz |
|---|---|
| Nalaganje | prazen zaslon (kot drugod v aplikaciji) |
| Tekma ne obstaja | `EmptyState` »Tekma ne obstaja« |
| Ni udeležencev | `EmptyState` »Ni izbranih tekmovalcev« + »Uredi tekmo in dodaj udeležence.« |
| Prazno polje | placeholder »–«, točke se ne prikažejo |
| Veljavno mesto | točke iz tabele, npr. »80 t.«; mesto izven tabele → »0 t.« |
| Neveljavna vrednost (0, negativno, decimalno, besedilo) | polje rdeče obrobljeno, pod vrstico »Vpiši celo število od 1 naprej«; **Shrani onemogočen** |
| Podvojeno mesto | obe vrstici z oranžno oznako; nad gumbom Shrani opozorilo »Isto mesto ima več tekmovalcev« – Shrani ostane omogočen |
| Kategorija brez tabele točk | nad seznamom siv namig »Tabela točk za to kategorijo ni nastavljena – vse uvrstitve prinesejo 0 točk.« |
| Shranjevanje | gumb onemogočen med zapisom, nato navigacija nazaj |

## Flow F2 — Tabela točk (Nastavitve)
1. Nastavitve → nova sekcija **»Točke po mestih«** (med »Predloge struktur strelanj« in »Podatki«).
2. Na vrhu `SegmentedControl` s kategorijama (Izak / Zala – trenutni nazivi kategorij).
3. Seznam vrstic: »1. mesto« levo, desno polje s točkami (numerično). Zadnja vrstica ima rdeč gumb koš (isti slog kot v Predlogah) – odstrani se lahko samo zadnje mesto.
4. Pod seznamom: »+ Dodaj mesto« (sekundarni gumb) doda naslednje mesto s prazno vrednostjo. Pod tem vrstica **»Ostala mesta«** s poljem za točke (D13), ista validacija kot ostala polja.
5. Gumb **Shrani tabelo** (sekundarni). Po uspehu kratko besedilo »Shranjeno« ob gumbu (izgine po ~2 s).
6. Preklop kategorije z neshranjenimi spremembami: `ConfirmDialog` »Zavrži spremembe?« (sporočilo »Neshranjene spremembe tabele točk bodo izgubljene.«; Zavrži / Prekliči). Zavrži → preklop; Prekliči → ostane na trenutni kategoriji. Brez sprememb → takoj preklopi. (Odločitev uporabnika, D11.)

Stanja:
| Stanje | Prikaz |
|---|---|
| Ni tabele | »Ni nastavljenih točk – vsa mesta prinesejo 0 točk.« + gumb Dodaj mesto |
| Neveljavna vrednost (negativno, decimalno, besedilo) ali prazno polje | polje rdeče obrobljeno, **Shrani tabelo** onemogočen |
| Ni sprememb | Shrani tabelo onemogočen |
| Uspeh | »Shranjeno« |

## Flow F3 — Lestvica
1. Spodnja vrstica: nov zavihek **Lestvica** z ikono pokala, dodan na konec (Tekma · Nastavitve · Analiza · Lestvica) – obstoječi vrstni red ostane nespremenjen.
2. Zaslon: glava »Lestvica«; pod njo `SegmentedControl` kategorij (kot v Analizi, brez »Drugi«); desno/pod njim izbirnik leta (`select` v slogu izbirnika tekme v Analizi): »Vse« + leta padajoče.
3. Tabela (slog `OtherCompetitorsTable`, brez sortiranja s klikom – vrstni red je fiksen):
   | # | Ime | Točke | Tekme | Najb. |
   - »#«: skupno mesto; pri delitvi je mesto izpisano pri vsakem (1, 1, 3).
   - Točke: krepko, barva poudarka (kot % v tabeli Drugi).
   - Vrstica otroka: ozadje v mehki barvi poudarka + krepko ime.
4. Pod tabelo drobno sivo: »Točke po tabeli kategorije. Uredi v Nastavitvah.«

Stanja:
| Stanje | Prikaz |
|---|---|
| Ni vpisanih mest (za kategorijo/leto) | `EmptyState` z ikono pokala »Ni uvrstitev« + »Odpri tekmo in vpiši mesta pod Uvrstitve.« |
| Ni tabele točk, mesta pa so | tabela se prikaže (vse 0 točk) + namig nad tabelo »Tabela točk ni nastavljena.« |
| Izbrano leto brez tekem | ne more se zgoditi – ponujena so le leta, ki obstajajo |
| Preklop kategorije | izbrano leto se ponastavi na »Vse« |

## Consistency notes
- Ikona pokala (nova) se uporablja povsod za uvrstitve/lestvico: gumb v glavi tekme, zavihek, prazno stanje.
- Značke startne številke in »otrok« so iste kot v živem vnosu.
- Validacija številk enaka na obeh zaslonih: rdeča obroba + onemogočen gumb za shranjevanje; nobenih pojavnih oken za napake.
- Format točk: »N t.« v vrsticah, golo število v tabeli.
