# Sky Arc

Interactive local sky map and daily altitude profiles. Serve this directory with any static web server, or open index.html. No build or network ephemeris service is required.

## Calculations

The Sun, Moon, and planets use the vendored MIT-licensed [Astronomy Engine](https://github.com/cosinekitty/astronomy) browser library. Observer-centered coordinates include lunar parallax and aberration. Catalog stars, constellation line figures, deep-sky objects, and personal fixed points use J2000 coordinates transformed to the observation date before projection. Background names use Astronomy Engine's IAU constellation boundaries, not astrological signs. All 88 boundary regions can be identified; only the selectable line figures are drawn.

Daily altitude curves, horizon maps, timelines, and printed reports share the same date- and location-dependent calculation. Rise/set refer to the geometric object center at zero altitude, excluding atmospheric refraction, limb radius, terrain, and elevation. Horizon crossings are bracketed at five-minute intervals and refined by bisection; extremely brief grazing crossings can be missed. Daily maximum altitude is refined near the highest sample. Event labels refer to the selected local calendar day. A crossing need not occur every day.

UTC offset is manual: check daylight saving time for your selected date. This is a direction map; an object above the horizon may still be invisible in daylight. Constellation line figures use approximate catalog coordinates and are not physical star clusters.

## Verification

Run `node test-calculations.cjs`. Checks cover the November 9, 2026 Libra new moon, UTC conversion, reference lunar coordinates, all nine objects, independent equator-of-date horizon projection, daily crossings, lunar orbital motion, inverse map projection, polar day, and observer location.

## GitHub Pages

Deploy from main, / (root). Keep app.js, style.css, sky-calculations.js, and astronomy.browser.min.js beside index.html. Astronomy Engine's license is in ASTRONOMY-LICENSE.txt.
