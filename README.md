# Party Mapper

Foundry VTT v14 module scaffold hosting the tldraw SDK in an ApplicationV2 iframe. Draw, add shapes, arrows and text, and reopen the board with browser-local persistence. This MVP does **not** share edits between players.

## Build and install

Use Node 22.12+ and pnpm 11:

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm build
```

Copy the **contents of `dist/`** into your Foundry user data `Data/modules/tldrawmapper/` directory. Restart Foundry, enable Party Mapper in a v14 world, then select the map icon under Token controls. With no scene, open it from a script macro:

```js
game.modules.get('tldrawmapper').api.open();
```

The GM can disable player access in Module Settings. Boards are isolated by world and user on each Foundry origin; IndexedDB stores drawings and imported assets in each browser. Clearing site storage deletes local maps. These boards are not backed up with the Foundry world. tldraw's native file menu can save/export drawings.

## Architecture and next steps

- `scripts/module.js`: Foundry lifecycle, toolbar, settings and window. Closing the iframe tears down the React editor; reopening restores IndexedDB data.
- `scripts/permissions.js`: client access policy, separated for future roles. It is not a security boundary.
- `src/board.jsx`: React/tldraw editor. Bundled fonts, icons and translations are served by Foundry. The iframe isolates CSS and keyboard events.
- `src/sync/local.js`: local persistence adapter boundary. Replace this with a React hook around `@tldraw/sync` for real collaboration.

For multiplayer, provision an authenticated, self-hosted tldraw sync service with shared world/board identifiers, durable room storage and an asset upload store. Authenticate Foundry users and enforce GM/player/viewer permissions on the server, including revocation. Do not trust iframe query parameters or relay whole snapshots over module sockets: concurrent writes require conflict resolution. Add shared presence and connection status once a transport exists.

Dependencies are locked. The SDK is under the [tldraw license](https://tldraw.dev/community/license); review its production license requirements before distribution/deployment. A future production license key should be supplied via deployment configuration and passed to the editor. Foundry and SDK trademarks/assets retain their owners' licenses.

## Validation

The build and policy tests can run without Foundry. Live Foundry v14 verification is still required: open/resize/close/reopen the window; draw, type, undo, import/export; reload and check persistence; test as GM and player with access enabled/disabled; check network asset loading when Foundry is hosted under a URL prefix. No live Foundry instance is included in this repository.

Sources: [Foundry v14 toolbar hook](https://foundryvtt.com/api/functions/hookEvents.getSceneControlButtons.html), [ApplicationV2](https://foundryvtt.com/api/classes/foundry.applications.api.ApplicationV2.html), [tldraw installation/assets](https://tldraw.dev/installation), [tldraw sync](https://tldraw.dev/docs/sync).

This repository started empty. `scaffold-base` is an empty review base so the initial implementation can be proposed by PR without committing implementation files directly to `main`.
