import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

export function useLocalState<T>(key: string, fallback: T): [T, Dispatch<SetStateAction<T>>, string] {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  });
  const [error, setError] = useState('');
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
      setError('');
    } catch {
      setError('O navegador impediu o armazenamento. As alterações podem se perder ao fechar a página.');
    }
  }, [key, state]);
  return [state, setState, error];
}
