import * as THREE from "three";

class ObjectCreator {
  /**
   * Construtor da classe ObjectCreator.
   * @param {Object} app - Aplicação principal.
   * @param {Object} graphLoader - Instância do GraphLoader.
   * @param {Object} materialsLoader - Instância do MaterialsLoader.
   */
  constructor(app, graphLoader, materialsLoader) {
    this.app = app; 
    this.graphLoader = graphLoader; 
    this.materialsLoader = materialsLoader; 
  }

  /**
   * Criar os objetos na cena.
   */
  createObjects() {
    const rootId = "scene";
    const rootNode = this.graphLoader.nodes[rootId];

    if (rootNode) {
      this.buildSceneGraph(rootId, this.graphLoader.nodes, this.app.scene);
    }
  }

  /**
   * Constrói o grafo de cena recursivamente.
   * @param {string} nodeId - ID do nó atual.
   * @param {Object} nodes - Estrutura do grafo carregado.
   * @param {Object} parent - Objeto pai na cena Three.js.
   * @param {Object|null} inheritedMaterial - Material herdado.
   */
  buildSceneGraph(nodeId, nodes, parent, inheritedMaterial = null) {
    const node = nodes[nodeId];
    if (!node) {
      console.log(nodeId+ " nó não encontrado.");
      return;
    }
  
    const group = new THREE.Group();
    this.applyTransforms(group, node.transforms);
  
    //Material
    let currentMaterial = inheritedMaterial;
    if (node.materialRef) {
      const material = this.materialsLoader.materials[node.materialRef];
      if (material) {
        currentMaterial = material;
      } else {
        console.log(node.materialRef+ " material não encontrado.");
      }
    }
  
    parent.add(group);
  
    if (node.children) {
      Object.entries(node.children).forEach(([childKey, child]) => {
        if (child.type === "noderef") {
          const referencedNode = nodes[child.nodeId];
          if (referencedNode) {
            this.buildSceneGraph(child.nodeId, nodes, group, currentMaterial);
          } else {
            console.error(child.nodeId + " nó não encontrado");
          }
        } else {
          let childObject = null;
  
          if (child.type === "polygon") {
            childObject = this.polygonPrimitive(child, currentMaterial);
          } else if (child.type === "rectangle") {
            childObject = this.rectanglePrimitive(child, currentMaterial);
          } else if (child.type === "cylinder") {
            childObject = this.cylinderPrimitive(child, currentMaterial);
          } else if (child.type === "pointlight") {
            childObject = this.pointLightPrimitive(child);
          } else if (child.type === "spotlight") {
            childObject = this.spotLightPrimitive(child);
          } else {
            console.log("Tipo de filho desconhecido: "+ child.type);
          }
  
          if (childObject) {
            group.add(childObject);
          }
        }
      });
    }
  }

  /**
   * Cria uma primitiva de retângulo.
   * @param {Object} primitive - Dados da primitiva.
   * @param {Object|null} material - Material aplicado.
   * @returns {Object} Objeto Three.js Mesh.
   */
  rectanglePrimitive(primitive, material = null) {
    const width = Math.abs(primitive.xy1.x - primitive.xy2.x);
    const height = Math.abs(primitive.xy1.y - primitive.xy2.y);

    const geometry = new THREE.PlaneGeometry(width, height);

    const meshMaterial =
      material ||
      new THREE.MeshBasicMaterial({
        color: 0xffb3b3,
      });

    return new THREE.Mesh(geometry, meshMaterial);
  }

