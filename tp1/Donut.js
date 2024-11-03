import * as THREE from "three";
import { MyApp } from "./MyApp.js";

/*
    A Donut is a 3D object that represents the pink donut from The Simpsons, with a slice removed and placed on a plate.
*/

class Donut extends THREE.Object3D {
  constructor(app) {
    super();
    this.app = app;
    this.type = "Group";

    // Materials
    const donutMaterial = new THREE.MeshStandardMaterial({
      color: 0xD971AC, // Pink frosting color
      roughness: 0.5,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });

    const donutBaseMaterial = new THREE.MeshStandardMaterial({
      color: 0xD2A679, // Donut bread color
      roughness: 0.7,
      side: THREE.DoubleSide,
    });

    const plateMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF, // White plate color
      roughness: 0.9,
      
    });

    // Donut dimensions with a smaller hole
    const donutRadius = 0.4;
    const tubeRadius = 0.2;
    const sliceAngle = Math.PI / 6; 

    // Create donut base with a slice removed
    const donutGeometry = new THREE.TorusGeometry(
      donutRadius * 0.9,
      tubeRadius,
      32,
      64,
      2 * Math.PI - sliceAngle 
    );
    const donutBase = new THREE.Mesh(donutGeometry, donutBaseMaterial);
    donutBase.rotation.x = Math.PI / 2; 
    donutBase.position.y = -0.05; 
    this.add(donutBase);

    // Frosting on top of donut with a slice removed
    const frostingGeometry = new THREE.TorusGeometry(
      donutRadius,
      tubeRadius * 0.9,
      32,
      64,
      Math.PI * 2 - sliceAngle
    );
    const frosting = new THREE.Mesh(frostingGeometry, donutMaterial);
    frosting.position.y = 0.02; // Slightly raised to sit on top of the donut base
    frosting.rotation.x = Math.PI / 2;
    this.add(frosting);

    //Slice cover
    const coverfrostingGeometry = new THREE.CircleGeometry(tubeRadius * 0.9, 32);
    const coverfrosting = new THREE.Mesh(coverfrostingGeometry, donutMaterial);
    coverfrosting.position.set(0.345, 0.02, -0.2);
    coverfrosting.rotation.y = Math.PI / 6;
    this.add(coverfrosting);

    const coverGeometry = new THREE.CircleGeometry(tubeRadius, 32);
    const coverbase = new THREE.Mesh(coverGeometry, donutBaseMaterial);
    coverbase.position.set(0.311, -0.05, -0.1799);
    coverbase.rotation.y = Math.PI / 6;
    this.add(coverbase);

    //Slice cover 2
    const coverfrosting2 = new THREE.Mesh(coverfrostingGeometry, donutMaterial);
    coverfrosting2.position.set(0.4, 0.02, 0);
    this.add(coverfrosting2);

    const coverbase2 = new THREE.Mesh(coverGeometry, donutBaseMaterial);
    coverbase2.position.set(0.36, -0.05, -0.0001);
    this.add(coverbase2);

    // Sprinkles
    const sprinkleColors = [0xFF69B4, 0xFFD700, 0xADFF2F, 0x87CEEB, 0xFF6347];
    const sprinkleCount = 200;
    const minRadius = donutRadius * 0.75; // Minimum radius to keep sprinkles outside the hole
    const maxRadius = donutRadius * 1.1; // Maximum radius to stay within the donut's outer edge

    const sprinkleGeometry = new THREE.CylinderGeometry(0.005, 0.005, 0.04, 8);
    
    for (let i = 0; i < sprinkleCount; i++) {
      const sprinkleMaterial = new THREE.MeshStandardMaterial({
        color: sprinkleColors[Math.floor(Math.random() * sprinkleColors.length)],
        metalness: 0.3,
        roughness: 0.2,
      });
      const sprinkle = new THREE.Mesh(sprinkleGeometry, sprinkleMaterial);
    
      // Randomize position within circular area, but exclude the slice angle
      const radius = Math.random() * (maxRadius - minRadius) + minRadius;
      let angle;
      do {
        angle = Math.random() * (2 * Math.PI);
      } while (angle < sliceAngle || angle > (2 * Math.PI - sliceAngle)); // Avoid placing in slice area
    
      const posX = radius * Math.cos(angle);
      const posZ = radius * Math.sin(angle);
    
      sprinkle.position.set(posX, 0.20, posZ);
      sprinkle.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
    
      this.add(sprinkle);
      sprinkle.castShadow = true;
      sprinkle.receiveShadow = true;
    }

    // Plate under the donut
    const plateRadius = donutRadius * 1.5;
    const plateHeight = 0.05;
    const plateGeometry = new THREE.CylinderGeometry(plateRadius, plateRadius, plateHeight, 32);
    const plate = new THREE.Mesh(plateGeometry, plateMaterial);
    plate.position.y = -0.2; // Position the plate slightly below the donut
    this.add(plate);


    //Plate  with slice
    const plate2 = new THREE.Mesh(plateGeometry, plateMaterial);
    plate2.position.set(-1.3, -0.2, 0);
    plate2.scale.set(0.8, 1, 0.8);
    plate2.rotation.y = Math.PI / 6;
    this.add(plate2);

    //Slice
    const slicedonutGeometry = new THREE.TorusGeometry(
      donutRadius * 0.9,
      tubeRadius,
      32,
      64,
      sliceAngle 
    );
    const slicedonutBase = new THREE.Mesh(slicedonutGeometry, donutBaseMaterial);
    slicedonutBase.rotation.x = Math.PI / 2; 
    slicedonutBase.position.set(-1.65, -0.05, -0.1);
    this.add(slicedonutBase);

    // Frosting on top of donut with a slice removed
    const slicefrostingGeometry = new THREE.TorusGeometry(
      donutRadius,
      tubeRadius * 0.9,
      32,
      64,
      sliceAngle
    );
    const slicefrosting = new THREE.Mesh(slicefrostingGeometry, donutMaterial);
    slicefrosting.position.set(-1.65, 0.02, -0.1); // Slightly raised to sit on top of the donut base
    slicefrosting.rotation.x = Math.PI / 2;
    this.add(slicefrosting);

    //Slice cover
    const slicecoverfrosting = new THREE.Mesh(coverfrostingGeometry, donutMaterial);
    slicecoverfrosting.position.set(-1.304, 0.02, 0.0993);
    slicecoverfrosting.rotation.y = -Math.PI / 6;
    this.add(slicecoverfrosting);

    const slicecoverbase = new THREE.Mesh(coverGeometry, donutBaseMaterial);
    slicecoverbase.position.set(-1.338, -0.05, 0.08);
    slicecoverbase.rotation.y = -Math.PI / 6;
    this.add(slicecoverbase);

    //Slice cover 2
    const slicecoverfrosting2 = new THREE.Mesh(coverfrostingGeometry, donutMaterial);
    slicecoverfrosting2.position.set(-1.25, 0.02, -0.09999);
    this.add(slicecoverfrosting2);

    const slicecoverbase2 = new THREE.Mesh(coverGeometry, donutBaseMaterial);
    slicecoverbase2.position.set(-1.29, -0.05, -0.10001);
    this.add(slicecoverbase2);

    // Sprinkles on slice
    for (let i = 0; i < sprinkleCount / 6; i++) { // Fewer sprinkles for the slice
      const sprinkleMaterial = new THREE.MeshStandardMaterial({
        color: sprinkleColors[Math.floor(Math.random() * sprinkleColors.length)],
        metalness: 0.3,
        roughness: 0.2,
      });
      const sprinkle = new THREE.Mesh(sprinkleGeometry, sprinkleMaterial);

      // Randomize position within the slice's surface
      const radius = Math.random() * (maxRadius - minRadius) + minRadius;
      const angle = Math.random() * sliceAngle;

      const posX = -1.65 + radius * Math.cos(angle);
      const posZ = -0.1 + radius * Math.sin(angle);

      sprinkle.position.set(posX, 0.2, posZ);
      sprinkle.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      this.add(sprinkle);
      sprinkle.castShadow = true;
      sprinkle.receiveShadow = true;
    }
    // Candle materials and geometry
    const candleColor = 0xffb6c1; // Light pink for the candles
    const candleMaterial = new THREE.MeshStandardMaterial({
      color: candleColor,
    });

    // Flame materials for inner and outer cones
    const innerFlameMaterial = new THREE.MeshStandardMaterial({
      color: 0xffa500, // Bright orange for the inner flame
      emissive: 0xffa500,
      emissiveIntensity: 1,
      transparent: true,
      opacity: 0.8,
    });

    const outerFlameMaterial = new THREE.MeshStandardMaterial({
      color: 0xff4500, // Softer red-orange for the outer flame
      emissive: 0xff4500,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.4,
    });

    // Candle properties
    const candleRadius = 0.01;
    const candleHeight = 0.1;
    const flameHeightInner = 0.04;
    const flameRadiusInner = 0.01;
    const flameHeightOuter = 0.06;
    const flameRadiusOuter = 0.02;

    // Positions for 4 candles at equal intervals around the donut
    const numCandles = 5;
    const angleIncrement = (2 * Math.PI - sliceAngle) / numCandles;
    const candleDistanceFromCenter = (minRadius + maxRadius) / 2; // Position between inner and outer edges

    for (let i = 1; i < numCandles ; i++) {
      const angle = i * angleIncrement;
      const x = candleDistanceFromCenter * Math.cos(angle);
      const z = candleDistanceFromCenter * Math.sin(angle);

      // Candle
      const candleGeometry = new THREE.CylinderGeometry(
        candleRadius,
        candleRadius,
        candleHeight,
        16
      );
      const candle = new THREE.Mesh(candleGeometry, candleMaterial);
      candle.position.set(x, 0.2 + candleHeight / 2, z); // Position candle on top of frosting
      this.add(candle);
      candle.castShadow = true;
      candle.receiveShadow = true;

      // Inner flame (brighter core)
      const innerFlameGeometry = new THREE.ConeGeometry(
        flameRadiusInner,
        flameHeightInner,
        32
      );
      const innerFlame = new THREE.Mesh(innerFlameGeometry, innerFlameMaterial);
      innerFlame.position.set(x, 0.2 + candleHeight + flameHeightInner / 2, z); // Position inner flame above candle
      this.add(innerFlame);

      // Outer flame (softer glow)
      const outerFlameGeometry = new THREE.ConeGeometry(
        flameRadiusOuter,
        flameHeightOuter,
        32
      );
      const outerFlame = new THREE.Mesh(outerFlameGeometry, outerFlameMaterial);
      outerFlame.position.set(x, 0.2 + candleHeight + flameHeightOuter / 2, z); // Position outer flame above candle
      this.add(outerFlame);
    }

    donutBase.castShadow = true;
    donutBase.receiveShadow = true;

    frosting.castShadow = true;
    frosting.receiveShadow = true;

    coverfrosting.castShadow = true;
    coverfrosting.receiveShadow = true;

    coverbase.castShadow = true;
    coverbase.receiveShadow = true;

    coverfrosting2.castShadow = true;
    coverfrosting2.receiveShadow = true;

    coverbase2.castShadow = true;
    coverbase2.receiveShadow = true;

    plate.castShadow = true;
    plate.receiveShadow = true;

    plate2.castShadow = true;
    plate2.receiveShadow = true;

    slicedonutBase.castShadow = true;
    slicedonutBase.receiveShadow = true;

    slicefrosting.castShadow = true;
    slicefrosting.receiveShadow = true;

    slicecoverfrosting2.castShadow = true;
    slicecoverfrosting2.receiveShadow = true;

    slicecoverbase2.castShadow = true;
    slicecoverbase2.receiveShadow = true;

    slicecoverbase2.castShadow = true;
    slicecoverbase2.receiveShadow = true;

    slicecoverbase2.castShadow = true;
    slicecoverbase2.receiveShadow = true;

    slicecoverbase2.castShadow = true;
    slicecoverbase2.receiveShadow = true;

    slicecoverbase2.castShadow = true;
    slicecoverbase2.receiveShadow = true;

    slicecoverbase2.castShadow = true;
    slicecoverbase2.receiveShadow = true;


  }
}

Donut.prototype.isGroup = true;

export { Donut };
