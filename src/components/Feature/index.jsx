import { Marker, Polygon, Polyline } from 'react-leaflet';

const Feature = ({ feature }) => {
    const geometry = feature.geometry;

    switch (geometry.type) {
        case 'Point':
            return (
                <Marker position={geometry.coordinates} />
            );
        case 'Polygon':
            return (
                <Polygon positions={geometry.coordinates} />
            );
        case 'Polyline':
            return (
                <Polyline positions={geometry.coordinates} />
            );
        default:
            return null;
    }
};

export default Feature;