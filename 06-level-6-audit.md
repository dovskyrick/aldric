# Aldric Sonet — Level 6 Audit against the 2024 Rules

> Source of truth: 5etools data mirror (`5etools-mirror-3/5etools-src`), 2024 Player's Handbook (XPHB). Audited on 2026-11-18.
> What I checked: the DM's **Alchemy export** (the sheet you use), plus my own guides 01–04 and the trainer game.
> **Verdict:** the core of Aldric is correct. There are **3 real errors** on the Alchemy sheet, **several outdated spell texts** (2014 wording), and **missing species info**. Show this to your DM.

---

## ✅ Correct on the Alchemy sheet

| Item | Sheet | 2024 rule | |
|---|---|---|---|
| Class / level | Paladin 6 | — | ✅ |
| Proficiency bonus | +3 | +3 (levels 5–8) | ✅ |
| Hit Dice | 6 × d10 | d10 per level | ✅ |
| Saving throw proficiencies | Wis, Cha | Wis, Cha | ✅ |
| Armor / weapons | All armor, shields, simple + martial | Same | ✅ |
| AC | 18 | Chain Mail 16 + Shield 2 | ✅ |
| Speed | 30 ft | Human 30 ft | ✅ |
| Spell slots | 4 × 1st, 2 × 2nd | 4 / 2 at level 6 | ✅ |
| Prepared spells | 6 chosen + Oath spells | 6 at level 6 (Oath spells are extra) | ✅ |
| Oath spells | Bane, Hunter's Mark, Hold Person, Misty Step | Same for levels 3 and 5 | ✅ |
| Channel Divinity | 2 | 2 (1 back on Short Rest) | ✅ |
| Vow of Enmity text | Matches | Matches word for word | ✅ |
| Divine Sense, Faithful Steed, Aura of Protection, Extra Attack | Matches | Matches | ✅ |
| Blessed Warrior | Sacred Flame + Thaumaturgy | Any 2 Cleric cantrips | ✅ |
| Sacred Flame damage | 2d8 at level 5+ | 2d8 at level 5+ | ✅ |
| DuskMare attack | +9, 1d8+6 | Str +4, PB +3, magic +2 | ✅ |
| Grapple / Shove | DC 8 + Str + PB | DC 15 | ✅ |
| Help action (stabilize) | DC 10 Medicine | DC 10 Wis (Medicine) with Help | ✅ |
| Crafter feat | Matches | Matches (Artisan origin feat) | ✅ |
| Skills | 5 proficient | 2 class + 2 background + 1 Human | ✅ count fits |

---

## ❌ Errors on the Alchemy sheet (ask the DM to fix)

### 1. Lay on Hands tracker says 35 / 35
The pool is **5 × Paladin level = 30** at level 6. 35 is the level 7 value. The action's own description correctly says 30, so only the tracker is wrong.

### 2. Divine Smite is missing from the spell list
Paladin's Smite (level 2): Divine Smite is **always prepared**, plus **one free cast per Long Rest**. It's in the spell filter list but not in the actual spells, so it can't be cast from the sheet.

### 3. Find Steed is missing from the spell list
Faithful Steed (level 5): Find Steed is **always prepared**. There's a Faithful Steed *action*, but if you ever recast it with a 2nd-level slot, the spell itself isn't on the sheet.

---

## ⚠️ Spell texts are the old 2014 versions

The DM's Alchemy uses 2014 descriptions for several spells. The 2024 rules differ:

