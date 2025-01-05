// MyApp.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GameManager } from './GameManager.js';

class MyApp {

  constructor() {
    this.scene = null;
    this.stats = null;

    this.activeCamera = null;
    this.activeCameraName = null;
    this.lastCameraName = null;
    this.cameras = [];
    this.frustumSize = 20;

    this.renderer = null;
    this.controls = null;
    this.gui = null;
    this.axis = null;
    this.contents = null;

    this.miniMap = null;
    this.miniMapRenderer = null;

    this.gameManager = null;

    this.lastFrameTime = null;
  }

  /**
   * inicializa a aplicação
   */
  init() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x101010);

    this.stats = new Stats();
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this.stats.dom);

    this.miniMap = document.getElementById('mini_map');
    this.miniMapRenderer = new THREE.WebGLRenderer();
    this.miniMapRenderer.setSize(this.miniMap.offsetWidth, this.miniMap.offsetHeight);
    this.miniMapRenderer.setSize(this.miniMap.offsetWidth, this.miniMap.offsetHeight);
    this.miniMap.appendChild(this.miniMapRenderer.domElement);

    this.initCameras();
    this.setActiveCamera('Menu');

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor("#000000");
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.renderer.setSize(window.innerWidth, window.innerHeight);

    document.getElementById("canvas").appendChild(this.renderer.domElement);

    // Inicializa OrbitControls para a câmera ativa
    this.controls = new OrbitControls(this.activeCamera, this.renderer.domElement);
    this.controls.enableZoom = true;

    window.addEventListener('resize', this.onResize.bind(this), false);

    this.gameManager = new GameManager(this);
 
  }

  /**
   * inicializa todas as câmeras
   */
  initCameras() {
    const aspect = window.innerWidth / window.innerHeight;

    const perspective1 = new THREE.PerspectiveCamera(69, aspect, 0.1, 1000);
    perspective1.position.set(-73, 5, 0); 
    this.cameras['Menu'] = perspective1;
    this.cameras['Menu'].lookAt(0, 5, 0);

    const miniMapCamera = new THREE.PerspectiveCamera(
      90,
      this.miniMap.offsetWidth / this.miniMap.offsetHeight,
      0.1,
      100
    );
    
    miniMapCamera.position.set(0, 99, 0);
    miniMapCamera.lookAt(0, 0, 0);
    this.cameras['Minimap'] = miniMapCamera;
  }

  /**
   * define a câmera ativa pelo nome
   * @param {String} cameraName 
   */
  setActiveCamera(cameraName) {
    this.activeCameraName = cameraName;
    this.activeCamera = this.cameras[this.activeCameraName];
  }

  /**
   * atualiza a câmera ativa se necessário
   * esta função é chamada no loop de renderização
   * quando o nome da câmera ativa muda
   */
  updateCameraIfRequired() {

    // camera changed?
    if (this.lastCameraName !== this.activeCameraName) {
        this.lastCameraName = this.activeCameraName;
        this.activeCamera = this.cameras[this.activeCameraName]
        document.getElementById("camera").innerHTML = this.activeCameraName
       
        // call on resize to update the camera aspect ratio
        // among other things
        this.onResize()

        // are the controls yet?
        if (this.controls === null) {
            // Orbit controls allow the camera to orbit around a target.
            // this.controls = new OrbitControls( this.activeCamera, this.renderer.domElement );
            // this.controls.enableZoom = true;
        }
        else {
            this.controls.object = this.activeCamera
        }
    }
  }


  onResize() {
    if (this.activeCamera !== undefined && this.activeCamera !== null) {
      this.activeCamera.aspect = window.innerWidth / window.innerHeight;
      this.activeCamera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  /**
   * 
   * @param {MyContents} contents o objeto de conteúdo 
   */
  setContents(contents) {
    this.contents = contents;
  }

  /**
   * @param {MyGuiInterface} gui o objeto da interface gráfica
   */
  setGui(gui) {
    this.gui = gui;
  }

  /**
   * Inicia o loop de renderização.
   */
  async start() {
    // Inicializa GameManager
    await this.gameManager.init();

    // Inicia o loop de renderização
    requestAnimationFrame((t) => this.render(t));
  }

  /**
   * O loop de renderização.
   * @param {Number} timestamp - Timestamp fornecido pelo requestAnimationFrame.
   */
  render(timestamp) {
    if (this.lastFrameTime === null) {
      this.lastFrameTime = timestamp;
    }
  
    const deltaMs = timestamp - this.lastFrameTime;
    this.lastFrameTime = timestamp;
    const deltaTime = deltaMs * 0.001;
  
    this.stats.begin();
  
    // Update the active camera if necessary
    this.updateCameraIfRequired();
    this.lastCameraName = this.activeCameraName;
  
    // Update game logic
    this.gameManager.update(deltaTime);
  
    // Render the main scene with the active camera
    this.renderer.render(this.scene, this.activeCamera);
  
    // Render the minimap scene with the minimap camera
    if (this.miniMapRenderer && this.cameras['Minimap']) {
      this.miniMapRenderer.render(this.scene, this.cameras['Minimap']);
    }
  
    this.stats.end();
  
    // Request the next frame
    requestAnimationFrame((t) => this.render(t));
  }
}

export { MyApp };
