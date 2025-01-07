// GameManager.js
import * as THREE from 'three';
import { GAME_STATES } from './GameStates.js';
import { MyInitialMenu } from './MyInitialMenu.js';
import { MyTrack } from './MyTrack.js';
import MyModelLoader from './MyModelLoader.js';
import MyBalloon  from './MyBalloon.js';
import ThirdPersonBalloonCamera from './ThirdPersonBalloonCamera.js';
import FirstPersonBalloonCamera from './FirstPersonBalloonCamera.js'; 
import { MyObstacles } from './MyObstacles.js'; // Import MyObstacles class
import { MyPowerups } from './MyPowerups.js';


class GameManager {
  /**
   * @param {MyApp} app - Instância da aplicação principal.
   */
  constructor(app) {
    this.app = app;
    this.gameState = GAME_STATES.INITIAL;

    // Load Balloon Models
    this.modelLoader = new MyModelLoader();

    // Inicializa o menu inicial
    this.initialMenu = new MyInitialMenu(this.app.scene, this.app.activeCamera, this.modelLoader);
   
    this.initialMenu.onMenuItemSelected = this.handleMenuSelection.bind(this);

    this.player = {
      name: "",
      timestamp: 0,
      vouchers: 0,
      choosenBalloon: null,
      laps: 0,
    }

    this.autonomousBalloon = {
      choosenBalloon: null,
      laps: 0,
    }

    // Inicializa a track
    this.track = new MyTrack(this.app.scene);

    // Inicializa os obstaculos
    this.obstacleCoordinates = [
      { x: 5, y: 1, z: 40 },
      { x: 20, y: 10, z: 70 },
      { x: 70, y: 5, z: 60 },
      { x: 50, y: 2, z: 25 },
      { x: 80, y: 10, z: -25 },
      { x: 20, y: 8, z: -60 },

    ];
    this.obstacles = new MyObstacles(this.obstacleCoordinates,this.app.scene);  

    // Inicializa os powerups
    this.powerupsCoordinates = [
      { x: -5, y: 1, z: 60 },
      { x: 85, y: 10, z: 30 },
      { x: 40, y: 2, z: -10 },
      { x: 60, y: 8, z: -70 },
      { x: 0, y: 10, z: -10 },

    ];
    this.powerups = new MyPowerups(this.powerupsCoordinates,this.app.scene);  
  }

