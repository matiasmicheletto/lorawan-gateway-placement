export const compute = network => {
    
    // For test, draw links
    for(let i = 1; i < network.nodes.length; i++)
            network.links.push([network.nodes[0], network.nodes[i]]);
    
    return network;
};