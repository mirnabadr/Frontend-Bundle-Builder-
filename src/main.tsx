import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import App from '@/App';
import { store } from '@store/index';
import { bundleLoaded } from '@store/slices/bundleSlice';
import { persistenceService } from '@services/persistence.service';
import { fixBottomEdgeRepaint } from '@utils/fixBottomEdgeRepaint';
import type { BundleCatalog } from '@/types/bundle.types';
import localCatalog from '@data/bundle.json';
import '@/index.css';

// Seed the store synchronously from the bundled catalog so the real content
// paints on the first frame (no loading→content swap). The API then refreshes
// it in the background (see App.tsx). A saved system, if present, is restored.
store.dispatch(
  bundleLoaded({
    catalog: localCatalog as unknown as BundleCatalog,
    restored: persistenceService.load(),
  }),
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);

// Clear the Chromium/macOS bottom-edge theme-colour strip on first paint
// (see the utility for the full explanation).
fixBottomEdgeRepaint();
