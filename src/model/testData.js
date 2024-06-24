import { matrix2CSV } from './utils.js';

const nodes = [
    [-45.86169350576915, -67.5168749373741, 'gw'], 
    [-45.86358350471955, -67.5288741673731, 'ed'], 
    [-45.86168350521978, -67.5588749673721, 'ed'], 
    [-45.85168355574923, -67.5088749673761, 'ed'],
    [-45.84894578542665, -67.50125285061331, 'ed'],
    [-45.860778064410276, -67.49224429688863, 'ed'],
    [-45.8360778064410276, -67.47124429688863, 'gw'],
    [-45.876115907441715, -67.50981632774027, 'ed'],
    [-45.87465597266164, -67.52163159469177, 'ed'],
    [-45.832123993807876, -67.48072988400934, 'ed'],
    [-45.8346468171302, -67.47912919198014, 'ed'],
    [-45.83611207521077, -67.48752700046528, 'ed'],
    [-45.841777433274046, -67.47808128154443, 'ed']
];

const initialLinks = [
    //[0, 1],
    //[0, 3]
];

// Emulate parsing csv file
export const nodesCSVFile = matrix2CSV(nodes);
export const linksCSVFile = matrix2CSV(initialLinks);