  /**
   * Cria uma primitiva de polígono.
   * @param {Object} primitive - Dados da primitiva.
   * @param {Object|null} material - Material aplicado.
   * @returns {Object} Objeto Three.js Mesh.
   */
  polygonPrimitive(primitive, material = null) {
    const radius = primitive.radius || 1;
    const slices = primitive.slices || 32;

    const shape = new THREE.Shape();

    for (let i = 0; i < slices; i++) {
      const angle = (i / slices) * 2 * Math.PI; 
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      if (i === 0) {
        shape.moveTo(x, y); 
      } else {
        shape.lineTo(x, y); 
      }
    }
    shape.closePath(); 

    
    const geometry = new THREE.ShapeGeometry(shape);

    const color = primitive.color_c || { r: 1, g: 1, b: 1 };
    const meshMaterial =
      material ||
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(color.r, color.g, color.b),
        side: THREE.DoubleSide,
      });

    return new THREE.Mesh(geometry, meshMaterial);
  }

  /**
   * Cria uma primitiva de cilindro.
   * @param {Object} primitive - Dados da primitiva.
   * @param {Object|null} material - Material aplicado.
   * @returns {Object} Objeto Three.js Mesh.
   */
  cylinderPrimitive(primitive, material = null) {
    const baseRadius = primitive.base || 1; 
    const topRadius = primitive.top || 1; 
    const height = primitive.height || 1; 
    const radialSegments = primitive.slices || 32; 
    const heightSegments = primitive.stacks || 1; 
    const openEnded = !primitive.capsclose; 
    const thetaLength = (primitive.thetaLength || 360) * (Math.PI / 180); 

    
    const geometry = new THREE.CylinderGeometry(
      topRadius, 
      baseRadius, 
      height, 
      radialSegments, 
      heightSegments, 
      openEnded, 
      0, 
      thetaLength 
    );

    const meshMaterial =
      material ||
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
      });

    return new THREE.Mesh(geometry, meshMaterial);
  }

  /**
   * Cria uma luz do tipo PointLight.
   * @param {Object} node - Nó com propriedades da luz.
   * @returns {Object} Objeto Three.js PointLight.
   */
  pointLightPrimitive(node) {
    const color = new THREE.Color(node.color.r, node.color.g, node.color.b);
    const intensity = node.intensity || 1;
    const distance = node.distance || 0;
    const decay = node.decay || 1;

    const light = new THREE.PointLight(color, intensity, distance, decay);
    light.position.set(
      node.position?.x || 0,
      node.position?.y || 0,
      node.position?.z || 0
    );

    return light;
  }

  /**
   * Cria uma luz do tipo SpotLight.
   * @param {Object} node - Nó com propriedades da luz.
   * @returns {Object} Objeto Three.js SpotLight.
   */
  spotLightPrimitive(node) {
    const color = new THREE.Color(node.color.r, node.color.g, node.color.b);
    const intensity = node.intensity || 1;
    const distance = node.distance || 0;
    const angle = node.angle || Math.PI / 4;
    const decay = node.decay || 1;
    const penumbra = node.penumbra || 0;

    const light = new THREE.SpotLight(
      color,
      intensity,
      distance,
      angle,
      penumbra,
      decay
    );
    light.position.set(
      node.position?.x || 0,
      node.position?.y || 0,
      node.position?.z || 0
    );

    return light;
  }

  /**
   * Aplica transformações ao grupo.
   * @param {THREE.Group} group - Grupo ao qual as transformações serão aplicadas.
   * @param {Array} transforms - Lista de transformações do nó.
   */
  applyTransforms(group, transforms) {
    if (!transforms || transforms.length === 0) return;

    transforms.forEach((transform) => {
      switch (transform.type) {
        case "translate":
          group.position.set(
            transform.amount?.x || 0,
            transform.amount?.y || 0,
            transform.amount?.z || 0
          );
          break;

        case "rotate":
          group.rotation.set(
            this.degToRad(transform.amount?.x || 0),
            this.degToRad(transform.amount?.y || 0),
            this.degToRad(transform.amount?.z || 0)
          );
          break;

        case "scale":
          group.scale.set(
            transform.amount?.x || 1,
            transform.amount?.y || 1,
            transform.amount?.z || 1
          );
          break;

        default:
          console.log("Transformação desconhecida: " + transform.type);
          break;
      }
    });
  }

  /**
   * Converte graus para radianos.
   * @param {number} degrees - Valor em graus.
   * @returns {number} Valor em radianos.
   */
  degToRad(degrees) {
    return degrees * (Math.PI / 180);
  }
}

export { ObjectCreator };
