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
     * Carrega as texturas a partir dos dados fornecidos.
     * @param {Object} texturesData 
     */
    loadTextures(texturesData) {
        if (!texturesData) {
            console.log("Nenhuma textura fornecida.");
            return;
        }

        for (const textureId in texturesData) {
            const textureInfo = texturesData[textureId];
            if (textureInfo.filepath) {
                // Carregar a textura e armazená-la
                this.textures[textureId] = this.textureLoader.load(textureInfo.filepath);
            } else {
                console.log(textureId + "não possui um caminho válido.");
            }
        }
    }

    /**
     * Carrega os materiais a partir dos dados fornecidos.
     * @param {Object} materialsData 
     */
    loadMaterials(materialsData) {
        if (!materialsData) {
            console.log("Nenhum material fornecido.");
            return;
        }

        for (let materialId in materialsData) {
            const materialData = materialsData[materialId];
            this.materials[materialId.toLowerCase()] = this.createMaterial(materialData);
        }
    }

    /**
     * Cria um material Three.js a partir dos dados fornecidos.
     * @param {Object} materialData - Dados do material.
     * @returns {THREE.Material} Instância de material Three.js.
     */
    createMaterial(materialData) {
        const materialOptions = {};

        //Cor
        if (materialData.color) {
            materialOptions.color = new THREE.Color(
                materialData.color.r,
                materialData.color.g,
                materialData.color.b
            );
        }

        //Emissividade
        if (materialData.emissive) {
            materialOptions.emissive = new THREE.Color(
                materialData.emissive.r,
                materialData.emissive.g,
                materialData.emissive.b
            );
        }

        //Metalness
        if (materialData.metalness !== undefined) {
            materialOptions.metalness = materialData.metalness; 
        }
        //Roughness
        if (materialData.roughness !== undefined) {
            materialOptions.roughness = materialData.roughness; 
        }

        //Opacidade
        if (materialData.transparent !== undefined) {
            materialOptions.transparent = materialData.transparent;
        }
        //Transparência
        if (materialData.opacity !== undefined) {
            materialOptions.opacity = materialData.opacity;
        }

        //Wireframe
        if (materialData.wireframe !== undefined) {
            materialOptions.wireframe = materialData.wireframe;
        }

        //DoubleSided
        materialOptions.side = THREE.DoubleSide;

       
        if (materialData.textureref) {
            const texture = this.textures[materialData.textureref];
            if (texture) {
                materialOptions.map = texture;

                if (materialData.texlength_s || materialData.texlength_t) {
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.RepeatWrapping; 
                    texture.repeat.set(
                        /*materialData.texlength_s || */  1,
                        /*materialData.texlength_t || */  1
                    );
                }
            } else {
                console.log("Textura referenciada " + materialData.textureref + " não encontrada.");
            }
        }

        // Criar o material
        return new THREE.MeshStandardMaterial(materialOptions);
    }
}

export { MaterialsLoader };
