# Rules Source of Truth — Options & Plan

> Goal: one stable, machine-readable reference for D&D 2024 rules that Claude checks before writing guides or game data. I tested every option below from this cloud session on 2026-11-18.
> Scores (0–10): **Coverage** (does it have everything Aldric uses, including the Oath of Vengeance?) · **Structure** (easy to query precisely) · **Access** (reachable from here today) · **Legal** (safe to copy into a public repo).

---

## Key fact first

The free official **SRD 5.2.1** (the 2024 rules under CC-BY-4.0) includes the Paladin class but **only the Oath of Devotion subclass**. Vow of Enmity, Relentless Avenger and the Oath of Vengeance spell list are **not** in any SRD-based source. Covering Aldric fully needs something beyond the SRD.

---

## Option 1 — 5etools data mirror (raw JSON on GitHub) ⭐ best coverage

`5etools-mirror-3/5etools-src`, `data/` folder. It's the same data the 5e.tools website shows, as clean JSON files: classes, subclasses, spells, monsters, items, and full book text for the 2024 Player's Handbook, DMG and Monster Manual (`XPHB`, `XDMG`, `XMM`). **Tested working**: I verified Aldric's features, Find Steed and the Otherworldly Steed stat block. Downside: it hosts non-free content, so the mirror can be taken down, and we shouldn't commit copies of it into a public repo.

| Coverage | Structure | Access | Legal | **Total** |
|---|---|---|---|---|
| 10 | 9 | 9 | 3 | **31/40** |

## Option 2 — 5e.tools website

The website itself is excellent for you as a human: fast search, filters, and links between rules. For me it's poor. Cloudflare's bot check blocks my requests (I tested it: the page returns "Just a moment…"). Even when a page loads, the site is a JavaScript app, so the real content lives in the JSON files from Option 1 anyway. Keep using it in your browser and send me links. I'll look up the same entry in the JSON.

| Coverage | Structure | Access | Legal | **Total** |
|---|---|---|---|---|
| 10 | 4 | 1 | 3 | **18/40** |

## Option 3 — Open5e (API + raw data, SRD 2024)

A community project with a free REST API and a GitHub repository holding the SRD 2024 as JSON (`data/v2/wizards-of-the-coast/srd-2024/`). **Raw files tested working** (339 spells). The API host (`api.open5e.com`) is currently blocked by this environment but could be allowed. It's CC-BY licensed, so it's legal to copy with attribution. It's clean and well-organized but limited to the SRD: no Oath of Vengeance, no Vow of Enmity. Great as the legal backbone for spells and conditions.

| Coverage | Structure | Access | Legal | **Total** |
|---|---|---|---|---|
| 6 | 9 | 8 | 10 | **33/40** |

## Option 4 — 5e-bits D&D 5e API (dnd5eapi.co)

A popular free REST/GraphQL API that's been around for years, with a `2024` data set in its GitHub repo (`5e-bits/5e-database`, `src/2024/en/`). **Raw 2024 spells file tested working** (339 spells, including Divine Smite, Find Steed and Hunter's Mark). The live API host is blocked here but could be allowed. It has the same SRD-only limitation as Open5e, and its 2024 coverage is newer and less complete. A fine alternative to Open5e if you prefer its format.

| Coverage | Structure | Access | Legal | **Total** |
|---|---|---|---|---|
| 5 | 8 | 7 | 10 | **30/40** |

## Option 5 — Official SRD 5.2.1 PDF (Wizards of the Coast)

The authoritative free text, published by Wizards of the Coast on D&D Beyond under CC-BY-4.0. It's the most trustworthy wording possible and legal to quote with attribution. But it's a PDF of about 360 pages: readable for me, but slower and less precise than JSON. Its host is blocked here, though you could upload the PDF directly. SRD-only coverage, so no Oath of Vengeance. Best used as the tie-breaker when two JSON sources disagree.

| Coverage | Structure | Access | Legal | **Total** |
|---|---|---|---|---|
| 6 | 4 | 5 | 10 | **25/40** |

## Option 6 — D&D Beyond (official, everything you own)

Wizards of the Coast's own platform, with every book you've bought, including the full 2024 Player's Handbook and the Oath of Vengeance. It's official and always up to date with errata. But there is **no public API**, and its terms forbid scraping. You can only copy and paste text or share screenshots manually. Good for one-off checks when something looks wrong, but it can't be an automated source of truth for me.

| Coverage | Structure | Access | Legal | **Total** |
|---|---|---|---|---|
| 10 | 3 | 1 | 6 | **20/40** |

## Option 7 — Your DM's Alchemy export (table truth)

Not a rulebook, but the most authoritative source for **your table**: Aldric's real stats, magic items (DuskMare, Emberthread Bandage), the house rule for drinking potions, and the DM's own feature text. It should override the published rules whenever they disagree. Export it again after each level-up or new item and keep it private (it's not committed, and it contains your DM's links). Combine it with a rules database rather than relying on it alone.

| Coverage | Structure | Access | Legal | **Total** |
|---|---|---|---|---|
| 4 | 8 | 10 | 5 | **27/40** |

---

## Recommended setup (layered)

### Layer order: who wins a disagreement
1. **DM ruling / Alchemy export** (table truth)
2. **5etools mirror JSON** for anything 2024 Player's Handbook, especially the Oath of Vengeance
3. **Open5e SRD 2024 JSON** for legal, committable data (spells, conditions, rules glossary)
4. **SRD 5.2.1 PDF** as the tie-breaker for exact wording

### How I'd build it (next step, about one session)
- Add a `rules/` folder with a small script that downloads the specific JSON files into a **git-ignored cache**, pinned to a mirror commit so the data doesn't shift under us.
- Add a lookup helper (`rules/lookup.py "Vow of Enmity"`) that prints the official text plus its source and page, so I quote rules instead of remembering them.
- Commit only SRD/Open5e data (CC-BY, with attribution) into the public repo. 5etools data stays in the local cache.
- The game's tooltips could later be generated from this data instead of hand-written text.

### What you'd need to approve
Nothing more for now: raw GitHub files already work. Optionally, allow `api.open5e.com` if we want live API queries later.

### Current verification status
I spot-checked the key claims in guides 01–04 and the game against the 5etools 2024 Player's Handbook (XPHB) data: Paladin feature levels; the action type and range of Divine Smite, Hunter's Mark, Shield of Faith, Lesser Restoration, Find Steed and Command; and the full Otherworldly Steed stat block. All match. A full line-by-line audit is a good first job for the lookup helper.
