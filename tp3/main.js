// main.js
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';


  // Cria e inicializa a aplicação
  const app = new MyApp();
  app.init();

  // Cria e inicializa o conteúdo do jogo
  const contents = new MyContents(app);
  contents.init();
  app.setContents(contents);

  // Inicia o loop de renderização (inclui GameManager)
  app.start();

