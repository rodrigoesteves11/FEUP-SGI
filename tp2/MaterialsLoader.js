import * as THREE from 'three';

class MaterialsLoader {
    constructor(materialsData, texturesData) {
        this.materials = {}; 
        this.textures = {}; 
        this.textureLoader = new THREE.TextureLoader(); 

        this.loadTextures(texturesData); 
        this.loadMaterials(materialsData); 
    }

    /**
     * Loads textures from the provided data.
     */
    loadTextures(texturesData) {
        if (!texturesData) {
            console.log("No textures provided.");
            return;
        }
    
        for (const textureId in texturesData) {
            const textureInfo = texturesData[textureId];
            if (textureInfo.filepath) {
                let texture;
                if (textureInfo.isVideo) {
                    const video = document.createElement('video');
                    video.src = textureInfo.filepath;
                    video.load();
                    video.loop = true;
                    video.muted = true;
                    video.play();
                    texture = new THREE.VideoTexture(video);
                } else {
                    texture = this.textureLoader.load(textureInfo.filepath);
                }
    
                // Custom mipmaps
                if (textureInfo.mipmaps) {
                    texture.generateMipmaps = false;
                    texture.mipmaps = [];
                    textureInfo.mipmaps.forEach((mipmapPath, level) => {
                        new THREE.TextureLoader().load(mipmapPath, (mipmapTexture) => {
                            const canvas = document.createElement('canvas');
                            const ctx = canvas.getContext('2d');
                            canvas.width = mipmapTexture.image.width;
                            canvas.height = mipmapTexture.image.height;
                            ctx.drawImage(mipmapTexture.image, 0, 0);
                            texture.mipmaps[level] = canvas;
                            texture.needsUpdate = true;
                        });
                    });
                } else {
                    texture.generateMipmaps = true;
                }
    
                this.textures[textureId] = texture;
            } else {
                console.log(`${textureId} invalid path`);
            }
        }
    }
    
    /**
     * Loads materials from the provided data.
     */
    loadMaterials(materialsData) {
        if (!materialsData) {
            console.log("No materials provided.");
            return;
        }

        for (const materialId in materialsData) {
            const materialData = materialsData[materialId];
            this.materials[materialId.toLowerCase()] = this.createMaterial(materialData);
        }
    }

    /**
     * Creates a material from the provided data.
    */
    createMaterial(materialData) {
        const materialOptions = {};

        // Color
        if (materialData.color) {
            materialOptions.color = new THREE.Color(
                materialData.color.r,
                materialData.color.g,
                materialData.color.b
            );
        }

        // Specular
        if (materialData.specular) {
            materialOptions.specular = new THREE.Color(
                materialData.specular.r,
                materialData.specular.g,
                materialData.specular.b
            );
        }

        // Shininess
        if (materialData.shininess !== undefined) {
            materialOptions.shininess = materialData.shininess;
        }

        // Emissive
        if (materialData.emissive) {
            materialOptions.emissive = new THREE.Color(
                materialData.emissive.r,
                materialData.emissive.g,
                materialData.emissive.b
            );
        }

        // Transparency and opacity
        if (materialData.transparent !== undefined) {
            materialOptions.transparent = materialData.transparent;
        }
        if (materialData.opacity !== undefined) {
            materialOptions.opacity = materialData.opacity;
        }

        // Wireframe
        if (materialData.wireframe !== undefined) {
            materialOptions.wireframe = materialData.wireframe;
        }

        // Shading
        if (materialData.shading !== undefined) {
            materialOptions.flatShading = materialData.shading;
        }

        // Texture
        if (materialData.textureref) {
            const texture = this.textures[materialData.textureref];
            if (texture) {
                materialOptions.map = texture;
                materialOptions.map.wrapS = THREE.RepeatWrapping;
                materialOptions.map.wrapT = THREE.RepeatWrapping;
                materialOptions.map.repeat.set(
                    materialData.texlength_s || 1,
                    materialData.texlength_t || 1
                );
            } else {
                console.log("Error: texture not found " + materialData.textureref);
            }
        }

        // Bump Map
        if (materialData.bumpref) {
            const bumpTexture = this.textures[materialData.bumpref];
            if (bumpTexture) {
                materialOptions.bumpMap = bumpTexture;
                materialOptions.bumpScale = materialData.bumpscale || 1.0;
            } else {
                console.log("Error: bump map not found " + materialData.bumpref);
            }
        }

        // Specular Map
        if (materialData.specularref) {
            const specularTexture = this.textures[materialData.specularref];
            if (specularTexture) {
                materialOptions.specularMap = specularTexture;
            } else {
                console.log("Error: specular map not found " + materialData.specularref);
            }    
        }

        // Material side
        materialOptions.side = materialData.twosided ? THREE.DoubleSide : THREE.FrontSide;

        // Create the material
        return new THREE.MeshPhongMaterial(materialOptions);
    }
}

export { MaterialsLoader };