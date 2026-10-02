import { canOpen, canEdit } from './permissions.js';
const ID = 'tldrawmapper';
class PartyMapper extends foundry.applications.api.ApplicationV2 {
  static DEFAULT_OPTIONS = {
    id: 'tldrawmapper-window', classes: ['party-mapper'],
    window: { title: 'Party Map', icon: 'fa-solid fa-map', resizable: true },
    position: { width: 1000, height: 720 }
  };
  async _renderHTML() {
    const wrapper = document.createElement('div');
    const notice = document.createElement('p');
    notice.textContent = 'Local board — saved in this browser. Multiplayer is not connected yet.';
    const frame = document.createElement('iframe');
    frame.title = 'Party mapping canvas';
    const url = new URL(`modules/${ID}/board/index.html`, document.baseURI);
    url.searchParams.set('board', `world:${game.world.id}:user:${game.user.id}`);
    url.searchParams.set('readonly', String(!canEdit(game.user, game.settings.get(ID, 'allowPlayers'))));
    frame.src = url.href;
    wrapper.append(notice, frame);
    return wrapper;
  }
  _replaceHTML(result, content) { content.replaceChildren(result); }
}
let app;
function open() {
  if (!canOpen(game.user, game.settings.get(ID, 'allowPlayers'))) {
    ui.notifications.warn('The GM has disabled player access to Party Mapper.');
    return;
  }
  app ??= new PartyMapper();
  if (app.rendered) { app.bringToFront(); return app; }
  app.render({ force: true });
  return app;
}
Hooks.once('init', () => {
  game.settings.register(ID, 'allowPlayers', {
    name: 'Allow players to open Party Mapper', hint: 'Controls access to local boards. Server permissions will be required for shared boards.',
    scope: 'world', config: true, type: Boolean, default: true,
    onChange: () => { app?.close(); ui.controls?.render({ force: true }); }
  });
});
Hooks.once('ready', () => { game.modules.get(ID).api = Object.freeze({ open, PartyMapper }); });
Hooks.on('getSceneControlButtons', controls => {
  if (!controls.tokens) return;
  controls.tokens.tools.partyMapper = {
    name: 'partyMapper', title: 'Party Map', icon: 'fa-solid fa-map', button: true,
    order: Object.keys(controls.tokens.tools).length,
    visible: canOpen(game.user, game.settings.get(ID, 'allowPlayers')), onChange: open
  };
});
