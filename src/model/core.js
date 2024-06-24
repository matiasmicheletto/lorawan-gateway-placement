export const compute = network => {

    // For testing graphics, draw links from node 0 (gw) to all other nodes
    const result = JSON.parse(JSON.stringify(network)); // Clone network
    const gwIndexes = result.nodes
                            .map((node, index) => node[2] === 'gw' ? index : -1)
                            .filter(index => index !== -1);
    result.links = []; // Reset links
    for(let i = 0; i < result.nodes.length; i++){
        if(result.nodes[i][2] === 'ed'){
            const gwIndex = gwIndexes[Math.floor(Math.random() * gwIndexes.length) | 0];
            result.links.push([gwIndex, i]);
        }
    }
    
    return result;
};