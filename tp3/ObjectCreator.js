import * as THREE from "three";

class ObjectCreator {
  constructor(app, graphLoader, materialsLoader) {
    this.app = app;
    this.graphLoader = graphLoader;
    this.materialsLoader = materialsLoader;
    this.polygons = [];
    this.wireframe = false;
  }

  /**
   * Create objects.
   */
  createObjects() {
    const rootId = "scene";
    const rootNode = this.graphLoader.nodes[rootId];

    if (rootNode) {
      this.buildSceneGraph(rootId, this.graphLoader.nodes, this.app.scene);
    } else {
      console.error(`Nó raiz '${rootId}' não encontrado.`);
    }
  }

  /**
   *  Build scene graph.
   */
  buildSceneGraph(
    nodeId,
    nodes,
    parent,
    inheritedMaterial = null,
    inheritedCastShadows = false,
    inheritedReceiveShadows = false
  ) {
    const node = nodes[nodeId];

    const group = new THREE.Group();
    this.applyTransforms(group, node.transforms);

    let currentMaterial = inheritedMaterial;
    if (node.materialRef) {
      const material = this.materialsLoader.materials[node.materialRef];
      if (material) {
        currentMaterial = material;
      } else {
        console.warn(`Material '${node.materialRef}' não encontrado.`);
      }
    }

    const castShadows = node.castShadows ?? inheritedCastShadows;
    const receiveShadows = node.receiveShadows ?? inheritedReceiveShadows;

    parent.add(group);

    // Process prim.
    if (node.children) {
      Object.entries(node.children).forEach(([childKey, childValue]) => {
        if (childKey === "nodesList" || childKey === "lodsList") return;

        this.processChild(
          childValue,
          group,
          nodes,
          currentMaterial,
          castShadows,
          receiveShadows
        );
      });

      // Process nodesList.
      if (node.children.nodesList) {
        node.children.nodesList.forEach((childNodeId) => {
          this.buildSceneGraph(
            childNodeId,
            nodes,
            group,
            currentMaterial,
            castShadows,
            receiveShadows
          );
        });
      }

      // ProcesS LODs.
      if (node.children.lodsList) {
        this.createLods(
          node.children.lodsList,
          nodes,
          group,
          currentMaterial,
          castShadows,
          receiveShadows
        );
      }
    }
  }

  /**
   *  Create LODs.
   */
  createLods(
    lodsList,
    nodes,
    parent,
    inheritedMaterial,
    inheritedCastShadows,
    inheritedReceiveShadows
  ) {
    lodsList.forEach((lodId) => {
      const lodData = nodes[lodId];
      if (!lodData || lodData.type !== "lod") {
        console.error(`LOD '${lodId}' não encontrado ou inválido.`);
        return;
      }

      const lod = new THREE.LOD();

      lodData.lodNodes.forEach((lodNode) => {
        const nodeId = lodNode.nodeId;
        const distance = lodNode.mindist || 0;

        const referencedNode = nodes[nodeId];
        if (referencedNode) {
          const lodGroup = new THREE.Group();

          this.buildSceneGraph(
            nodeId,
            nodes,
            lodGroup,
            inheritedMaterial,
            inheritedCastShadows,
            inheritedReceiveShadows
          );

          lod.addLevel(lodGroup, distance);
        } else {
          console.error(`Nó '${nodeId}' referenciado no LOD não encontrado.`);
        }
      });

      parent.add(lod);
    });
  }
  /**
   * Process child node.
   */
  processChild(
    child,
    group,
    nodes,
    currentMaterial,
    castShadows,
    receiveShadows
  ) {
    let childObject = null;

    switch (child.type) {
      case "rectangle":
        childObject = this.rectanglePrim(
          child,
          currentMaterial,
          castShadows,
          receiveShadows
        );
        break;

      case "triangle":
        childObject = this.trianglePrim(
          child,
          currentMaterial,
          castShadows,
          receiveShadows
        );
        break;

      case "box":
        childObject = this.boxPrim(
          child,
          currentMaterial,
          castShadows,
          receiveShadows
        );
        break;

      case "cylinder":
        childObject = this.cylinderPrim(
          child,
          currentMaterial,
          castShadows,
          receiveShadows
        );
        break;

      case "sphere":
        childObject = this.spherePrim(
          child,
          currentMaterial,
          castShadows,
          receiveShadows
        );
        break;

      case "nurbs":
        childObject = this.nurbsPrim(
          child,
          currentMaterial,
          castShadows,
          receiveShadows
        );
        break;

      case "polygon":
        childObject = this.polygonPrim(
          child,
          currentMaterial,
          castShadows,
          receiveShadows
        );
        break;

      case "directionallight":
        childObject = this.directionLightPrim(child);
        break;

      case "pointlight":
        childObject = this.pointLightPrim(child);
        break;

      case "spotlight":
        childObject = this.spotLightPrim(child);
        break;

      default:
        console.warn(`Tipo de nó não reconhecido: ${child.type}`);
        break;
    }

    if (childObject) {
      group.add(childObject);
    }
  }

