import * as THREE from 'three';
import { TextMesh } from './TextMesh.js';

class ModelSelectorItem extends THREE.Object3D {
 
  constructor(models, text, color, hoverColor, size, pos) {
    super();

    this.models = models;
    this.modelUrls = models.modelUrls; 
    this.modelMap = models.loadedModels;  
    this.text = text;
    this.size = size || 1;
    this.defaultTextColor = color || 0xffffff;
    this.hoverTextColor = hoverColor || 0xffff00; 
    this.pos = pos || new THREE.Vector3(0, 0, 0);

    const padding = 0.3;
    this.menuId = text.toUpperCase();

    this.textObject = new TextMesh(this.text, this.defaultTextColor, this.size);
    const textWidth = this.textObject.getTextWidth();
    const textHeight = this.textObject.getTextHeight();

    const boxWidth = 2.5;
    const boxHeight = 3.5;
    const boxDepth = 0.2;
    const boxGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    this.boxMaterial = new THREE.MeshBasicMaterial({ color: 0x2e3146 });
    this.boxMesh = new THREE.Mesh(boxGeometry, this.boxMaterial);

    const centerOffset = -textWidth / 2;
    this.textObject.position.set(centerOffset + padding / 2, 0, 0);
    this.boxMesh.position.set(0, boxHeight/3, -boxDepth / 2 - 0.03);

    this.add(this.boxMesh);
    this.add(this.textObject);

    this.userData.menuId = this.menuId;
    this.position.copy(this.pos);

    this.isHovered = false;
    this.currentModel = null;
    this.currentModelIndex = 0;
    
    this.displayModel(this.currentModelIndex);
  }

  displayModel(index) {
    if (this.currentModel) {
      this.remove(this.currentModel);
    }

    const modelUrl = this.modelUrls[index];
    const model = this.models.getModel(modelUrl, 2)

    if (model) {
      this.currentModel = model.clone();
      this.currentModel.position.set(0, 0.5, 0.01);
      this.add(this.currentModel);
    }
  }

  cycleModel() {
    if (this.modelUrls.length === 0) return;

    this.currentModelIndex = (this.currentModelIndex + 1) % this.modelUrls.length;
    this.displayModel(this.currentModelIndex);
  }

  getCurrentModelUrl() {
    return this.modelUrls[this.currentModelIndex];
  }

  setHover() {
    if (!this.isHovered) {
      this.textObject.changeColor(this.hoverTextColor);
      this.isHovered = true;
    }
  }

  unsetHover() {
    if (this.isHovered) {
      this.textObject.changeColor(this.defaultTextColor);
      this.isHovered = false;
    }
  }



}

export { ModelSelectorItem };
