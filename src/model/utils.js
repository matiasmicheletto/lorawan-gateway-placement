import { mapColors } from "./constants";

export const matrix2CSV = matrix => matrix.map(row => row.join(',')).join('\n');

export const tensor2CSV = tensor => tensor.map(matrix => matrix2CSV(matrix)).join('\n\n');

export const csv2Matrix = csv => csv
                            .split('\n')
                            .map(row => row.split(','))
                            .filter(row => row.length > 1)
                            .map(row => row.map(value => {
                                const number = parseFloat(value);
                                return isNaN(number) ? value : number;
                            }));

export const csv2Tensor = csv => csv
                            .split('\n\n')
                            .map(matrix => csv2Matrix(matrix));

const getRandomId = () => Math.floor(Math.random() * 10000);

export const network2GeoJSON = network => {

    const eds = network.end_devices.map((ed, index) => ({
        type: "Feature",
        properties: {
            id: index,
            type: 'ed',
            ufs: ed.ufs
        },
        geometry:{
            type: "Point",
            coordinates: ed.location
        }
    }));

    const gws = network.gateways.map((gw, index) => ({
        type: "Feature",
        properties: {
            id: index,
            type: 'gw',
            sf_ranges: gw.sf_ranges
        },
        geometry:{
            type: "Point",
            coordinates: gw.location
        }
    }));

    const points = [...eds, ...gws];
    const polygons = [];

    network.gateways.forEach((gw, index) => {
        const sfPolys = new Array(gw.sf_ranges.length); // Polygons for each SF
        gw.sf_ranges
                .forEach( (sfRange, sfIdx) => {
                    sfPolys[sfIdx] = {
                        type: "Feature",
                        properties: {
                            id: index,
                            name: `sf${sfIdx+7}`,
                            color: mapColors.sfs[sfIdx],
                            type: 'sf'
                        },
                        geometry:{
                            type: "Polygon",
                            coordinates: sfRange
                        }
                    };
                });
        polygons.push(...sfPolys);
    });

    const links = network.connections.map((connection, cIndex) => ({
        type: "Feature",
        properties: {
            id: getRandomId(),
            color: mapColors.sfs[connection[2]-7],
            type: 'link'
        },
        geometry:{
            type: "Polyline",
            coordinates: [
                network.gateways[connection[0]].location,
                network.end_devices[connection[1]].location 
            ]
        }
    }));

    return {
        type: "FeatureCollection", 
        features: [...points, ...polygons , ...links]
    };
};

export const geoJSON2Network = geoJSON => {

    const end_devices = geoJSON.features
                            .filter(f => f.properties.type === "ed")
                            .map(f => ({
                                location: f.geometry.coordinates,
                                ufs: f.properties.ufs
                            }));

    const gateways = geoJSON.features
                            .filter(f => f.properties.type === "gw")
                            .map(f => ({
                                location: f.geometry.coordinates,
                                sf_ranges: f.properties.sf_ranges
                            }));

    const connections = geoJSON.features
                            .filter(f => f.properties.type === "link")
                            .map(f => {
                                const gwIndex = gateways.findIndex(gw => gw.location === f.geometry.coordinates[0]);
                                const edIndex = gateways.findIndex(ed => ed.location === f.geometry.coordinates[1]);
                                return [gwIndex, edIndex];
                            });

    return {gateways, end_devices, connections};
};

export const layer2GeoJSON = layer => { // Adapt format to system model
    const feature = layer.toGeoJSON();
    feature.geometry.coordinates = feature.geometry.coordinates.reverse();
    feature.properties.type = 'ed';
    feature.id = layer._leaflet_id;
    return feature;
};

export const latlng2Canvas = (lat, lng, map) => { // lat, lng in degrees
    const latRad = lat * Math.PI / 180;
    const lngRad = lng * Math.PI / 180;
    const x = (lngRad + Math.PI) * map.getSize().x / (2 * Math.PI);
    const y = (Math.PI - Math.log(Math.tan(Math.PI / 4 + latRad / 2))) * map.getSize().y / (2 * Math.PI);
    return {x, y};
};

export const haversine = (pos1, pos2) => { // pos:{lat, lng}
    // https://stackoverflow.com/questions/639695/how-to-convert-latitude-or-longitude-to-meters
    const R = 6378.137; // Radius of Earth
    const dLat = pos2.lat * Math.PI / 180 - pos1.lat * Math.PI / 180;
    const dLon = pos2.lng * Math.PI / 180 - pos1.lng * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(pos1.lat * Math.PI / 180) * Math.cos(pos2.lat * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const dist = (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
    return dist;
};