  /**
   * Inicializa o GameManager.
   */
  async init() {
    await this.modelLoader.loadModels();
    this.initialMenu.init();
    this.track.init();

    // Initialize MyObstacles
    this.obstacles.generateObstacles(); // Call obstacle generation

    // Initialize MyPowerups
    this.powerups.generatePowerups(); // Call powerups generation
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
    nameInput.placeholder = 'Digite seu nome';
    nameInput.style.fontSize = '16px';
    nameInput.style.padding = '8px';
    nameInput.style.borderRadius = '4px';
    nameInput.style.border = '1px solid #ccc';
    nameInput.style.outline = 'none';
  
    nameInput.focus();
    nameInput.setAttribute('autofocus', 'autofocus');
  
    const confirmName = () => {
      const nome = nameInput.value.trim();
      if(nome){
        this.player.name = nome;
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

  async startGame() {
    
    this.player.choosenBalloon = this.initialMenu.getPlayerModelUrl();
    this.autonomousBalloon.choosenBalloon = this.initialMenu.getBotModelUrl();
    
    if (!this.player.name || this.player.name.trim() === "") {
      alert("Please select a name before starting the game.");
      return;
    }
    
    console.log("Starting game...");
  
    this.initialMenu.removeEventListeners();

    const thirdPersonCamera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    thirdPersonCamera.position.set(0, 10, -10);
    thirdPersonCamera.lookAt(0, 3, -10);

    this.balloon = new MyBalloon(this.app.scene, this.modelLoader, this.player.choosenBalloon);

    this.thirdPersonCam = new ThirdPersonBalloonCamera({
      camera: thirdPersonCamera,
      target: this.balloon
    });

    const firstPersonCamera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    
    this.firstPersonCam = new FirstPersonBalloonCamera({
      camera: firstPersonCamera,
      target: this.balloon
    });


    this.app.cameras['ThirdPersonCamera'] = thirdPersonCamera;
    this.app.cameras['FirstPersonCamera'] = firstPersonCamera;

    this.app.setActiveCamera('ThirdPersonCamera');

    this.activeCamera = 'ThirdPersonCamera';

    this.cameras = {
      'ThirdPersonCamera': this.thirdPersonCam,
      'FirstPersonCamera': this.firstPersonCam
    };

    

    this.gameState = GAME_STATES.RUNNING;
    this.balloon.removeKeyboard();
    await this.countdownStart();
    this.balloon.initKeyboard();
    /*
    
    Inicializar o jogo aqui.
    Adicionar os baloes do Player e do AutonomousBalloon
    Fazer Contagem 3,2,1
    Iniciar Contador de tempo
    3 voltas ?
    

    */

    this.initGameKeyListeners();
  }

  /**
   * Inicializa os listeners de teclado para o estado do jogo.
   */
  initGameKeyListeners() {
    this.gameKeyDownHandler = (event) => {
      switch (event.code) {
        case 'KeyV':
          this.toggleCamera();
          break;
        case 'Escape':
          this.exitGame();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', this.gameKeyDownHandler);
  }
  
  toggleCamera() {
    if (this.activeCamera === 'ThirdPersonCamera') {
      this.app.setActiveCamera('FirstPersonCamera');
      this.activeCamera = 'FirstPersonCamera';
    } else {
      this.app.setActiveCamera('ThirdPersonCamera');
      this.activeCamera = 'ThirdPersonCamera';
    }
  }

  /**
   * Sai do jogo e retorna ao estado inicial.
   */
  exitGame() {
    console.log("Exiting game...");

    delete this.app.cameras['ThirdPersonCamera'];
    delete this.app.cameras['FirstPersonCamera'];

    this.app.setActiveCamera('Menu'); 

    
    document.removeEventListener('keydown', this.gameKeyDownHandler);

    if (this.balloon) {
      this.balloon.dispose(); 
      this.balloon = null;
    }

    this.initialMenu.addEventListeners();

    this.gameState = GAME_STATES.INITIAL;
  }

  countdownStart() {
    return new Promise((resolve) => {
      const countdownDiv = document.createElement('div');
      countdownDiv.id = 'countdownOverlay';
      countdownDiv.style.position = 'absolute';
      countdownDiv.style.top = '0';
      countdownDiv.style.left = '0';
      countdownDiv.style.width = '100%';
      countdownDiv.style.height = '100%';
      countdownDiv.style.display = 'flex';
      countdownDiv.style.alignItems = 'center';
      countdownDiv.style.justifyContent = 'center';
      countdownDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      countdownDiv.style.zIndex = '1000'; 
  
      const countdownImage = document.createElement('img');
      countdownImage.id = 'countdownImage';
      countdownImage.src = ''; 
      countdownImage.style.width = '200px'; 
  
      countdownDiv.appendChild(countdownImage);
      document.body.appendChild(countdownDiv);
  
      const countdownSequence = ['3.png', '2.png', '1.png', 'go.png'];
      let current = 0;
  
      if (countdownSequence.length > 0) {
        countdownImage.src = `image/${countdownSequence[current]}`;
        current++;
      }
  
      const interval = setInterval(() => {
        if (current < countdownSequence.length) {
          countdownImage.src = `image/${countdownSequence[current]}`;
          current++;
        } else {
          clearInterval(interval);
          document.body.removeChild(countdownDiv);
          resolve();
        }
      }, 1000);
    });
  }
  




  update(deltaTime) {
    if (this.gameState === GAME_STATES.INITIAL) {
      this.initialMenu.update(deltaTime);
    } else if (this.gameState === GAME_STATES.RUNNING) {
      if (this.balloon && this.thirdPersonCam && this.firstPersonCam) {
        this.thirdPersonCam.update(deltaTime); 
        this.firstPersonCam.update(deltaTime);
        this.balloon.update(deltaTime);
      }

      if (this.activeCamera && this.cameras[this.activeCamera]) {
        this.cameras[this.activeCamera].update(deltaTime);
      }
      
    }
  }

    
}

export { GameManager };
