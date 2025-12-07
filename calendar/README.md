# CLEDR Liturgical Calendar

Simplified liturgical calendar calculator extracted from the ePrex calendar system.
Provides both C# and TypeScript implementations for CLEDR integration.

## Overview

This module calculates:

- **Liturgical Season** (Ordinary Time, Advent, Christmas, Lent, Easter)
- **Week Number** within the season (1-34)
- **Psalter Week** (1-4 cycle)
- **Sunday Cycle** (A, B, C - 3-year cycle)
- **Weekday Cycle** (I, II - biennial cycle)
- **TitleCode** - ePrex-compatible code for content lookup
- **CLEDR ID** - Simplified ID for CLEDR event system

## Code Format

### TitleCode (ePrex Format)

```
TIT;{SeasonCode}{WeekCode}{DayCode}{YearCode}
```

Example: `TIT;AVV;ST01;1DOM;Y-AI` (First Sunday of Advent, Year A, Cycle I)

| Component | Format | Example | Description |
|-----------|--------|---------|-------------|
| SeasonCode | `XXX;` | `AVV;` | Liturgical season |
| WeekCode | `ST{nn};` | `ST01;` | Week number (01-34) |
| DayCode | `{n}XXX;` | `1DOM;` | Day of week |
| YearCode | `Y-{X}{I/II}` | `Y-AI` | Sunday + weekday cycle |

### Season Codes

| Code | English | Italian | Latin |
|------|---------|---------|-------|
| `ORD` | Ordinary Time | Ordinario | Tempus per Annum |
| `AVV` | Advent | Avvento | Adventus |
| `NAT` | Christmas | Natale | Nativitas |
| `QUA` | Lent | Quaresima | Quadragesima |
| `PAS` | Easter | Pasqua | Pascha |

### Day Codes

| Code | Day | Italian | Latin |
|------|-----|---------|-------|
| `1DOM` | Sunday | Domenica | Dominica |
| `2LUN` | Monday | Lunedì | Feria II |
| `3MAR` | Tuesday | Martedì | Feria III |
| `4MER` | Wednesday | Mercoledì | Feria IV |
| `5GIO` | Thursday | Giovedì | Feria V |
| `6VEN` | Friday | Venerdì | Feria VI |
| `7SAB` | Saturday | Sabato | Sabbatum |

## Usage

### TypeScript

```typescript
import { getLiturgicalDay, easter, LiturgicalSeason } from './liturgical-calendar';

// Get full liturgical information for a date
const info = getLiturgicalDay(new Date(2024, 11, 1)); // December 1, 2024

console.log(info.season);      // 'ADVENT'
console.log(info.weekOfSeason); // 1
console.log(info.sundayCycle);  // 'C'
console.log(info.titleCode);    // 'TIT;AVV;ST01;1DOM;Y-CI'
console.log(info.cledrId);      // 'avv/01/0'

// Calculate Easter
const easterDate = easter(2025);
console.log(easterDate); // 2025-04-20

// Get moveable feasts
import { pentecost, ashWednesday, firstSundayOfAdvent } from './liturgical-calendar';

const pentecostDate = pentecost(2025);       // Easter + 49 days
const ashWed = ashWednesday(2025);           // Easter - 46 days
const advent = firstSundayOfAdvent(2025);    // 4th Sunday before Christmas
```

### C#

```csharp
using CLEDR.Calendar;

// Get full liturgical information for a date
var day = new LiturgicalDay(new DateTime(2024, 12, 1));

Console.WriteLine(day.Season);       // Advent
Console.WriteLine(day.WeekOfSeason); // 1
Console.WriteLine(day.SundayCycle);  // "C"
Console.WriteLine(day.TitleCode);    // "TIT;AVV;ST01;1DOM;Y-CI"
Console.WriteLine(day.CledrId);      // "avv/01/0"

// Calculate Easter
var easterDate = LiturgicalCalendar.Easter(2025);

// Get moveable feasts
var pentecost = LiturgicalCalendar.Pentecost(2025);
var ashWed = LiturgicalCalendar.AshWednesday(2025);
var advent = LiturgicalCalendar.FirstSundayOfAdvent(2025);
```

## Easter Algorithm

Uses the Meeus/Jones/Butcher algorithm for the Gregorian calendar, valid for years 1583-2499:

```
a = year mod 19
b = year mod 4
c = year mod 7
d = (19a + m) mod 30
e = (2b + 4c + 6d + q) mod 7
f = 22 + d + e

Easter = March f (or April f-31 if f > 31)
```

Where `m` and `q` are century-specific parameters:

| Years | m | q |
|-------|---|---|
| 1900-2099 | 24 | 5 |
| 2100-2199 | 24 | 6 |

## Moveable Feasts

| Feast | Calculation |
|-------|-------------|
| Easter | Computus algorithm |
| Ash Wednesday | Easter - 46 days |
| Palm Sunday | Easter - 7 days |
| Holy Thursday | Easter - 3 days |
| Good Friday | Easter - 2 days |
| Ascension | Easter + 39 → Sunday |
| Pentecost | Easter + 49 days |
| Trinity Sunday | Easter + 56 days |
| Corpus Christi | Easter + 60 → Sunday |
| First Advent | 4th Sunday before Christmas |
| Baptism of Lord | Sunday after Epiphany |

## Liturgical Year Structure

