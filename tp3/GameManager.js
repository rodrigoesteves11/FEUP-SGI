// GameManager.js
import * as THREE from 'three';
import { GAME_STATES } from './GameStates.js';
import { MyInitialMenu } from './MyInitialMenu.js';
import { MyTrack } from './MyTrack.js';
import MyModelLoader from './MyModelLoader.js';
import MyBalloon  from './MyBalloon.js';
import AIBalloon from './AIBalloon.js';
import ThirdPersonBalloonCamera from './ThirdPersonBalloonCamera.js';
import FirstPersonBalloonCamera from './FirstPersonBalloonCamera.js';
import Timer from './Timer.js' 
import { MyObstacles } from './MyObstacles.js';
import { MyPowerups } from './MyPowerups.js';
import LeftSideWall from './LeftSideWall.js';


class GameManager {
  /**
   * @param {MyApp} app - Instância da aplicação principal.
   */
  constructor(app) {
    this.app = app;
    this.gameState = GAME_STATES.INITIAL;
    this.laps = 1

    // Load Balloon Models
    this.modelLoader = new MyModelLoader();

    // Inicializa o menu inicial
    this.initialMenu = new MyInitialMenu(this.app.scene, this.app.activeCamera, this.modelLoader);
   
    this.initialMenu.onMenuItemSelected = this.handleMenuSelection.bind(this);

    this.player = {
      name: "",
      position: 7.5,
      timer: new Timer(),
      vouchers: 0,
      choosenBalloon: null,
      laps: 0,
    }

    this.autonomousBalloon = {
      choosenBalloon: null,
      position: -7.5,
      timer: new Timer(),
      laps: 0,
    }

    // Inicializa a track
    this.track = new MyTrack(this.app.scene);

    this.windOverlayCreated = false;

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


    this.currentObstacleCollisions = new Set();
    this.balloonCollisionProcessed = false;

    this.leftwall = new LeftSideWall(this.app.scene, this.player.name);
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
      case 'STARTING POS':
        console.log("Starting position");
        this.startingPos();
        break;
      default:
        console.warn(`Unhandled menu item: ${menuId}`);
    }
  }

  startingPos() {
    this.initialMenu.removeEventListeners();

    const overlayDiv = document.createElement('div');
    Object.assign(overlayDiv.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    });

    const containerDiv = document.createElement('div');
    Object.assign(containerDiv.style, {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: '20px',
        borderRadius: '8px'
    });

    const instructionText = document.createElement('p');
    instructionText.textContent = 'Select your initial position:';
    Object.assign(instructionText.style, {
        marginBottom: '20px',
        fontSize: '18px',
        color: '#333',
        fontFamily: 'Arial, sans-serif'
    });

    const buttonA = document.createElement('button');
    buttonA.textContent = 'A';
    Object.assign(buttonA.style, {
        margin: '5px',
        padding: '10px 20px',
        fontSize: '16px',
        border: 'none',
        borderRadius: '5px',
        backgroundColor: '#4CAF50',
        color: '#fff',
        cursor: 'pointer'
    });

    const buttonB = document.createElement('button');
    buttonB.textContent = 'B';
    Object.assign(buttonB.style, {
        margin: '5px',
        padding: '10px 20px',
        fontSize: '16px',
        border: 'none',
        borderRadius: '5px',
        backgroundColor: '#2196F3',
        color: '#fff',
        cursor: 'pointer'
    });

    buttonA.addEventListener('click', () => {
        this.player.position = 7.5;
        this.autonomousBalloon.position = -7.5;
        document.body.removeChild(overlayDiv);
        this.initialMenu.addEventListeners();
    });

    buttonB.addEventListener('click', () => {
        this.player.position = -7.5;
        this.autonomousBalloon.position = 7.5;
        document.body.removeChild(overlayDiv);
        this.initialMenu.addEventListeners();
    });

    containerDiv.appendChild(instructionText);
    containerDiv.appendChild(buttonA);
    containerDiv.appendChild(buttonB);
    overlayDiv.appendChild(containerDiv);
    document.body.appendChild(overlayDiv);
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
        this.leftwall.changeName(this.player.name);
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

    this.balloon = new MyBalloon(this.app.scene, this.modelLoader, this.player.choosenBalloon, this.player.position);
    
    this.botBalloon = new AIBalloon(this.app.scene, this.modelLoader, this.autonomousBalloon.choosenBalloon, this.autonomousBalloon.position, this.track);

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

    if(!this.hudElement){
      this.createHUD();
    }
    
    
    this.app.initMiniMap();
    //console.log(minimap)

    this.hudElement.style.display = 'block';
    this.player.timer.start();
    this.autonomousBalloon.timer.start();
    this.botBalloon.startMovement();
    this.initGameKeyListeners();
    this.displayWind();
  }

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

  exitGame() {
    console.log("Exiting game...");

    delete this.app.cameras['ThirdPersonCamera'];
    delete this.app.cameras['FirstPersonCamera'];
    this.windOverlay.style.display = 'none';
    this.hudElement.style.display = 'none';
    this.app.miniMap.style.display = 'none';
    this.app.setActiveCamera('Menu');


    
    document.removeEventListener('keydown', this.gameKeyDownHandler);

    if (this.balloon && this.botBalloon) {
      this.balloon.dispose(); 
      this.balloon = null;
      this.botBalloon.dispose();
      this.botBalloon = null;
    }
    this.player.timer.reset();
    this.autonomousBalloon.timer.reset();

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
  
  displayWind() {
    if (!this.windOverlayCreated) {
      this.windOverlay = document.createElement('div');
      this.windOverlay.id = 'windOverlay';
      Object.assign(this.windOverlay.style, {
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'none', 
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        padding: '10px 20px',
        borderRadius: '8px',
        zIndex: '1000'
      });

      this.windImage = document.createElement('img');
      this.windImage.src = 'image/wind.png'; 
      Object.assign(this.windImage.style, {
        width: '50px',
        height: '50px',
        transition: 'transform 0.5s ease'
      });

      this.windLetter = document.createElement('span');
      Object.assign(this.windLetter.style, {
        marginLeft: '10px',
        fontSize: '24px',
        color: '#ffffff',
        fontWeight: 'bold',
        fontFamily: 'Arial, sans-serif'
      });

      this.windOverlay.appendChild(this.windImage);
      this.windOverlay.appendChild(this.windLetter);

      
      document.body.appendChild(this.windOverlay);

      this.windOverlayCreated = true;
    }

    const windDir = this.balloon.getCurrentWindDir();

    if (windDir.x === 0 && windDir.y === 0 && windDir.z === 0) {
      this.windOverlay.style.display = 'none';
      return;
    }

    let angle = 0;
    let letter = '';

    if (windDir.equals(new THREE.Vector3(0, 0, 10))) { 
      angle = -90;
      letter = 'N';
    } else if (windDir.equals(new THREE.Vector3(0, 0, -10))) { 
      angle = 90;
      letter = 'S';
    } else if (windDir.equals(new THREE.Vector3(10, 0, 0))) { 
      angle = 180;
      letter = 'W';
    } else if (windDir.equals(new THREE.Vector3(-10, 0, 0))) { 
      angle = 0;
      letter = 'E';
    } else {
      this.windOverlay.style.display = 'none';
      return;
    }

    this.windImage.style.transform = `rotate(${angle}deg)`;
    this.windLetter.textContent = letter;
    this.windOverlay.style.display = 'flex';
  }
  

  checkLapCompletion() {
    const trackSegment = {
      start: new THREE.Vector3(-15, 0, -1),
      end: new THREE.Vector3(15, 0, -1),
      epsilon: 0.5
    };

    const checkpointSegment = {
      start: new THREE.Vector3(55, 0, 20),
      end: new THREE.Vector3(25, 0, 20),
      epsilon: 0.5
    };

    const hasCrossedSegment = (pos, seg) => {
      if (Math.abs(pos.z - seg.start.z) > seg.epsilon) return false;
      const [minX, maxX] = [Math.min(seg.start.x, seg.end.x), Math.max(seg.start.x, seg.end.x)];
      return pos.x >= minX && pos.x <= maxX;
    };

    const checkBalloonCross = (balloon, checkpointFlag, lapFlag, balloonData) => {
      if (!balloon) return;

      const position = balloon.Position;

      if (hasCrossedSegment(position, checkpointSegment)) {
        //console.log("Passou checkpoint")
        this[checkpointFlag] = true;
      }

      if (hasCrossedSegment(position, trackSegment)) {
        if (this[checkpointFlag] && !this[lapFlag]) {
          balloonData.laps++;
          this[lapFlag] = true;
          this[checkpointFlag] = false;
          if(balloonData.laps == this.laps){
            return;
          }
          balloonData.timer.startNewLap();

          
        }
      } else {
        this[lapFlag] = false; 
      }
    };

    checkBalloonCross(this.balloon, "playerCheckpointCrossed", "playerLapCrossed", this.player);
    checkBalloonCross(this.botBalloon, "botCheckpointCrossed", "botLapCrossed", this.autonomousBalloon);
  }

  endGame() {
    this.windOverlay.style.display = 'none';
    this.app.setActiveCamera('Menu');
    document.removeEventListener('keydown', this.gameKeyDownHandler);
    this.hudElement.style.display = 'none';
    this.app.miniMap.style.display = 'none';
  
    const playerTotalTime = this.player.timer.getTotalTime();
    const botTotalTime = this.autonomousBalloon.timer.getTotalTime();
  
    const playerBestLap = this.player.timer.getBestLapTime();
    const botBestLap = this.autonomousBalloon.timer.getBestLapTime();
  
    const winner = playerTotalTime < botTotalTime ? this.player.name : 'Bot';
  
    const resultsOverlay = document.createElement('div');
    Object.assign(resultsOverlay.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0)',
      zIndex: '1000'
    });
  
    const resultsContent = document.createElement('div');
    Object.assign(resultsContent.style, {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      padding: '40px',
      borderRadius: '15px',
      border: '1px solid #ccc',
      textAlign: 'center'
    });
  
    const winnerText = document.createElement('h2');
    winnerText.textContent = `🏆 Winner: ${winner}`;
    Object.assign(winnerText.style, {
      marginBottom: '20px',
      color: '#4CAF50',
      fontFamily: 'Arial, sans-serif'
    });
  
    const playerStats = document.createElement('p');
    playerStats.innerHTML = `<strong>${this.player.name}</strong><br>Total Time: <strong>${this.player.timer.formatTime(playerTotalTime)}s</strong><br>Best Lap: <strong>${this.player.timer.formatTime(playerBestLap)}s</strong>`;
    Object.assign(playerStats.style, {
      marginBottom: '10px',
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif'
    });
  
    const botStats = document.createElement('p');
    botStats.innerHTML = `<strong>Bot</strong><br>Total Time: <strong>${this.autonomousBalloon.timer.formatTime(botTotalTime)}s</strong><br>Best Lap: <strong>${this.autonomousBalloon.timer.formatTime(botBestLap)}s</strong>`;
    Object.assign(botStats.style, {
      marginBottom: '20px',
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif'
    });
  
    const continueText = document.createElement('p');
    continueText.textContent = 'Press SPACE to continue...';
    Object.assign(continueText.style, {
      marginTop: '20px',
      fontSize: '14px',
      color: '#555',
      fontStyle: 'italic',
      fontFamily: 'Arial, sans-serif'
    });
  
    resultsContent.appendChild(winnerText);
    resultsContent.appendChild(playerStats);
    resultsContent.appendChild(botStats);
    resultsContent.appendChild(continueText);
  
    resultsOverlay.appendChild(resultsContent);
    document.body.appendChild(resultsOverlay);
  
    const handleKeyPress = (event) => {
      if (event.code === 'Space') {
        document.body.removeChild(resultsOverlay);
        document.removeEventListener('keydown', handleKeyPress);
  
        delete this.app.cameras['ThirdPersonCamera'];
        delete this.app.cameras['FirstPersonCamera'];
  
        if (this.balloon && this.botBalloon) {
          this.balloon.dispose();
          this.balloon = null;
          this.botBalloon.dispose();
          this.botBalloon = null;
        }
        this.player.laps = 0;
        this.autonomousBalloon.laps = 0;
        this.player.timer.reset();
        this.autonomousBalloon.timer.reset();
        this.player.vouchers = 0;
        
  
        this.initialMenu.addEventListeners();
        this.gameState = GAME_STATES.INITIAL;
      }
    };
  
    document.addEventListener('keydown', handleKeyPress);
  }
  

  displayWarning() {
    let warningElement = document.getElementById('warningMessage');
    if (!warningElement) {
      warningElement = document.createElement('div');
      warningElement.id = 'warningMessage';
      Object.assign(warningElement.style, {
        position: 'absolute',
        top: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '10px 10px',
        backgroundColor: 'rgba(255, 0, 0, 0.5)',
        color: '#fff',
        fontSize: '20px',
        fontWeight: 'bold',
        zIndex: '1000',
        borderRadius: '5px',
        display: 'none',
        fontFamily: 'Arial, sans-serif'
      });
      document.body.appendChild(warningElement);
    }
    warningElement.textContent = '1s penalty!';
    warningElement.style.display = 'block';

    setTimeout(() => {
      warningElement.style.display = 'none';
    }, 1000);
  }

  resetBalloonIfOffTrack() {
    if (!this.balloon || !this.track) return;

    const trackWidth = this.track.width;
    const balloonPos = this.balloon.Position;
    const path = this.track.path;

    const divisions = 1000;
    let minDist = Infinity;
    let nearestPoint = new THREE.Vector3();

    for (let i = 0; i <= divisions; i++) {
      const t = i / divisions;
      const point = path.getPointAt(t);
      const dist = balloonPos.distanceTo(point);
      if (dist < minDist) {
        minDist = dist;
        nearestPoint.copy(point);
      }
    }

    if (minDist > trackWidth + 2) {
      this.displayWarning();
      this.applyPenalty(this.balloon, nearestPoint);
    }
  }

  checkCollisions() {
    if (!this.balloon || !this.botBalloon) return;

    if (this.balloon.boundingBox.intersectsBox(this.botBalloon.boundingBox)) {
      if (!this.balloonCollisionProcessed) {

          const botPosition = this.botBalloon.Position.clone();
          botPosition.x += 0.5; 
          botPosition.z += 0.5; 
          this.applyPenalty(this.balloon, botPosition);

          this.balloonCollisionProcessed = true; 
      }
  } else {
      this.balloonCollisionProcessed = false;
  }

    for (let i = this.powerups.powerups.length - 1; i >= 0; i--) {
        const powerupSphere = this.powerups.boundingSpheres[i];
        if (this.balloon.boundingBox.intersectsSphere(powerupSphere)) {
            this.player.vouchers = (this.player.vouchers || 0) + 1;
            this.app.scene.remove(this.powerups.powerups[i]);
            this.powerups.powerups.splice(i, 1);
            this.powerups.boundingSpheres.splice(i, 1);
        }
    }

    for (let i = this.obstacles.obstacles.length - 1; i >= 0; i--) {
        const obstacleSphere = this.obstacles.boundingSpheres[i];
        if (this.balloon.boundingBox.intersectsSphere(obstacleSphere)) {
            if (!this.currentObstacleCollisions.has(i)) {
                this.currentObstacleCollisions.add(i);

                if (this.player.vouchers > 0) {
                    this.player.vouchers--;
                } else {
                    const obstacleObj = this.obstacles.obstacles[i];
                    const obstaclePos = obstacleObj.position.clone();

                    this.app.scene.remove(obstacleObj);
                    this.obstacles.obstacles.splice(i, 1);
                    this.obstacles.boundingSpheres.splice(i, 1);

                    this.applyPenalty(this.balloon, obstaclePos);
                }
            }
        } else {
            if (this.currentObstacleCollisions.has(i)) {
                this.currentObstacleCollisions.delete(i);
            }
        }
    }
  }

  
  applyPenalty(balloon, nearestPoint) {
    if (!balloon) return;

    this.displayWarning();

    balloon.removeKeyboard();

    balloon.mesh.position.set(
      nearestPoint.x,
      balloon.layerBases[0],
      nearestPoint.z
    );
    balloon.targetLayer = 0;

    setTimeout(() => {
      balloon.initKeyboard();
    }, 1000);
  }

  createHUD() {
    if (!this.hudElement) {
      this.hudElement = document.createElement('div');
      this.hudElement.id = 'gameHUD';
      Object.assign(this.hudElement.style, {
        position: 'absolute',
        top: '10px',
        right: '10px',
        color: '#ffffff',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: '10px',
        borderRadius: '8px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '20px',
        display: 'none',
        zIndex: '1000'
      });
  
      this.hudVouchers = document.createElement('div');
      this.hudVouchers.textContent = 'Vouchers: 0';
  
      this.hudTimer = document.createElement('div');
      this.hudTimer.textContent = 'Time: 00:00:000';

      this.hudLaps = document.createElement('div');
      this.hudLaps.textContent = 'Lap: 0';
  
      this.hudElement.appendChild(this.hudVouchers);
      this.hudElement.appendChild(this.hudTimer);
      this.hudElement.appendChild(this.hudLaps);
      document.body.appendChild(this.hudElement);
    }
  }

  updateHUD() {
    if (this.hudElement && this.hudElement.style.display !== 'none') {
      this.hudVouchers.textContent = `Vouchers: ${this.player.vouchers}`;
      this.hudTimer.textContent = `Time: ${this.player.timer.formatTime(this.player.timer.getTotalTime2())}`;
      this.hudLaps.textContent = `Lap: ${this.player.laps}`;
    }
  }
  

  update(deltaTime) {
    if (this.gameState === GAME_STATES.INITIAL) {
      this.initialMenu.update(deltaTime);
    } else if (this.gameState === GAME_STATES.RUNNING) {
      if (this.balloon && this.thirdPersonCam && this.firstPersonCam) {
        this.thirdPersonCam.update(deltaTime); 
        this.firstPersonCam.update(deltaTime);
        this.balloon.update(deltaTime);
        this.botBalloon.update(deltaTime);
        this.player.timer.update();
        this.autonomousBalloon.timer.update();

      }

      if (this.activeCamera && this.cameras[this.activeCamera]) {
        this.cameras[this.activeCamera].update(deltaTime); // Update the active camera (FPC or TPC)
      }
      
      
      this.displayWind();
      this.checkLapCompletion();
      this.resetBalloonIfOffTrack();
      this.checkCollisions();
      this.updateHUD()

      if(this.autonomousBalloon.laps === this.laps){
        this.autonomousBalloon.timer.stop();
        this.botBalloon.stopMovement();
      }

      if(this.player.laps === this.laps){
        this.player.timer.stop();
        this.balloon.removeKeyboard();
        this.balloon.downOneLayer();
      }

      if(this.player.laps === this.laps && this.autonomousBalloon.laps === this.laps){
        this.endGame();
      }

    }
  }

    
}

export { GameManager };
