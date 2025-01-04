import * as THREE from 'three';

class TextMesh extends THREE.Object3D {
  constructor(text, color = 0xffffff, size = 1, spritesheetPath = './fonts/Berlin_sans32.png') {
    super();

    this.text = text;
    this.color = color;
    this.size = size;
    this.spritesheetSize = 512; 
    this.charSize = 32; 
    this.texture = new THREE.TextureLoader().load(spritesheetPath);
    this.texture.minFilter = THREE.LinearFilter; 
    this.texture.magFilter = THREE.LinearFilter; 
    this.texture.generateMipmaps = false; 

    this.createTextMesh();
  }

  createTextMesh() {
    const material = new THREE.MeshBasicMaterial({
      map: this.texture,
      color: this.color,
      transparent: true,
      side: THREE.DoubleSide,
      //alphaMap: this.texture,
      //depthWrite: false, 
    });

    const offset = this.charSize / this.spritesheetSize; 
    let xOffset = 0; 
  
    for (let i = 0; i < this.text.length; i++) {
      const charCode = this.text.charCodeAt(i); 
      const u = (charCode % 16) * offset; 
      const v = 1 - (Math.floor(charCode / 16) + 1) * offset; 
  
      const geometry = new THREE.PlaneGeometry(this.size, this.size);
  
      const uvArray = geometry.attributes.uv.array;
  
      uvArray[0] = u;
      uvArray[1] = v;
      uvArray[2] = u + offset;
      uvArray[3] = v;
      uvArray[4] = u;
      uvArray[5] = v + offset;
      uvArray[6] = u + offset;
      uvArray[7] = v + offset;
  
      geometry.attributes.uv.needsUpdate = true;
  
      const mesh = new THREE.Mesh(geometry, material);
  
      mesh.position.set(xOffset, 0, 0);
      mesh.rotation.x = Math.PI;
      this.add(mesh);
  
      xOffset += this.size - (this.size / 2 - 0.1); 
    }

    this.textWidth = xOffset;
    this.textHeight = this.size;
  }

  getTextWidth() {
    return this.textWidth;
  }

  getTextHeight() {
    return this.textHeight;
  }

  changeColor(newColor) {
    this.color = newColor;
    this.children.forEach((child) => {
      if (child.material) {
        child.material.color.set(newColor);
      }
    });
  }
}



export {TextMesh};
