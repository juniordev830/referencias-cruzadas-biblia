import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './style.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <a className="skip" href="#conteudo">Ir para o conteúdo</a>
    <header className="masthead">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">⌘</span>
        <span>Referências cruzadas</span>
      </div>
      <span className="collection">Coleção de estudo bíblico</span>
    </header>
    <main id="conteudo">
      <div className="intro">
        <h1>Referências cruzadas</h1>
        <nav className="atalhos" aria-label="Seções desta página">
          <a href="#passagem">Passagem atual</a>
          <a href="#conexoes">Conexões</a>
          <a href="#favoritos">Favoritos</a>
        </nav>
      </div>
      <App />
    </main>
  </StrictMode>,
);