```
First Sunday of Advent (Year N)
    │
    ├── ADVENT (4 weeks)
    │
    ├── CHRISTMAS (until Baptism of Lord)
    │
    ├── ORDINARY TIME I (until Ash Wednesday)
    │
    ├── LENT (Ash Wednesday to Easter Vigil)
    │
    ├── EASTER (Easter to Pentecost, 50 days)
    │
    └── ORDINARY TIME II (Pentecost to Advent)
        │
        └── First Sunday of Advent (Year N+1)
```

## CLEDR Integration

The `cledrId` format (`season/week/day`) can be used as event IDs:

```json
{
  "@context": "https://catholicresources.org/cledr/v1",
  "@type": "LiturgicalEvent",
  "id": "avv/01/0",
  "name": "Prima Domenica di Avvento",
  "season": "ADVENT",
  "week": 1,
  "dayOfWeek": 0,
  "titleCode": "TIT;AVV;ST01;1DOM;Y-CI"
}
```

## Liturgical Precedence (14 Levels)

The calendar implements the complete UNLY Table of Liturgical Days:

| Level | Description | Examples |
|-------|-------------|----------|
| 1 | Paschal Triduum | Holy Thursday, Good Friday, Easter Vigil |
| 2 | Nativity, Epiphany, Ascension, Pentecost; Privileged Sundays; Ash Wednesday; Holy Week; Easter Octave | Christmas, Palm Sunday, Easter Monday |
| 3 | Solemnities in General Calendar | All Saints, Immaculate Conception |
| 4 | Proper Solemnities | Patron saints, Church dedication |
| 5 | Feasts of the Lord | Transfiguration, Exaltation of Holy Cross |
| 6 | Sundays of Christmas/Ordinary Time | |
| 7 | Feasts of BVM and Saints | Assumption (if not solemnity) |
| 8 | Proper Feasts | Diocesan patron, Cathedral anniversary |
| 9 | Advent (Dec 17-24), Christmas Octave, Lent weekdays | |
| 10-14 | Memorials and weekdays | Optional memorials, ferial days |

## Rare Exceptions Tested

The test suite includes 63 tests for rare edge cases (1-2 per century):

### Annunciation Transfers (March 25 during Holy Week)
| Year | Situation | Result |
|------|-----------|--------|
| 2016 | Good Friday | Transferred to April 4 |
| 2018 | Palm Sunday | Transferred to April 9 |
| 2024 | Holy Monday | Transferred to April 8 |
| 2027 | Holy Thursday | Transferred to April 7 |
| 2035 | **Easter Sunday** (Kyriopascha) | Transferred |

### St. Joseph Transfers (March 19 during Holy Week)
| Year | Situation | Result |
|------|-----------|--------|
| 2008 | Holy Wednesday | Holy Week wins |
| 2035 | Holy Monday | Holy Week wins |
| 2062 | **Palm Sunday** | Palm Sunday wins |

### Immaculate Conception on Advent Sunday
Years 2019, 2024, 2030: Transferred to December 9

### Extreme Easter Dates
- **Earliest**: March 22 (2285) - rarest possible
- **Latest**: April 25 (1943, 2038) - 95 years apart

### Saints Outside Normal Season
- **Perpetua & Felicity** (Mar 7) outside Lent: 2011, 2038 (Easter very late)
- **St. Patrick** (Mar 17) on Lenten Sunday: 2024, 2030

## Test Coverage

```bash
npm test
# 375 tests passing
```

Test files:
- `computus.test.ts` - Easter computation (1900-2100)
- `fragments.test.ts` - Fragment generation
- `validation.test.ts` - Calendar validation
- `precedence.test.ts` - Precedence rules
- `rare-exceptions.test.ts` - Rare edge cases (63 tests)
- `external-validation.test.ts` - Cross-validation with external APIs (67 tests)

### External Validation Sources
- [Church Calendar API](http://calapi.inadiutorium.cz/) - Real-time validation against calendarium-romanum
- [CEI Liturgia del Giorno](https://www.chiesacattolica.it/liturgia-del-giorno/) - Conferenza Episcopale Italiana
- [USCCB 2024 Calendar](https://www.usccb.org/resources/2024cal.pdf) - Official US bishops calendar
- [USCCB 2025 Calendar](https://www.usccb.org/resources/2025cal.pdf) - Official US bishops calendar

## Sources

- Original code: ePrex Calendar System by Marco Del Pin
- [GIRM - General Instruction of the Roman Missal](https://www.vatican.va/roman_curia/congregations/ccdds/documents/rc_con_ccdds_doc_20030317_ordinamento-messale_en.html)
- [Mysterii Paschalis - Motu Proprio (1969)](https://www.vatican.va/content/paul-vi/la/motu_proprio/documents/hf_p-vi_motu-proprio_19690214_mysterii-paschalis.html) - Vatican official document
- [Universal Norms for the Liturgical Year (UNLY)](https://www.catholicculture.org/culture/library/view.cfm?id=10842) - Full English text
- [GNLY PDF](https://www.liturgyoffice.org.uk/Calendar/Info/GNLY.pdf) - PDF version with Table of Precedence
- [Romcal](https://github.com/romcal/romcal) - Open source liturgical calendar library
- [Maranatha.it](https://www.maranatha.it) - Italian liturgical resources

## License

Original ePrex code: Copyright (c) 2014-2024 Marco Del Pin. All Rights Reserved.
This simplified extraction for CLEDR is for reference and integration within CatholicOS.
