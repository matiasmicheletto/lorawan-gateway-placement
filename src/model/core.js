export const compute = network => {

    // For a draft, draw links from node 0 to all other nodes
    network.links = [];
    for(let i = 1; i < network.nodes.length; i++)
        network.links.push([0, i]);
    
    return network;
};