  rectanglePrim(node, material, castShadow, receiveShadow) {
    const xy1 = node.xy1;
    const xy2 = node.xy2;
    const parts_x = node.parts_x || 1;
    const parts_y = node.parts_y || 1;

    const width = Math.abs(xy2.x - xy1.x);
    const height = Math.abs(xy2.y - xy1.y);

    const geometry = new THREE.PlaneGeometry(width, height, parts_x, parts_y);
    const meshMaterial =
      material || new THREE.MeshPhongMaterial({ color: 0xffffff });
    const mesh = new THREE.Mesh(geometry, meshMaterial);

    const centerX = (xy1.x + xy2.x) / 2;
    const centerY = (xy1.y + xy2.y) / 2;
    mesh.position.set(centerX, centerY, 0);

    mesh.castShadow = castShadow;
    mesh.receiveShadow = receiveShadow;

    return mesh;
  }

  trianglePrim(node, material, castShadow, receiveShadow) {
    const xyz1 = node.xyz1;
    const xyz2 = node.xyz2;
    const xyz3 = node.xyz3;

    const vertices = new Float32Array([
      xyz1.x,
      xyz1.y,
      xyz1.z,
      xyz2.x,
      xyz2.y,
      xyz2.z,
      xyz3.x,
      xyz3.y,
      xyz3.z,
    ]);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

    const meshMaterial =
      material || new THREE.MeshPhongMaterial({ color: 0xffffff });

    const mesh = new THREE.Mesh(geometry, meshMaterial);
    mesh.castShadow = castShadow;
    mesh.receiveShadow = receiveShadow;

    return mesh;
  }

  boxPrim(node, material, castShadow, receiveShadow) {
    const xyz1 = node.xyz1;
    const xyz2 = node.xyz2;
    const parts_x = node.parts_x || 1;
    const parts_y = node.parts_y || 1;
    const parts_z = node.parts_z || 1;

    const width = Math.abs(xyz2.x - xyz1.x);
    const height = Math.abs(xyz2.y - xyz1.y);
    const depth = Math.abs(xyz2.z - xyz1.z);

    const geometry = new THREE.BoxGeometry(
      width,
      height,
      depth,
      parts_x,
      parts_y,
      parts_z
    );
    const meshMaterial =
      material || new THREE.MeshPhongMaterial({ color: 0xffffff });
    const mesh = new THREE.Mesh(geometry, meshMaterial);

    const centerX = (xyz1.x + xyz2.x) / 2;
    const centerY = (xyz1.y + xyz2.y) / 2;
    const centerZ = (xyz1.z + xyz2.z) / 2;
    mesh.position.set(centerX, centerY, centerZ);

    mesh.castShadow = castShadow;
    mesh.receiveShadow = receiveShadow;

    return mesh;
  }

  spherePrim(node, material, castShadow, receiveShadow) {
    const radius = node.radius;
    const slices = node.slices;
    const stacks = node.stacks;
    const phistart = node.phistart || 0;
    const philength = node.philength || 360;
    const thetastart = node.thetastart || 0;
    const thetalength = node.thetalength || 180;

    const geometry = new THREE.SphereGeometry(
      radius,
      slices,
      stacks,
      this.degToRad(phistart),
      this.degToRad(philength),
      this.degToRad(thetastart),
      this.degToRad(thetalength)
    );

    const meshMaterial =
      material || new THREE.MeshPhongMaterial({ color: 0xffffff });
    const mesh = new THREE.Mesh(geometry, meshMaterial);
    mesh.castShadow = castShadow;
    mesh.receiveShadow = receiveShadow;

    return mesh;
  }

