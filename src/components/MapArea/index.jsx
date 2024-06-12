import { useEffect } from 'react';
import { Box } from '@mui/material';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import L from 'leaflet';

const initialLocation = [ //Comodoro Rivadavia
    -45.8641,
    -67.4977
];

const MapComponent = () => {
    useEffect(() => {
        // Fix Leaflet's default icon issue with Webpack
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
    }, []);

    const handleCreated = (e) => {
        const type = e.layerType;
        const layer = e.layer;
        if (type === 'marker') {
            console.log('Marker created:', layer.getLatLng());
        } else if (type === 'polygon') {
            console.log('Polygon created:', layer.getLatLngs());
        }
    };

    return (
        <Box sx={{mt:3}}>
            <MapContainer center={initialLocation} zoom={13} style={{ height: "75vh", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                <FeatureGroup>
                    <EditControl
                        position="topright"
                        onCreated={handleCreated}
                        draw={{
                            rectangle: false,
                            polyline: false,
                            circle: false,
                            circlemarker: false,
                        }}
                    />
                </FeatureGroup>
            </MapContainer>
        </Box>
    );
};

export default MapComponent;