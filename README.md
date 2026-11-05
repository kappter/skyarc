# Sky Arc

An interactive single-page sky journey prototype.

Explore daily altitude profiles, rise/transit/set times, time playback, latitude and longitude, and daylight shading. Includes Salt Lake City and Alaska presets.

## Run

Open `index.html` in a browser or serve this directory with a static server. No build step or dependencies are required. Browser geolocation requires HTTPS or localhost.

## GitHub Pages

Use **Deploy from a branch**, branch **main**, folder **/ (root)** in Settings → Pages.

## Prototype limitations

Planetary coordinates are illustrative samples, not ephemerides. The latitude and horizon geometry respond to location, but these values must not be used for observation planning. The gold dashed line is a modeled daily Sun path, not an ecliptic sky map. UTC offset is manually controlled; date changes do not automatically adjust daylight saving time. Rise/set labels show clock times without date offsets.

Next: accurate solar-system ephemerides, automatic time zones, dated events, true ecliptic projection, and astronomical verification.
