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

    this.currentHoveredItem = null;


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
    const canvas = event.target; // Certifique-se de usar o canvas correto
    const rect = canvas.getBoundingClientRect();

    // Coordenadas normalizadas do mouse
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.mouse.set(x, y);

    // Configurar o Raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Intersecta com todos os objetos no grupo
    const intersects = this.raycaster.intersectObjects(this.menuGroup.children, true);

    if (intersects.length > 0) {
      const targetObject = this.findDirectChild(intersects[0].object);
  
      if (targetObject?.userData?.menuId) {
        console.log(`Clicked on: ${targetObject.userData.menuId}`);
        // this.onMenuItemSelected(targetObject.userData.menuId);
      }
    }
  }

  

  handlePointerMove(event) {
    const canvas = event.target;
    const rect = canvas.getBoundingClientRect();

    // Calcula as coordenadas normalizadas do mouse
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.mouse.set(x, y);

    // Configura o raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Intersecta com os itens do menu
    const intersects = this.raycaster.intersectObjects(this.menuGroup.children, true);

    let hoveredMenuId = null;

    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object;
      
    }
    //TODO
   
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

  // Função para encontrar o filho direto do grupo
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
