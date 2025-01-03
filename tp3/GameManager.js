// GameManager.js
import { GAME_STATES } from './GameStates.js';
import { MyInitialMenu } from './MyInitialMenu.js';
import MyModelLoader from './MyModelLoader.js';

class GameManager {
  /**
   * @param {MyApp} app - Instância da aplicação principal.
   */
  constructor(app) {
    this.app = app;
    this.gameState = GAME_STATES.INITIAL;

    //Load Balloon Models
    this.modelLoader = new MyModelLoader();

    // Inicializa o menu inicial
    this.initialMenu = new MyInitialMenu(this.app.scene, this.app.activeCamera, this.modelLoader);
   
    this.initialMenu.onMenuItemSelected = this.handleMenuSelection.bind(this);

    this.player = {
      name: "",
      timestamp: 0,
      vouchers: 0,
      choosenBalloon: null,
    }

    this.autonomousBalloon = {
      choosenBalloon: null,
    }
  }

  /**
   * Inicializa o GameManager.
   */
  async init() {
    this.initialMenu.init();
  }

  /**
   * Callback quando um item de menu é selecionado.
   * @param {String} menuId 
   */
  handleMenuSelection(menuId) {
    switch (menuId) {
      case 'START GAME':
        this.startGame();
        break;
      default:
        console.warn(`Unhandled menu item: ${menuId}`);
    }
  }

  /**
   * Inicia o estado de execução do jogo.
   */
  startGame() {
    console.log("Iniciando o jogo...");

    // Remove o menu inicial da cena
    this.initialMenu.removeMenu();

    // Muda o estado do jogo
    this.gameState = GAME_STATES.RUNNING;

    /*
    
    Inicializar o jogo aqui.
    Adicionar os baloes do Player e do AutonomousBalloon
    Fazer Contagem 3,2,1
    Iniciar Contador de tempo
    3 voltas ?

    
    */
  }

  /**
   * Atualiza o GameManager a cada frame.
   * @param {Number} deltaTime - Tempo decorrido desde o último frame (em segundos).
   */
  update(deltaTime) {
    if (this.gameState === GAME_STATES.INITIAL) {
      this.initialMenu.update(deltaTime);
    } else if (this.gameState === GAME_STATES.RUNNING) {
      //TODO
    } else if (this.gameState === GAME_STATES.INITIAL) {
        this.initialMenu.update(deltaTime);
    }
  }
}

export { GameManager };
