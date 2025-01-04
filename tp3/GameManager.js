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
    await this.modelLoader.loadModels();
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
      case 'SELECT NAME':
        this.selectName();
        break;
      default:
        console.warn(`Unhandled menu item: ${menuId}`);
    }
  }

  selectName() {
    this.initialMenu.removeEventListeners();
  
    const overlayDiv = document.createElement('div');
    overlayDiv.id = 'nameOverlay';
    overlayDiv.style.position = 'absolute';
    overlayDiv.style.top = '0';
    overlayDiv.style.left = '0';
    overlayDiv.style.width = '100%';
    overlayDiv.style.height = '100%';
    overlayDiv.style.display = 'flex';
    overlayDiv.style.alignItems = 'center';
    overlayDiv.style.justifyContent = 'center';
    overlayDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; 
    
    const containerDiv = document.createElement('div');
    containerDiv.style.display = 'flex';
    containerDiv.style.flexDirection = 'column';
    containerDiv.style.alignItems = 'center';
    containerDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'; 
    containerDiv.style.padding = '10px';
    containerDiv.style.borderRadius = '8px';
  
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = '';
    nameInput.style.fontSize = '16px';
    nameInput.style.padding = '8px';
    nameInput.style.borderRadius = '4px';
    nameInput.style.border = '1px solid #ccc';
    nameInput.style.outline = 'none';
  
    nameInput.focus();
  
    const confirmName = () => {
      const nome = nameInput.value.trim();
      if (nome) {
        this.player.name = nome;
        console.log("Nome do jogador definido para: " + this.player.name);
      } else {
        console.log("Nenhum nome foi definido");
      }
  
      document.body.removeChild(overlayDiv);
  
      this.initialMenu.addEventListeners();
    };
  
    nameInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        confirmName();
      }
    });
  
    containerDiv.appendChild(nameInput);
    overlayDiv.appendChild(containerDiv);
    document.body.appendChild(overlayDiv);
  }
  
  
  

  startGame() {
    
    this.player.choosenBalloon = this.initialMenu.getPlayerModelUrl();
    this.autonomousBalloon.choosenBalloon = this.initialMenu.getBotModelUrl();
    
    if (!this.player.name || this.player.name.trim() === "") {
      // Você pode usar alert, modal, console log etc.
      alert("Por favor, selecione o seu nome antes de iniciar o jogo!");
      return;
    }
    
    console.log("Iniciando o jogo...");
    // Remove o menu inicial da cena
    //this.initialMenu.removeMenu();

    // Muda o estado do jogo
    //this.gameState = GAME_STATES.RUNNING;

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
