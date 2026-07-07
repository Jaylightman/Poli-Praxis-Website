# Poli Praxis — Website

Website des Medizinischen Versorgungszentrums (MVZ) **Poli Praxis** — Medizin von Mensch zu Mensch, an drei Standorten in München und Augsburg.

**Live:** https://jaylightman.github.io/Poli-Praxis-Website/

## Seiten

| Seite | Beschreibung |
|---|---|
| [index.html](index.html) | Startseite mit Standort-Übersicht, Ärzte-Highlights und Kontakt |
| [aerzte.html](aerzte.html) | Alle Ärztinnen und Ärzte, filterbar nach Standort |
| [standorte.html](standorte.html) | Übersicht der drei Standorte |
| [standort-muenchen-mitte.html](standort-muenchen-mitte.html) | Poli-Praxis München Mitte (Herzog-Wilhelm-Str. 17) |
| [standort-muenchen-nord.html](standort-muenchen-nord.html) | Poli-Praxis München Nord (Wundtstr. 15) |
| [standort-augsburg.html](standort-augsburg.html) | Poli-Praxis Augsburg |
| [fachrichtungen.html](fachrichtungen.html) | Übersicht der Fachrichtungen |
| [inuspherese.html](inuspherese.html) | INUSpherese®-Therapie (exklusiv in München Mitte) |
| [impressum.html](impressum.html) / [datenschutz.html](datenschutz.html) | Rechtliches |

## Technik

Statische Website ohne Build-Schritt — reines HTML, CSS und Vanilla-JavaScript.

```
├── *.html              Seiten
├── assets/
│   ├── css/styles.css  Zentrales Stylesheet
│   ├── js/main.js      Interaktionen (Filter, Navigation)
│   └── img/            Logo, Standort-Illustrationen, Fotos
└── design-system/      Design-Dokumentation
```

## Entwicklung

Kein Setup nötig — Repository klonen und `index.html` im Browser öffnen, oder einen lokalen Server starten:

```bash
python -m http.server 8000
# → http://localhost:8000
```

## Deployment

Die Seite wird über **GitHub Pages** direkt aus dem `main`-Branch ausgeliefert. Jeder Push auf `main` geht automatisch nach wenigen Minuten live.
