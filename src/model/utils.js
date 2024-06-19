export const matrix2CSV = matrix => matrix.map(row => row.join(',')).join('\n');

export const csv2Matrix = csv => csv
                            .split('\n')
                            .map(row => row.split(','))
                            .filter(row => row.length > 1)
                            .map(row => row.map(cell => parseFloat(cell)));


export const network2GeoJSON = network => { // {nodes:[], links:[]} -> {type: "FeatureCollection", features: []}
    const nodes = network.nodes.map((node, index) => ({
                type: "Feature",
                properties: {id: index},
                geometry:{
                    type: "Point",
                    coordinates: node
                }
            }));
    const links = network.links.map(link => ({
                type: "Feature",
                properties: {},
                geometry:{
                    type: "Polyline",
                    coordinates: [network.nodes[link[0]], network.nodes[link[1]]]
                }
            }));
    return {
        type: "FeatureCollection", 
        features: [...nodes, ...links]
    };
};

export const geoJSON2Network = geoJSON => { // {type: "FeatureCollection", features: []} -> {nodes:[], links:[]}
    const nodes = geoJSON.features
                            .filter(f => f.geometry.type === "Point")
                            .map(f => f.geometry.coordinates);
    const links = geoJSON.features
                            .filter(f => f.geometry.type === "LineString")
                            .map(f => f.geometry.coordinates
                                            .map(c => nodes.indexOf(c))
                                );
    return {nodes, links};
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
