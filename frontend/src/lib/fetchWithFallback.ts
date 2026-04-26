import api from '../api/axios';

type Getter = () => Promise<any>;
type Fallback = any | (() => any | Promise<any>);

export async function fetchWithFallback(getter: Getter, fallback: Fallback) {
  try {
    const res = await getter();
    return { data: res?.data ?? res, fromMock: false };
  } catch (err) {
    console.warn('[fetchWithFallback] backend fetch failed, using fallback mock', err?.message ?? err);
    const mock = typeof fallback === 'function' ? await fallback() : fallback;
    return { data: mock, fromMock: true, error: err };
  }
}

export default fetchWithFallback;
