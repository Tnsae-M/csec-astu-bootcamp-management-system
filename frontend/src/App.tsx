/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Provider } from 'react-redux';
import { store } from './app/store';
import AppRouter from './routes/AppRouter';

export default function App() {
  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
}
