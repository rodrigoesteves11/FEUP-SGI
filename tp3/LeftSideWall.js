import * as THREE from 'three';
import { TextMesh } from './TextMesh.js';

class LeftSideWall extends THREE.Object3D {
  constructor(scene, name) {
    super();
    this.scene = scene;
    this.name = name;
    this.size = 1;
    this.defaultTextColor = 0xffffff;
    this.pos = new THREE.Vector3(0, 0, 0);

    // Label
    this.label = new TextMesh("PLAYER NAME:", this.defaultTextColor, 0.6);
    const labelWidth = this.label.getTextWidth();
    const labelHeight = this.label.getTextHeight();

    // Name Text
    this.textObject = new TextMesh(this.name, this.defaultTextColor, 0.6);
    const textWidth = this.textObject.getTextWidth();
    const textHeight = this.textObject.getTextHeight();

    // Author Names
    this.authorLabel = new TextMesh("GAME AUTHORS:", this.defaultTextColor, 0.6);
    const authorLabelWidth = this.authorLabel.getTextWidth();
    const authorLabelHeight = this.authorLabel.getTextHeight();

    this.authorName1 = new TextMesh("Rodrigo Esteves", this.defaultTextColor, 0.6);
    const authorWidth1 = this.authorName1.getTextWidth();
    const authorHeight1 = this.authorName1.getTextHeight();

    this.authorName2 = new TextMesh("Pedro Cancela", this.defaultTextColor, 0.6);
    const authorWidth2 = this.authorName2.getTextWidth();
    const authorHeight2 = this.authorName2.getTextHeight();

    // Box
    const boxGeometry = new THREE.BoxGeometry(2, 8, 8);
    this.boxMaterial = new THREE.MeshBasicMaterial({ color: 0x2e3146 });
    this.boxMesh = new THREE.Mesh(boxGeometry, this.boxMaterial);
    this.boxMesh.position.set(0, 0, 0);

    this.label.position.set(-1.3, 3.5, -4 + labelWidth / 6); 
    this.label.rotation.set(0, -Math.PI / 2, 0);

    this.textObject.position.set(-1.1, 2.5, -4 + textWidth / 2); 
    this.textObject.rotation.set(0, -Math.PI / 2, 0);

    this.authorName1.position.set(-1.1, - 1, -4 + labelWidth / 6); 
    this.authorName1.rotation.set(0, -Math.PI / 2, 0);

    this.authorName2.position.set(-1.1, - 2, -4 + labelWidth / 6); 
    this.authorName2.rotation.set(0, -Math.PI / 2, 0);

    this.authorLabel.position.set(-1.3, 0, -4 + authorLabelWidth / 6); 
    this.authorLabel.rotation.set(0, -Math.PI / 2, 0);

    // Add elements to the wall
    this.add(this.label);
    this.add(this.boxMesh);
    this.add(this.textObject);
    this.add(this.authorName1);
    this.add(this.authorName2);
    this.add(this.authorLabel);

    this.scene.add(this);
    this.position.set(-60, 5, -10);
    this.rotation.set(0, Math.PI / 4, 0);
  }

  changeName(name) {
    this.remove(this.textObject);
    this.name = name;
    this.textObject = new TextMesh(name, this.defaultTextColor, 0.6); 
    const textWidth = this.textObject.getTextWidth();
    this.textObject.position.set(-1.1, 2.5, -3.2); 
    this.textObject.rotation.set(0, -Math.PI / 2, 0);
    this.add(this.textObject);
  }
}

export default LeftSideWall;
