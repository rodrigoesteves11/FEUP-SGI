import * as THREE from 'three';
import { TextMesh } from './TextMesh.js';

class MenuItem extends THREE.Object3D {
  constructor(text, color, hoverColor, size, pos) {
    super();

    this.text = text;
    this.size = size || 1;
    this.defaultTextColor = color || 0xffffff;
    this.hoverTextColor = hoverColor || 0xffff00; 
    this.pos = pos || new THREE.Vector3(0, 0, 0);

    const padding = 0.5;
    this.menuId = text.toUpperCase();

    this.textObject = new TextMesh(this.text, this.defaultTextColor, this.size);
    const textWidth = this.textObject.getTextWidth();
    const textHeight = this.textObject.getTextHeight();

    const boxWidth = textWidth + padding * 2;
    const boxHeight = textHeight + padding;
    const boxDepth = 0.2;
    const boxGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    this.boxMaterial = new THREE.MeshBasicMaterial({ color: 0x2e3146 });
    this.boxMesh = new THREE.Mesh(boxGeometry, this.boxMaterial);

    const centerOffset = -textWidth / 2;
    this.textObject.position.set(centerOffset + padding / 2, 0, 0);
    this.boxMesh.position.set(0, 0, -boxDepth / 2 - 0.04);

    this.add(this.boxMesh);
    this.add(this.textObject);

    this.userData.menuId = this.menuId;
    this.position.copy(this.pos);

    this.isHovered = false;
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

export { MenuItem };
