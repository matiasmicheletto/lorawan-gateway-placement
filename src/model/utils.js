import area from "@turf/area";
import length from "@turf/length";
import bbox from "@turf/bbox";

// Average of array
export const arrayAvg = (arr, attr) => arr.reduce((a, b) => a + b[attr], 0) / arr.length;


export const latlng2GeoJson = (latlng, type) => { // latlng = [lat, lng], type = "Point", "Polygon"
    return {
        type: "Feature",
        properties: {},
        geometry: {
            type: type,
            coordinates: latlng
        }
    };
}

export const feature2Text = geometryType => { // Returns a function to convert feature to text
    return { 
        Polygon: f => `Superficie: ${(f.properties.area)?.toFixed(2)} ha`,
        LineString: f => `Longitud: ${(f.properties.length).toFixed(2)} mts.`,
        Point: f => `Lat.: ${f.geometry.coordinates[1].toFixed(6)}, Lon.: ${f.geometry.coordinates[0].toFixed(6)}`
    }[geometryType];
};

export const location2GoggleMap = location => { // Get link to map
    const {lat, lng} = location.properties;    
    return `http://www.google.com/maps/place/${lat},${lng}`;
};

export const geometry2canvas = (geometry, canvasSide) => { // Draw geometry in a pdfmake vector format
    const isPolygon = geometry.type === "Polygon";
    const [minLng, minLat, maxLng, maxLat] = bbox(geometry);
    const height = maxLat-minLat;
    const width = maxLng-minLng;
    const scale = Math.max(height, width);
    const coords = (isPolygon && geometry.coordinates.length === 1) ? geometry.coordinates[0] : geometry.coordinates;    
    return { // PDFmake vector format
        type: 'polyline',
        closePath: isPolygon,
        lineWidth: 2,
        lineColor: 'brown',
        color: isPolygon ? 'green' : 'white',
        fillOpacity: 0.5,
        points: coords.map(c => ({
            x: (c[0]-minLng)/scale*canvasSide, 
            y: (height-(c[1]-minLat))/scale*canvasSide
        }))
    };
};

export const getFeatureProperties = feature => {
    switch(feature.geometry.type){
        case "Polygon":
            return {
                name: "Lote",
                created: Date.now(),
                type: "POLY",
                area: area(feature.geometry)/1e4,
                lat: arrayAvg(feature.geometry.coordinates[0], 1),
                lng: arrayAvg(feature.geometry.coordinates[0], 0)
            }
        case "LineString":
            return {
                name: "Línea",
                created: Date.now(),
                type: "PATH",
                length: length(feature.geometry)*1000,
                lat: arrayAvg(feature.geometry.coordinates, 1),
                lng: arrayAvg(feature.geometry.coordinates, 0)
            };
        case "Point":
            return {
                name: "Marcador",
                created: Date.now(),
                type: "MARKER",
                lat: feature.geometry.coordinates[1],
                lng: feature.geometry.coordinates[0]
            };
        default: 
            return null;
    }
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

export const getFeatureLatLng = feature => {
    // Compute center of bounded box
    const fbox = bbox(feature);    
    return {
        latitude: (fbox[1]+fbox[3])/2,
        longitude: (fbox[0]+fbox[2])/2
    };
};