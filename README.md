# Referências cruzadas bíblicas

Busca por livro, capítulo e versículo, grafo navegável, temas, favoritos, histórico e exportação.

## Como executar

Requisitos: Node.js 24 e npm. Para a concordância, Python 3.12 também é necessário.

```bash
npm ci
npm run dev
```

Abra o endereço local informado pelo Vite. Para conferir o projeto:

```bash
npm test
npm run build
```

## Exemplo de uso

Pesquise Mateus 4:4 e explore a relação com Deuteronômio 8:3.

## Limitações

A seleção inicial contém 29 ligações. Ausência de resultado não significa que a passagem não tenha relações.

## Arquitetura e fontes

A interface usa React e TypeScript, com Vite para desenvolvimento e build. A lógica do domínio fica em módulos de `src/`, separados da interface, e os testes em `tests/`. Os dados pessoais dos recursos que exigem persistência usam armazenamento local do navegador. A concordância possui API FastAPI e índice local em `backend/`.

As fontes e licenças estão em [docs/FONTES.md](docs/FONTES.md). A licença do código está em [LICENSE](LICENSE). O fluxo em `.github/workflows/ci.yml` executa testes e build em pushes e pull requests.
