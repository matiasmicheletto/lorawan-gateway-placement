export const csv2Matrix = csv => { // csv string to matrix
    const regex = /\[(-?\d+\.\d+),(-?\d+\.\d+)\]/g;
    const matrix = [];
    let match = regex.exec(csv);
    while(match) {
        matrix.push([parseFloat(match[1]), parseFloat(match[2])]);
        match = regex.exec(csv);
    }
    return matrix;
};
    
export const network2GeoJSON = network => { // {nodes:[], areas:[], links:[]} using [lng,lat] format
    const features = [];
    Object.keys(network).forEach(key => 
        features.push(...network[key].map((geometry, index) => ({
            type: "Feature",
            properties: {id: index},
            geometry:{
                type: key === "nodes" ? "Point" : key === "areas" ? "Polygon" : "Polyline",
                coordinates: geometry
            }
        })))
    );

    return {type: "FeatureCollection", features};
};

export const geoJSON2network = geoJSON => { // {nodes:[], areas:[]} using [lng,lat] format
    const nodes = geoJSON.features.filter(f => f.geometry.type === "Point").map(f => f.geometry.coordinates);
    const areas = geoJSON.features.filter(f => f.geometry.type === "Polygon").map(f => f.geometry.coordinates);
    const links = geoJSON.features.filter(f => f.geometry.type === "Polyline").map(f => f.geometry.coordinates);
    return {nodes, areas, links};
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
