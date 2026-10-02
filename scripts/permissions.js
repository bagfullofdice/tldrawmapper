export function canOpen(user, playersAllowed) { return Boolean(user && (user.isGM || playersAllowed)); }
// Client UI policy only. Future servers must authenticate and enforce writes independently.
export function canEdit(user, playersAllowed) { return canOpen(user, playersAllowed); }
