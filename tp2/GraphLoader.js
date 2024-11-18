class GraphLoader {
    constructor(app) {
        this.app = app; 
        this.nodes = {}; 
    }

    /**
     * Lê e organiza os dados do grafo
     * @param {Object} graph Estrutura completa do grafo
     */
    read(graph) {
        if (!graph || !graph.rootid) {
            console.log("O grafo não possui um 'rootid' válido.");
            return;
        }

        for (const nodeId in graph) {
            if (nodeId === "rootid") continue; // Passar o rootid diretamente

            const nodeData = graph[nodeId];

            this.nodes[nodeId] = {
                type: nodeData.type || "node",
                transforms: nodeData.transforms || [],
                materialRef: nodeData.materialref?.materialId?.toLowerCase() || null,
                children: nodeData.children || {},
                castShadows: nodeData.castshadows || false,
                receiveShadows: nodeData.receiveshadows || false
            };
        }
    }
}

export { GraphLoader };
