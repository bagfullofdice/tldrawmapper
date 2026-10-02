import React from 'react';
import { createRoot } from 'react-dom/client';
import { Tldraw } from 'tldraw';
import { getAssetUrlsByImport } from '@tldraw/assets/imports.vite';
import 'tldraw/tldraw.css';
import './board.css';
import { localBoardOptions } from './sync/local.js';
const params = new URLSearchParams(location.search);
const boardId = params.get('board') ?? 'standalone';
class BoardError extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) return <p role="alert">Party Mapper could not load. Check browser storage permissions and the console, then reopen the window.</p>;
    return this.props.children;
  }
}
createRoot(document.getElementById('root')).render(
  <BoardError><Tldraw {...localBoardOptions(boardId)}
    assetUrls={getAssetUrlsByImport()}
    onMount={editor => editor.updateInstanceState({ isReadonly: params.get('readonly') === 'true' })}
  /></BoardError>
);
