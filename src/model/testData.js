// Export emulated data read from csv files

const testData = { // Lat, Lng from csv file
    nodes: [
        [-45.86169350576915, -67.5168749373741], 
        [-45.86358350471955, -67.5288741673731], 
        [-45.86168350521978, -67.5588749673721], 
        [-45.85168355574923, -67.5088749673761]
    ],
    areas: [],
    links: []
};
// Emulate parsing csv file
export const nodesCSVFile = JSON.stringify(testData.nodes);
export const polygonsCSVFile = JSON.stringify(testData.areas);
export const linksCSVFile = JSON.stringify(testData.links);

