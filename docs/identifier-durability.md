# Identifier durability in the CLEDR crosswalk

CLEDR's work in progress is a crosswalk: one canonical celebration mapped to the keys three independent implementations already use.
That crosswalk is the most honest evidence available that transparent keys drift, because it records three schemes drifting apart from each other in public.
The cases below are read from `liturgical_events.md` as generated; nothing here proposes changing any existing key.
The argument for machine-readable canonical identifiers is made once, in the canonical paper cited at the end — this document only supplies CLEDR's recorded evidence and the remedied form.

## Recorded cases

**1 — A decree moved the celebration; three keys moved three different ways.** The row for **Sanctorum Marthæ, Mariæ et Lazari** carries:

```text
litcal_key: StMartha
romcal_key: martha_of_bethany_mary_of_bethany_and_lazarus_of_bethany
eprex_key:  martha
```

The Latin name records all three companions, as the 2021 decree established them; the litcal key stayed frozen at the one name it was minted with, the romcal key absorbed the change and became 56 characters, and the eprex key stayed at `martha`, now naming a third of its own referent.
The row's Missal/Decree column reads `missale_romanum_1970`, though the registry records decrees of that same period elsewhere (`2021-01-25 - Prot. N. 40/21`).
One event, one referent, four surfaces that no longer agree — and every consumer that pinned any one of these strings pinned a different fact about the same day.

**2 — A date collision was repaired inconsistently inside a single scheme.** Two celebrations share 20 January:

```text
Sancti Fabiani, papæ et martyris    eprex_code: 0120    eprex_short_key: 0120a
Sancti Sebastiani, martyris         eprex_code: 0120b   eprex_short_key: 0120b
```

The disambiguating suffix was applied to one field of one row and to both fields of the other, so `0120` and `0120a` denote the same celebration while `0120` also reads as the unsuffixed base of a collision it no longer resolves.
A date-derived key must be repaired the moment two entities claim the same date, and the repair is a rename — which is exactly the operation an identifier is supposed to make unnecessary.

**3 — Three keys for three saints, and no two schemes agree on what the name is.** Same-person naming disputes are visible as pure key divergence:

```text
S. Pii de Pietrelcina                litcal: StPioPietrelcina   romcal: pius_francesco_forgione_priest
Sanctæ Teresiæ Benedictæ a Cruce     litcal: StEdithStein       romcal: teresa_benedicta_of_the_cross_stein_virgin
Sanctæ Teresiæ de Calcutta           litcal: StMotherTeresa     romcal: teresa_of_calcutta_virgin
Sanctæ Teresiæ de Avila              litcal: StTeresaJesus      romcal: teresa_of_jesus_of_avila_virgin
```

One scheme keys the religious name, the other the birth name; one keys the popular English style, the other the Latin lemma order.
Each choice is defensible and none is wrong, which is the point: the disagreement is about language and devotional register, and it has been encoded into identifiers, where it cannot be resolved by adding anything.

**Drift surface.** 526 of 615 rows carry `eprex_key: ⚠️ missing`, so most of the registry is currently a two-way crosswalk awaiting a third key that will be minted under a fourth naming convention.
Eighteen rows carry the literal name `%s temporis Nativitatis` — a format placeholder standing in for a rendered human-readable name, which is precisely the work a label layer is built to do and an identifier is not.

## The remedied form

The same rows under a machine-readable canonical identifier, with every current key preserved:

```text
id:      R8mQv3xTn7KpWd2Zb5Lg4c        # canonical — minted once, never re-minted; illustrative value
aliases: StMartha                      # litcal — permanent, resolves forever, never reused
         martha_of_bethany_mary_of_bethany_and_lazarus_of_bethany   # romcal
         martha                        # eprex
         0729                          # eprex_code
labels:  "Sanctorum Marthæ, Mariæ et Lazari"@la ·
         "Santi Marta, Maria e Lazzaro"@it ·
         "Sts. Martha, Mary and Lazarus"@en
```

The `R…` value above is illustrative only; real values are minted, not composed.
Every key in the table keeps working as a permanent resolvable alias, and every future scheme — eprex's 526 pending keys included — is added as one more alias rather than as one more thing to reconcile.
A decree that adds companions adds labels; a date collision is a property change; a naming dispute is settled by adding a label in the language that disputes it.
Nothing in the crosswalk is discarded and the canonical identifier never drifts: both, not either.

## Reference

The argument, evidence base, objections, and proposed amendments to `draft-cdcf-catholic-uri-scheme-03` are set out in
"Identifier Durability: Machine-Readable Canonical IRIs" (CDCF `foundation-docs`, `research/identifier-durability-opaque-canonical-iris.md`).
