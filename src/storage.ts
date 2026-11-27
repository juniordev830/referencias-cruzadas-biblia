import { useEffect, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

export function useLocalState<T>(key: string, fallback: T, decode: (raw: string) => T): [T, Dispatch<SetStateAction<T>>, string] {
  const [initial] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return { value: raw === null ? fallback : decode(raw), error: '', persisted: raw !== null };
    } catch {
      return {
        value: fallback,
        error: 'Não foi possível abrir os dados locais. Os registros originais serão preservados e as alterações ficarão nesta sessão.',
      };
    }
  });
  const [state, setState] = useState(initial.value);
  const lastSaved = useRef<{ key: string; value: T } | null>(
    initial.persisted ? { key, value: initial.value } : null,
  );
  const [error, setError] = useState(initial.error);
  useEffect(() => {
    if (initial.error) return;
    if (lastSaved.current?.key === key && Object.is(lastSaved.current.value, state)) return;
    try {
      localStorage.setItem(key, JSON.stringify(state));
      lastSaved.current = { key, value: state };
      setError('');
    } catch {
      setError('O navegador impediu o armazenamento. As alterações podem se perder ao fechar a página.');
    }
  }, [key, state, initial]);
  return [state, setState, error];
}
