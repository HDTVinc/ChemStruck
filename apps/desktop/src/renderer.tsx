import React from 'react';
import ReactDOM from 'react-dom/client';
import { EditorHost } from '@chem/editor';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <EditorHost />
  </React.StrictMode>,
);
