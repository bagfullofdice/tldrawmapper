// Adapter boundary: replace this with an authenticated useSync-backed React hook.
// Do not synchronize whole snapshots over Foundry sockets: concurrent edits need conflict resolution.
export function localBoardOptions(boardId) {
  return { persistenceKey: `tldrawmapper:${boardId}` };
}
