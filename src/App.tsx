import { useState } from 'react';
import { books } from './canon.ts';
import { download } from './download.ts';
import { connections, exportLinks, key, label, parseSavedPassages, related, sourceLink, themes, validate } from './links.ts';
import type { Passage } from './links.ts';
import { useLocalState } from './storage.ts';
import { verseCounts } from './verse-counts.ts';

export default function App() {
  const [draft, setDraft] = useState({ book: 'MT', chapter: '4', verse: '4' });
  const [current, setCurrent] = useState<Passage>(connections[0].from);
  const [theme, setTheme] = useState('');
  const [favorites, setFavorites, favoriteError] = useLocalState<Passage[]>('referencias-favoritos-v1', [], parseSavedPassages);
  const [history, setHistory, historyError] = useLocalState<Passage[]>('referencias-historico-v1', [], parseSavedPassages);
  const [issue, setIssue] = useState('');
  const rows = related(current, theme);
  const nodes = [...new Map(rows.map(({ other }) => [key(other), other])).values()];
  const book = books.find(item => item.code === draft.book)!;
  const maxVerse = verseCounts[draft.book]?.[Number(draft.chapter) - 1];
  const favorite = favorites.some(item => key(item) === key(current));
  const height = Math.max(110, nodes.length * 49 + 24);

  function open(passage: Passage) {
    setIssue('');
    setCurrent(passage);
    setDraft({ book: passage.book, chapter: String(passage.chapter), verse: String(passage.start) });
    setHistory(previous => [passage, ...previous.filter(item => key(item) !== key(passage))].slice(0, 12));
  }

  return <div className="split">
    <div className="stack">
      <section className="panel stack">
        <form className="form" onSubmit={event => {
          event.preventDefault();
          const passage = { book: draft.book, chapter: Number(draft.chapter), start: Number(draft.verse), end: Number(draft.verse) };
          const error = validate(passage);
          if (error) setIssue(error);
          else open(passage);
        }}>
          <div className="three collapse">
            <label>Livro<select value={draft.book} onChange={e => setDraft({ book: e.target.value, chapter: '1', verse: '1' })}>
              {books.map(item => <option key={item.code} value={item.code}>{item.name}</option>)}
            </select></label>
            <label>Capítulo<input type="number" min={1} max={book.chapters} required value={draft.chapter} onChange={e => setDraft({ ...draft, chapter: e.target.value, verse: '1' })} /></label>
            <label>Versículo<input type="number" min={1} max={maxVerse} required value={draft.verse} onChange={e => setDraft({ ...draft, verse: e.target.value })} /></label>
          </div>
          <button className="primary">Buscar passagem</button>
          {issue && <p role="alert" className="error">{issue}</p>}
        </form>
        <label>Tema<select value={theme} onChange={e => setTheme(e.target.value)}>
          <option value="">Todos os temas</option>{themes.map(item => <option key={item}>{item}</option>)}
        </select></label>
      </section>
      <section className="panel stack" id="passagem" tabIndex={-1}>
        <div className="row between"><h2>{label(current)}</h2>
          <button aria-pressed={favorite} onClick={() => setFavorites(previous => favorite
            ? previous.filter(item => key(item) !== key(current)) : [...previous, current])}>Favorito</button>
        </div>
        {(favoriteError || historyError) && <p role="alert" className="error">{favoriteError || historyError}</p>}
        {!rows.length && <p className="muted">A seleção inicial ainda não tem conexões para esta passagem e tema.</p>}
        {nodes.length > 0 && <div className="reference-graph" style={{ minHeight: height }} role="group" aria-label="Grafo de passagens relacionadas">
          <svg viewBox={'0 0 100 ' + height} preserveAspectRatio="none" aria-hidden="true">
            {nodes.map((item, index) => <path key={key(item)} d={'M36 ' + height / 2 + ' L65 ' + (index * 49 + 32)} />)}
          </svg>
          <strong className="graph-center">{label(current)}</strong>
          <ul className="list graph-nodes">{nodes.map(item => <li key={key(item)}><button className="selection" onClick={() => open(item)}>{label(item)}</button></li>)}</ul>
        </div>}
        <ul className="list">{rows.map(({ connection, other }) => <li className="subtle" key={connection.id}>
          <div className="row between"><button onClick={() => open(other)}>{label(other)}</button><span className="tag">{connection.theme}</span></div>
          <p>{connection.note}</p><a href={sourceLink(connection)}>Conferir as duas passagens</a>
        </li>)}</ul>
        {rows.length > 0 && <button onClick={() => download('referencias-biblicas.md', exportLinks(current, rows), 'text/markdown')}>Exportar conexões</button>}
      </section>
    </div>
    <aside className="stack">
      <section className="panel stack" id="conexoes" tabIndex={-1}>
        <h2>Conexões selecionadas</h2>
        <p className="muted">{connections.length} citações e retomadas textuais na seleção inicial.</p>
        <ul className="list">{[connections[0], connections[8], connections[24], connections[27]].map(item => <li key={item.id}>
          <button className="selection" onClick={() => { setTheme(''); open(item.from); }}>{label(item.from)} · {item.theme}</button>
        </li>)}</ul>
      </section>
      <section className="panel stack" id="favoritos" tabIndex={-1}>
        <h2>Favoritos</h2>
        {!favorites.length && <p className="muted">Salve uma passagem para voltar a ela.</p>}
        <ul className="list">{favorites.map(item => <li key={key(item)}><button className="selection" onClick={() => open(item)}>{label(item)}</button></li>)}</ul>
      </section>
      <section className="panel stack">
        <h2>Histórico de pesquisas</h2>
        {!history.length && <p className="muted">Suas buscas aparecem aqui.</p>}
        <ul className="list">{history.map(item => <li key={key(item)}><button className="selection" onClick={() => open(item)}>{label(item)}</button></li>)}</ul>
      </section>
    </aside>
  </div>;
}
