import assert from 'node:assert/strict';
import { test } from 'node:test';
import { books } from '../src/canon.ts';
import { connections, exportLinks, label, parseSavedPassages, related, sourceLink, validate } from '../src/links.ts';
import { verseCounts } from '../src/verse-counts.ts';

test('carrega referências válidas e rejeita listas com registros inválidos', () => {
  const entry = connections[0].from;
  assert.deepEqual(parseSavedPassages(JSON.stringify([entry])), [entry]);
  assert.throws(() => parseSavedPassages('null'), /Formato inválido/);
  assert.throws(() => parseSavedPassages(JSON.stringify([entry, { ...entry, chapter: 500 }])), /Formato inválido/);
});

test('numeração cobre os 66 livros e confirma cada contagem de capítulos', () => {
  assert.equal(Object.keys(verseCounts).length, 66);
  for (const book of books) assert.equal(verseCounts[book.code].length, book.chapters);
});
test('rejeita capítulo, versículo e faixa inválidos', () => {
  assert.match(validate({ book: 'MT', chapter: 29, start: 1, end: 1 }), /Capítulo/);
  assert.match(validate({ book: 'JO', chapter: 15, start: 28, end: 28 }), /versículo/);
  assert.match(validate({ book: 'JO', chapter: 15, start: 0, end: 1 }), /versículo/);
  assert.match(validate({ book: 'JO', chapter: 15, start: 3, end: 2 }), /versículo/);
});
test('conexões são navegáveis nos dois sentidos e reconhecem versos dentro de faixas', () => {
  const link = connections.find(item => item.theme === 'Aliança')!;
  assert.ok(related({ ...link.to, start: 33, end: 33 }, '').some(item => item.connection.id === link.id));
  assert.ok(related(link.from, 'Aliança').some(item => item.connection.id === link.id));
  assert.deepEqual(related(link.from, 'Promessa e fé'), []);
});
test('todas as ligações apontam para versos válidos e para a comparação das duas passagens', () => {
  assert.equal(new Set(connections.map(item => item.id)).size, connections.length);
  for (const item of connections) {
    assert.equal(validate(item.from), '');
    assert.equal(validate(item.to), '');
    assert.equal(new URL(sourceLink(item)).searchParams.get('search'), label(item.from) + '; ' + label(item.to));
  }
});
test('exportação inclui referência, tema e fonte', () => {
  const passage = connections[0].from;
  assert.match(exportLinks(passage, related(passage, '')), /Mateus 4:4[\s\S]+Deuteronômio 8:3[\s\S]+Lei e deserto[\s\S]+biblegateway/);
});
