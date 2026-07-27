# Standalone Runtime Fix

The black screen was caused by a missing `support.js` runtime. The HTML contained the full prototype component code, but the exported ZIP did not include the runtime required to mount that component in the browser.

## What was fixed

- Added a local standalone React runtime under `vendor/`.
- Rebuilt `support.js` to initialise and render the exported prototype.
- Added a safe runtime error screen instead of silently showing a black page.
- Added a responsive mobile-device preview wrapper.
- Kept all existing screens, interactions, images, and source assets unchanged.
- Added `OPEN_FANTASY_MMADNESS.html` as the easiest entry file.

## Run

1. Extract the ZIP completely.
2. Open `design_handoff_fantasymmadness/OPEN_FANTASY_MMADNESS.html` in Chrome or Edge.
3. Keep the `uploads`, `vendor`, `image-slot.js`, and `support.js` files beside the HTML file.

The prototype is self-contained. Internet access is only used for Google Fonts; when offline it falls back to the system sans-serif font and the app still works.
