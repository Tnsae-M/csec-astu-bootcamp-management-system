/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Provider } from 'react-redux';
import { store } from './app/store';
import { TooltipProvider } from './components/ui/tooltip';
import AppRouter from './routes/AppRouter';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <Provider store={store}>
      <TooltipProvider>
        <AppRouter />
        <Toaster richColors position="top-right" />
      </TooltipProvider>
    </Provider>
  );
}