  cylinderPrim(node, material, castShadow, receiveShadow) {
    const base = node.base;
    const top = node.top;
    const height = node.height;
    const slices = node.slices;
    const stacks = node.stacks;
    const capsclose = node.capsclose || false;
    const thetastart = node.thetastart || 0;
    const thetalength = node.thetalength || 360;

    const geometry = new THREE.CylinderGeometry(
      top,
      base,
      height,
      slices,
      stacks,
      !capsclose,
      this.degToRad(thetastart),
      this.degToRad(thetalength)
    );

    const meshMaterial =
      material || new THREE.MeshPhongMaterial({ color: 0xffffff });
    const mesh = new THREE.Mesh(geometry, meshMaterial);

    mesh.castShadow = castShadow;
    mesh.receiveShadow = receiveShadow;

    return mesh;
  }

  pointLightPrim(node) {
    const color = new THREE.Color(node.color.r, node.color.g, node.color.b);
    const intensity = node.intensity || 1;
    const distance = node.distance || 1000;
    const decay = node.decay || 2;
    const position = new THREE.Vector3(
      node.position.x,
      node.position.y,
      node.position.z
    );
    const castShadow = node.castshadow || false;
    const shadowFar = node.shadowfar || 500;
    const shadowMapSize = node.shadowmapsize || 512;

    const light = new THREE.PointLight(color, intensity, distance, decay);
    light.position.copy(position);
    light.castShadow = castShadow;
    light.shadow.camera.far = shadowFar;
    light.shadow.mapSize.width = shadowMapSize;
    light.shadow.mapSize.height = shadowMapSize;

    if (node.enabled !== undefined) {
      light.visible = node.enabled;
    }

    return light;
  }

  spotLightPrim(node) {
    const color = new THREE.Color(node.color.r, node.color.g, node.color.b);
    const intensity = node.intensity || 1;
    const distance = node.distance || 1000;
    const angle = node.angle;
    const decay = node.decay || 2;
    const penumbra = node.penumbra || 1;
    const position = new THREE.Vector3(
      node.position.x,
      node.position.y,
      node.position.z
    );
    const target = new THREE.Vector3(
      node.target.x,
      node.target.y,
      node.target.z
    );
    const castShadow = node.castshadow || false;
    const shadowFar = node.shadowfar || 500;
    const shadowMapSize = node.shadowmapsize || 512;

    const light = new THREE.SpotLight(
      color,
      intensity,
      distance,
      this.degToRad(angle),
      penumbra,
      decay
    );
    light.position.copy(position);
    light.target.position.copy(target);
    light.castShadow = castShadow;
    light.shadow.camera.far = shadowFar;
    light.shadow.mapSize.width = shadowMapSize;
    light.shadow.mapSize.height = shadowMapSize;

    if (node.enabled !== undefined) {
      light.visible = node.enabled;
    }

    return light;
  }

  directionLightPrim(node) {
    const color = new THREE.Color(node.color.r, node.color.g, node.color.b);
    const intensity = node.intensity || 1;
    const position = new THREE.Vector3(
      node.position.x,
      node.position.y,
      node.position.z
    );
    const castShadow = node.castshadow || false;
    const shadowLeft = node.shadowleft || -5;
    const shadowRight = node.shadowright || 5;
    const shadowBottom = node.shadowbottom || -5;
    const shadowTop = node.shadowtop || 5;
    const shadowFar = node.shadowfar || 500;
    const shadowMapSize = node.shadowmapsize || 512;

    const light = new THREE.DirectionalLight(color, intensity);
    light.position.copy(position);
    light.castShadow = castShadow;
    light.shadow.camera.left = shadowLeft;
    light.shadow.camera.right = shadowRight;
    light.shadow.camera.bottom = shadowBottom;
    light.shadow.camera.top = shadowTop;
    light.shadow.camera.far = shadowFar;
    light.shadow.mapSize.width = shadowMapSize;
    light.shadow.mapSize.height = shadowMapSize;

    if (node.enabled !== undefined) {
      light.visible = node.enabled;
    }

    return light;
  }

