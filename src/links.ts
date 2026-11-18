import { books } from './canon.ts';
import { verseCounts } from './verse-counts.ts';

export type Passage = { book: string; chapter: number; start: number; end: number };
export const themes = ['Lei e deserto', 'Promessa e fé', 'Jesus e os profetas', 'Paixão e ressurreição', 'Espírito e missão', 'Aliança'] as const;
export type Theme = typeof themes[number];
export type Connection = { id: string; from: Passage; to: Passage; theme: Theme; note: string };

const rows: [string, string, Theme, string][] = [
  ['MT.4.4','DT.8.3','Lei e deserto','A primeira resposta de Jesus retoma a instrução sobre alimento e dependência de Deus.'],
  ['LC.4.4','DT.8.3','Lei e deserto','A resposta ao pedido de transformar pedra em pão retoma Deuteronômio.'],
  ['MT.4.7','DT.6.16','Lei e deserto','Jesus responde à segunda tentação com a proibição de pôr o Senhor à prova.'],
  ['LC.4.12','DT.6.16','Lei e deserto','Na versão de Lucas, a resposta encerra a sequência de tentações.'],
  ['MT.4.10','DT.6.13','Lei e deserto','A última resposta de Jesus retoma o chamado a servir exclusivamente ao Senhor.'],
  ['LC.4.8','DT.6.13','Lei e deserto','A resposta à proposta de receber os reinos do mundo aponta para o serviço ao Senhor.'],
  ['MT.4.6','SL.91.11-12','Lei e deserto','Na narrativa, o tentador usa a promessa de proteção contida no salmo.'],
  ['LC.4.10-11','SL.91.11-12','Lei e deserto','Lucas reúne dois versos da promessa de proteção que aparece na fala do tentador.'],
  ['RM.4.3','GN.15.6','Promessa e fé','Paulo recorre ao relato de Abraão para desenvolver seu argumento sobre justiça e fé.'],
  ['GL.3.6','GN.15.6','Promessa e fé','Paulo cita a declaração sobre a fé de Abraão.'],
  ['TG.2.23','GN.15.6','Promessa e fé','Tiago cita a declaração sobre Abraão no argumento acerca de fé e obras.'],
  ['GL.3.8','GN.12.3','Promessa e fé','O argumento de Gálatas relaciona a bênção de Abraão às nações.'],
  ['HB.11.17-19','GN.22.1-14','Promessa e fé','Hebreus relembra a oferta de Isaque na exposição sobre fé.'],
  ['MT.3.3','IS.40.3','Jesus e os profetas','Mateus apresenta a voz profética na descrição do ministério de João Batista.'],
  ['MC.1.3','IS.40.3','Jesus e os profetas','Marcos incorpora Isaías na abertura que apresenta a preparação do caminho.'],
  ['LC.3.4-6','IS.40.3-5','Jesus e os profetas','Lucas amplia a passagem citada para destacar a preparação do caminho e a salvação.'],
  ['JO.1.23','IS.40.3','Jesus e os profetas','A voz do deserto aparece na resposta de João Batista à pergunta sobre sua identidade.'],
  ['MT.21.4-5','ZC.9.9','Jesus e os profetas','A figura do rei montado em jumento aparece no relato da entrada em Jerusalém.'],
  ['JO.12.14-15','ZC.9.9','Jesus e os profetas','João vincula a entrada em Jerusalém à imagem do rei em Zacarias.'],
  ['LC.4.18-19','IS.61.1-2','Jesus e os profetas','A leitura na sinagoga de Nazaré retoma o anúncio de Isaías.'],
  ['JO.19.24','SL.22.18','Paixão e ressurreição','O evangelista liga a repartição das vestes à linguagem do salmo.'],
  ['MT.27.46','SL.22.1','Paixão e ressurreição','O clamor de Jesus na cruz retoma a abertura do Salmo 22.'],
  ['AT.2.25-28','SL.16.8-11','Paixão e ressurreição','Pedro usa o salmo no argumento sobre a ressurreição.'],
  ['MT.22.31-32','EX.3.6','Paixão e ressurreição','Jesus recorre à cena da sarça quando discute a ressurreição.'],
  ['AT.2.16-21','JL.2.28-32','Espírito e missão','Pedro interpreta o Pentecostes por meio do anúncio de Joel sobre o Espírito.'],
  ['AT.13.47','IS.49.6','Espírito e missão','Paulo e Barnabé recorrem ao anúncio de luz para as nações.'],
  ['AT.8.32-35','IS.53.7-8','Espírito e missão','Filipe começa sua explicação com o trecho de Isaías que o viajante estava lendo.'],
  ['HB.8.8-12','JR.31.31-34','Aliança','Hebreus cita a promessa de uma nova aliança anunciada por Jeremias.'],
  ['HB.10.16-17','JR.31.33-34','Aliança','A carta retoma a instrução interior e o perdão para desenvolver o argumento sobre a aliança.'],
];

function fromCode(value: string): Passage {
  const [book, rawChapter, verses] = value.split('.');
  const [start, end = start] = verses.split('-').map(Number);
  return { book, chapter: Number(rawChapter), start, end };
}

const titles = new Map<string, string>(books.map(book => [book.code, book.name]));
export const connections: Connection[] = rows.map(([from, to, theme, note], index) => ({
  id: String(index + 1), from: fromCode(from), to: fromCode(to), theme, note,
}));

export function validate(passage: Passage) {
  const max = verseCounts[passage.book]?.[passage.chapter - 1];
  if (!Number.isInteger(passage.chapter) || !max) return 'Capítulo inexistente para este livro.';
  if (!Number.isInteger(passage.start) || !Number.isInteger(passage.end) || passage.start < 1 ||
    passage.end < passage.start || passage.end > max) return 'Escolha um versículo de 1 a ' + max + '.';
  return '';
}

function isSavedPassage(value: unknown): value is Passage {
  if (!value || typeof value !== 'object') return false;
  const passage = value as Passage;
  return typeof passage.book === 'string' && titles.has(passage.book) && validate(passage) === '';
}

export function parseSavedPassages(raw: string): Passage[] {
  const items: unknown = JSON.parse(raw);
  if (!Array.isArray(items) || !items.every(isSavedPassage)) {
    throw new Error('Formato inválido das referências salvas.');
  }
  return items;
}

export function label(passage: Passage) {
  return titles.get(passage.book) + ' ' + passage.chapter + ':' + passage.start +
    (passage.start < passage.end ? '–' + passage.end : '');
}
export const key = (passage: Passage) => [passage.book, passage.chapter, passage.start, passage.end].join('.');
const overlaps = (a: Passage, b: Passage) =>
  a.book === b.book && a.chapter === b.chapter && a.start <= b.end && b.start <= a.end;

export function related(passage: Passage, theme: string) {
  return connections.filter(link => !theme || link.theme === theme).flatMap(link => {
    if (overlaps(link.from, passage)) return [{ connection: link, other: link.to }];
    if (overlaps(link.to, passage)) return [{ connection: link, other: link.from }];
    return [];
  });
}

export function sourceLink(link: Connection) {
  return 'https://www.biblegateway.com/passage/?search=' + encodeURIComponent(label(link.from) + '; ' + label(link.to));
}

export function exportLinks(passage: Passage, rows: ReturnType<typeof related>): string {
  return '# Referências de ' + label(passage) + '\n\n' + rows.map(({ connection, other }) =>
    '- ' + label(other) + ' · ' + connection.theme + '. ' + connection.note + ' [Comparar textos](' + sourceLink(connection) + ')',
  ).join('\n') + '\n';
}
