export const compute = network => {
    const connections = [ // For testing
        [0, 6, 8],
        [0, 5, 8],
        [0, 4, 8],
        [1, 3, 9],
        [1, 7, 7],
        [1, 9, 7],
        [1, 8, 7]
    ];
    return {
        ...network,
        connections
    };
};