  polygonPrim(
    node,
    wireframe = false,
    castShadow = false,
    receiveShadow = false
  ) {
    const { radius, stacks, slices, color_c, color_p } = node;
    const positions = [];
    const colors = [];
    const indices = [];

    const centerColor = new THREE.Color(color_c.r, color_c.g, color_c.b);
    const perimeterColor = new THREE.Color(color_p.r, color_p.g, color_p.b);

    positions.push(0, 0, 0);
    colors.push(centerColor.r, centerColor.g, centerColor.b);

    for (let stack = 1; stack <= stacks; stack++) {
      const stackRadius = (stack / stacks) * radius;
      for (let slice = 0; slice < slices; slice++) {
        const theta = (slice / slices) * Math.PI * 2;
        const x = Math.cos(theta) * stackRadius;
        const y = Math.sin(theta) * stackRadius;
        positions.push(x, y, 0);

        const t = stack / stacks;
        const interpolatedColor = centerColor.clone().lerp(perimeterColor, t);
        colors.push(
          interpolatedColor.r,
          interpolatedColor.g,
          interpolatedColor.b
        );
      }
    }

    for (let stack = 0; stack < stacks; stack++) {
      for (let slice = 0; slice < slices; slice++) {
        const current = stack * slices + slice + 1;
        const next = stack * slices + ((slice + 1) % slices) + 1;
        const nextStack = (stack + 1) * slices + slice + 1;
        const nextStackNext = (stack + 1) * slices + ((slice + 1) % slices) + 1;

        if (stack === 0 || stack === stacks - 1) {
          indices.push(0, current, next);
        } else {
          indices.push(
            current,
            nextStack,
            nextStackNext,
            current,
            nextStackNext,
            next
          );
        }
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.setIndex(indices);

    const meshMaterial = new THREE.MeshBasicMaterial({
      vertexColors: true,
      wireframe,
    });
    const mesh = new THREE.Mesh(geometry, meshMaterial);
    mesh.castShadow = castShadow;
    mesh.receiveShadow = receiveShadow;

    this.polygons.push(mesh);

    return mesh;
  }

  nurbsPrim(node, material, castShadow, receiveShadow) {
    const { degree_u, degree_v, parts_u, parts_v, controlpoints } = node;
    const controlPointsArray = this.buildControlPointsArray(
      degree_u,
      degree_v,
      controlpoints
    );

    const knotsU = this.buildKnotsArray(degree_u);
    const knotsV = this.buildKnotsArray(degree_v);

    const stackedPoints = controlPointsArray.map((row) =>
      row.map((item) => new THREE.Vector4(item[0], item[1], item[2], item[3]))
    );

    const nurbsSurface = new NURBSSurface(
      degree_u,
      degree_v,
      knotsU,
      knotsV,
      stackedPoints
    );
    const geometry = new ParametricGeometry(
      (u, v, target) => nurbsSurface.getPoint(u, v, target),
      parts_u,
      parts_v
    );

    const meshMaterial =
      material ||
      new THREE.MeshPhongMaterial({ color: 0x111111, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, meshMaterial);
    mesh.castShadow = castShadow;
    mesh.receiveShadow = receiveShadow;

    return mesh;
  }

  buildControlPointsArray(degreeU, degreeV, controlPoints) {
    const controlPointsArray = [];
    for (let i = 0; i <= degreeU; i++) {
      const row = [];
      for (let j = 0; j <= degreeV; j++) {
        const index = i * (degreeV + 1) + j;
        const controlPointData = controlPoints[index];
        row.push([
          controlPointData.x,
          controlPointData.y,
          controlPointData.z,
          1,
        ]);
      }
      controlPointsArray.push(row);
    }
    return controlPointsArray;
  }

  buildKnotsArray(degree) {
    const knots = [];
    for (let i = 0; i <= degree; i++) {
      knots.push(0);
    }
    for (let i = 0; i <= degree; i++) {
      knots.push(1);
    }
    return knots;
  }

  /**
   * Aplica transformações ao grupo.
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
          console.warn(`Transformação desconhecida: ${transform.type}`);
          break;
      }
    });
  }

  /**
   * Converte graus para radianos.
   */
  degToRad(degrees) {
    return degrees * (Math.PI / 180);
  }
}

export { ObjectCreator };
