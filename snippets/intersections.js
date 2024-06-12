// Example nodes
const node1 = [0, 0];
const node2 = [5, 5];

// Example polygons (list of polygons, each represented by a list of [x, y] arrays)
const polygons = [
    [[1, 1], [1, 4], [4, 4], [4, 1], [1, 1]],  // Square polygon
    [[6, 6], [6, 8], [8, 8], [8, 6], [6, 6]]   // Another square polygon
];

// Function to check if two nodes can be connected
function canConnect(node1, node2, polygons) {
    const line = turf.lineString([node1, node2]);
    for (let polyCoords of polygons) {
        const polygon = turf.polygon([polyCoords]);
        if (turf.lineIntersect(line, polygon).features.length > 0) {
            return false;
        }
    }
    return true;
}