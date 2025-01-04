// MyInitialMenu.js
import * as THREE from 'three';
import { MenuItem } from './MenuItem.js';
import { ModelSelectorItem } from './ModelSelectorItem.js';

class MyInitialMenu {
  constructor(scene, camera, models) {
    this.scene = scene;
    this.camera = camera;
    this.models = models;
    
    this.menuGroup = new THREE.Group();
    this.menuItems = [];
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Armazena especificamente os seletores
    this.playerSelector = null;
    this.botSelector = null;


    //Callbacks
    this.onModelSelected = () => {};

    //Events
    this.handlePointer = this.handlePointer.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
  }

  async init() {
    this.createMenuItems();
    this.scene.add(this.menuGroup);
    this.addEventListeners();
  }

  createMenuItems() {
    const textItems = [
      { text: 'START GAME', color: 0xffffff, hoverColor: 0xebc88f, size: 1, position: new THREE.Vector3(0, 4, 0) },
      { text: 'SELECT NAME', color: 0xffffff, hoverColor: 0xebc88f, size: 1, position: new THREE.Vector3(0, 2, 0) }
    ];
  
    textItems.forEach(itemData => {
      const menuItem = new MenuItem(
        itemData.text,
        itemData.color,
        itemData.hoverColor,
        itemData.size,
        itemData.position
      );
      this.menuItems.push(menuItem);
      this.menuGroup.add(menuItem); 
    });

    
    this.playerSelector = new ModelSelectorItem(
      this.models,              
      'PLAYER',                 
      0xffffff,                 
      0xebc88f,                 
      0.5,                      
      new THREE.Vector3(-2.5, -2, 0)  
    );

    this.botSelector = new ModelSelectorItem(
      this.models,
      'BOT',
      0xffffff,
      0xebc88f,
      0.5,
      new THREE.Vector3(2.5, -2, 0)
    );

    this.menuItems.push(this.playerSelector);
    this.menuItems.push(this.botSelector);
    this.menuGroup.add(this.playerSelector);
    this.menuGroup.add(this.botSelector);
    
    // // Adiciona os seletores de modelo
    // const playerSelector = new ModelSelectorItem('PLAYER', font, {
    //   position: new THREE.Vector3(-3, -1, -0.5),
    //   modelUrls: [
    //     'models/pink.glb',
    //     'models/blue.glb',
    //   ],
    //   onModelSelected: (modelUrl) => {
    //     this.onModelSelectedCallback('PLAYER', modelUrl);
    //   }
    // });

    // const botSelector = new ModelSelectorItem('BOT', font, {
    //   position: new THREE.Vector3(3, -1, -0.5),
      
    //   onModelSelected: (modelUrl) => {
    //     this.onModelSelectedCallback('BOT', modelUrl);
    //   }
    // });

    // this.menuItems.push(playerSelector);
    // this.menuItems.push(botSelector);
    // this.menuGroup.add(playerSelector.getObject());
    // this.menuGroup.add(botSelector.getObject());

    this.menuGroup.position.set(-56.2, 3, 0);
    this.menuGroup.rotation.y = -Math.PI / 2;
  }

  addEventListeners() {
    document.addEventListener('pointerdown', this.handlePointer, false);
    document.addEventListener('pointermove', this.handlePointerMove, false);
  }

  removeEventListeners() {
    document.removeEventListener('pointerdown', this.handlePointer, false);
    document.removeEventListener('pointermove', this.handlePointerMove, false);
  }

  handlePointer(event) {
    const canvas = event.target; 
    const rect = canvas.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.mouse.set(x, y);

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(this.menuGroup.children, true);

    if (intersects.length > 0) {
      const targetObject = this.findDirectChild(intersects[0].object);
  
      if (targetObject?.userData?.menuId) {
        console.log(`Clicked on: ${targetObject.userData.menuId}`);
        if (['BOT', 'PLAYER'].includes(targetObject.userData.menuId)) {
          targetObject.cycleModel();
        }
        if(['SELECT NAME'].includes(targetObject.userData.menuId)){
          this.onMenuItemSelected('SELECT NAME');
        }
        if(['START GAME'].includes(targetObject.userData.menuId)){
          this.onMenuItemSelected('START GAME');
        }
      }
    }
  }

  
  handlePointerMove(event) {
    const canvas = event.target;
    const rect = canvas.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.mouse.set(x, y);

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(this.menuGroup.children, true);

    if (intersects.length > 0) {
      const targetObject = this.findDirectChild(intersects[0].object);
  
      if (targetObject?.userData?.menuId) {
        if(this.currentHoveredItem !== targetObject){
          if (this.currentHoveredItem) {
            this.currentHoveredItem.unsetHover();
          }
          targetObject.setHover();
          this.currentHoveredItem = targetObject;
        }
      } 
    }else {
      if (this.currentHoveredItem) {
        this.currentHoveredItem.unsetHover();
        this.currentHoveredItem = null;
      }
    }
  }

  getPlayerModelUrl() {
    return this.playerSelector?.getCurrentModelUrl();
  }

  getBotModelUrl() {
    return this.botSelector?.getCurrentModelUrl();
  }

  /**
   * Callback quando um item de menu é selecionado.
   * @param {String} menuId 
   */
  onMenuItemSelected(menuId) {
    console.log(`Menu item selected: ${menuId}`);
  }

  /**
   * Remove o menu da cena.
   */
  removeMenu() {
    this.removeEventListeners();
    this.scene.remove(this.menuGroup);
  }

  findDirectChild(object) {
    while (object && object.parent !== this.menuGroup) {
      object = object.parent;
    }
    return object;
  }


  /**
   * Atualiza qualquer lógica específica do menu (opcional).
   * @param {Number} deltaTime 
   */
  update(deltaTime) {
    // Atualizações específicas do menu, se necessário
  }
}



export { MyInitialMenu };