| Spell | Sheet (2014) | **2024 rule** |
|---|---|---|
| **Cure Wounds** | 1d8 + Cha; +1d8 per slot level | **2d8 + Cha (2d8 + 3)**; **+2d8** per slot level |
| **Lesser Restoration** | 1 Action; disease or condition | **Bonus Action**; ends Blinded, Deafened, Paralyzed or Poisoned (no disease) |
| **Hunter's Mark** | Extra 1d6 on *weapon* hits; move mark on a *later* turn | Extra **1d6 Force** on *any attack roll* hit; move the mark with a Bonus Action (no later-turn limit) |
| **Command** | No effect on Undead; 1 round | **Works on Undead**; Instantaneous |
| **Thaumaturgy** | Booming voice only | Booming Voice also gives **Advantage on Intimidation** checks |
| **Bless** | Holy water component | Holy Symbol (you have one as a Paladin focus) |
| **Protection from Evil and Good** | Holy water or silver | Holy Water worth **25+ GP, consumed** |
| **Divine Smite** (not on sheet) | — | 2d8 radiant, **+2d8 per slot level** above 1st, +1d8 vs Fiends/Undead |

The Divine Smite upcast matters most: a 2nd-level smite is **4d8**, not 3d8 (8d8 on a crit).

---

## ⚠️ Missing or incomplete info

### Human species traits (empty on the sheet)
2024 Humans get:
- **Resourceful:** gain **Heroic Inspiration after every Long Rest**. That's a free reroll you're probably not using!
- **Skillful:** one extra skill.
- **Versatile:** **an Origin feat** of your choice.

### A second Origin feat?
Only **Crafter** (from the Artisan background) is listed. Human's **Versatile** grants **another** Origin feat (Skilled, Alert, Tough…). Ask the DM which one Aldric has.

### Languages
The sheet shows only Common. 2024 characters know **Common plus two languages** from the Standard Languages table.

### Tool proficiencies
Crafter gives **three Artisan's Tools** (Smith's Tools fits a blacksmith!) and the background gives one more. None are listed.

### Level 4 feat
Level 4 gives Ability Score Improvement or another feat. It isn't recorded on the sheet. The ability scores suggest a +2 Strength / Charisma increase, but confirm with the DM.

### Aura of Protection isn't applied to the save numbers
The sheet probably won't add +3 automatically. Add it yourself to every save: **Str +7, Dex +3, Con +5, Int +2, Wis +7, Cha +9**.

---

## 🔍 Worth confirming with the DM

### Max HP 58
With the standard fixed HP (10 + Con at level 1, then 6 + Con per level) Aldric would have **52**. 58 is fine if you rolled HP, so just confirm.

### Weapon Mastery choices
Paladins get mastery with **two weapon kinds**. Warhammer = **Push** (10 ft). Battleaxe = **Topple** (Con save DC 15 or Prone). Choosing **Warhammer + Battleaxe** gives DuskMare's two forms one mastery each.

### Emberthread Bandage says "minor restoration"
No such spell exists. It's almost certainly **Lesser Restoration** (your session notes say so too). It's a homebrew item, so the DM decides.

### Duplicate inventory entries
**DuskMare** appears twice, and **Emberthread Bandage** appears twice (one with quantity 6, one with quantity 1 plus a 6-use counter). Probably leftovers from editing.

### Battle axe attack name
The DuskMare battle axe attack is internally named "DuskMare (Waraxe)". It's cosmetic, but the 2024 weapon is called Battleaxe.

---

## 🛠️ Corrections made to my own guides and the game

| Where | Was | Fixed to (2024 rule) |
|---|---|---|
| 01 Workflows #2 | 2nd-level smite = 3d8 | **4d8** (+2d8 per slot level) |
| 03 Battle paths (Hold Person crit) | 2nd-level smite on a crit = 6d8 | **8d8** |
| 03 Battle paths | Hunter's Mark moves "on a later turn" | Bonus Action, any time |
| 04 Steed guide | Mount/dismount "once per turn" | No such limit in 2024: 15 ft each time |
| 04 Steed guide | Reaction to land on your feet if the steed falls | 2024: you make the DC 10 Dex save instead |
| Game tooltips / rules | Same smite, Hunter's Mark and mounting errors | Fixed |

Everything else in guides 01–04 matched the 2024 data: feature levels, action types, ranges, the one-slot-per-turn rule, mounted combat, the Otherworldly Steed stat block, weapon masteries and Divine Favor.
