# Engenharia reversa e estudo — Referências cruzadas bíblicas

## Objetivo e fluxo

Navegação por referências cruzadas e grafo de passagens. links.ts valida os códigos de passagem e consulta as relações. canon.ts e verse-counts.ts sustentam os limites e storage.ts guarda o estado local.

**Tecnologias identificadas** · TypeScript, React, Vite, Node.js.

**Revisão de referência** · `95c16c92bde4`.

## Mapa do código

| Caminho | Papel de leitura | Símbolos selecionados |
| --- | --- | --- |
| [src/App.tsx](../src/App.tsx) | Implementação | `App`, `open` |
| [src/canon.ts](../src/canon.ts) | Implementação | — |
| [src/download.ts](../src/download.ts) | Implementação | `download` |
| [src/links.ts](../src/links.ts) | Implementação | `fromCode`, `validate`, `isSavedPassage`, `parseSavedPassages`, `label`, `related`, `sourceLink`, `exportLinks`, `key` |
| [src/main.tsx](../src/main.tsx) | Ponto de leitura para entrada ou composição | — |
| [src/storage.ts](../src/storage.ts) | Implementação | `useLocalState` |
| [src/verse-counts.ts](../src/verse-counts.ts) | Implementação | — |
| [vite.config.ts](../vite.config.ts) | Implementação | — |
| [index.html](../index.html) | Marcação ou estilos da interface | — |
| [src/style.css](../src/style.css) | Marcação ou estilos da interface | — |

## Configuração e referências

Ambiente e dependências: [package.json](../package.json).

## Roteiro de estudo e desenvolvimento

1. Comece pelo fluxo descrito acima e localize seus pontos de entrada no mapa. Acompanhe uma entrada válida até a transformação ou a resposta.
2. Abra um teste relacionado ao fluxo e descreva qual regra ele protege. Compare o tratamento esperado para entradas válidas, inválidas e nos limites.
3. Ao adicionar uma regra, determine qual módulo controla o dado e cubra o caso nesse nível. Em seguida, confira o efeito no comando, na API ou na interface de entrada.

**Pergunta de entrevista**

Como evitar que uma referência para um capítulo ou versículo inexistente seja adicionada ao grafo?

## Testes versionados

Arquivos para começar a leitura dos cenários de teste: [tests/links.test.ts](../tests/links.test.ts).

Os comandos e versões de runtime usados no CI ficam em [.github/workflows/ci.yml](../.github/workflows/ci.yml).

[Voltar ao README](../README.md).
