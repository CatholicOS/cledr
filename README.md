# Catholic Open Source CLEDR Project
The home of the **Common Liturgical Events Data Repository** curated by the Catholic Open Source organization.

## What is CLEDR?

The Catholic Open Source Common Liturgical Events Data Repository (CLEDR) provides a canonicalized list of identifiers for liturgical celebrations (or events)
that are defined by the Roman Missal Editio Typica, in both the [Temporale](https://en.wikipedia.org/wiki/Temporale) and the [Sanctorale](https://en.wikipedia.org/wiki/Sanctorale).

The [Editio Typica](https://en.wikipedia.org/wiki/Editio_typica) of the Roman Missal is the official source for the celebrations of the liturgical year,
and all language editions of the Roman Missal are based off of the Latin Editio Typica published by the [Dicastery for Divine Worship and the Discipline of the Sacraments](https://www.cultodivino.va/en.html).
In addition to the Roman Missal, liturgical celebrations (and therefore their canonical IDs) can also be established by Decrees of the Dicastery for Divine Worship and the Discipline of the Sacraments, before being eventually incorporated into a subsequent edition of the Roman Missal.

The Roman Missal is a living source, inasmuch as it can be revised and new editions can be published.
Liturgical celebrations from the Temporale and the Sanctorale cycles can be added or removed from one edition to the next.
Consequently, the CLEDR will need to be revised with each new edition of the Latin Roman Missal.
The year in which any given Editio Typica or revised edition of an Editio Typica was published shall be a sub-property of all canonicalized ids in the CLEDR,
and shall be referred to via its canonicalized id as set in the [Common Liturgical Books Data Repository](https://github.com/CatholicOS/clbdr) (which absorbed the former CRMETDR; the edition keys are unchanged).

## Work in Progress

The [liturgical_events.md](liturgical_events.md) document contains the current state of the work in progress for defining a standardized list of canonical IDs for liturgical celebrations in the Catholic liturgy. This document maps IDs from multiple existing sources:

- **LitCal API** (`litcal_key`): IDs from the [Liturgical Calendar API](https://github.com/Liturgical-Calendar/LiturgicalCalendarAPI)
- **RomCal API** (`romcal_key`): IDs from the [RomCal](https://github.com/romcal/romcal) liturgical calendar library
- **ePrex app** (`eprex_key`): IDs from the [ePrex](https://www.eprex.org/) app (partial coverage, some celebrations marked as missing)

The [calendarium-romanum](https://github.com/igneus/calendarium-romanum) Ruby gem was considered but is not currently included, as its HTTP API does not expose celebration identifiers.

The goal is to establish a unified, canonical identifier system that can serve as a reference for interoperability between different liturgical calendar implementations.

The scripts used to generate the mappings and documentation are available in the [liturgical-calendar-ids](https://github.com/JohnRDOrazio/liturgical-calendar-ids) repository.

While the canonical ID scheme is still being decided, [docs/identifier-durability.md](docs/identifier-durability.md) collects what the crosswalk itself already records about identifier drift — the Martha/Mary/Lazarus row that three schemes each resolved differently, the `0120`/`0120a`/`0120b` date-collision repair, and the Pio/Edith Stein/Mother Teresa key divergence — and shows the same rows under a machine-readable canonical identifier that keeps every existing litcal, romcal, and ePrex key working as a permanent alias, with multilingual labels carrying the human-readable layer.
