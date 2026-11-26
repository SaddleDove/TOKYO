# TOKYO

> You thought you were going to Tokyo. Tokyo was the room you were standing in.

A novel in thirty-six chapters. Six people, four hours a night, behind dryer four in a laundromat in Shibuya. A club called TOKYO opens at 23:00 and clears at 03:00. It has ninety days left. Nobody in it knows that the voice coming out of the speakers belongs to the taxi driver parked outside.

**Read it in the browser:** https://saddledove.github.io/tokyo/

---

## What this repository is

Two things, and nothing else:

- a **reader** — one page, no frameworks, no build step, no dependencies. It types the novel out at reading speed and remembers where you stopped inside a session.
- the **manuscript** — `manuscript/`, the plain markdown the reader is generated from, one file per chapter plus a single concatenated file for offline reading.

```
index.html        the reader shell
app.js            typing engine: rhythm, pacing, chapter stepping
styles.css        black page, monospace, nothing decorative
novel-data.js     generated: 36 chapters as one JS array
manuscript/       36 chapter files + TOKYO_Complete_Novel.md
```

## Controls

| key / input | does |
|---|---|
| click, space, enter | advance to the next passage once the current one has finished printing |
| `F` | toggle fast mode (roughly 16× the normal pace) |
| `←` / `→` | previous / next chapter |

The text prints at a variable rate on purpose. Short words run, sentence endings hold, paragraph breaks hold longer. If you want to read at your own speed instead, press `F`.

## On form

- One point of view per chapter. Chapter 12 is the sanctioned ensemble exception.
- Untranslated terms are deliberate, not oversights: *honne*, *tatemae*, *enryo*, *amae*, *otsukaresama*. Context carries them.
- The two lines on the wall are read in order. They were not written by the same person.
- No sexual content. Intimacy is rendered as objects, rooms, and things people name.

## Content notes

Major character death (one secondary character, aftermath handled off-page). References to self-harm scarring, disordered eating, police and immigration detention — all oblique and non-graphic.

## Reading the raw text

```bash
# whole novel, in order
cat manuscript/TOKYO_Complete_Novel.md
```

## Licence

Text © the author. All rights reserved. The reader code is free to take apart.
