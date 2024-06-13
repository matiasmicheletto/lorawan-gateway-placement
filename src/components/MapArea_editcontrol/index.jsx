import { useEffect } from 'react';
import { Box } from '@mui/material';
import L from 'leaflet';
import { 
    MapContainer, 
    TileLayer, 
    FeatureGroup 
} from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import iconRetinaUrl from '../../assets/icons/marker-icon-2x.png';
import iconUrl from '../../assets/icons/marker-icon.png';
import shadowUrl from '../../assets/icons/marker-shadow.png';


const iconOptions = {
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
    iconSize: [15, 15],
    iconAnchor: [7.5, 7.5]
};

const mapContainerStyle = { 
    height: "75vh", 
    width: "100%" 
};

const drawOptions = {
    rectangle: false,
    polyline: false,
    circle: false,
    circlemarker: false,
};

const MapComponent = ({initialLocation, features, setFeatures}) => {

    useEffect(() => {
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions(iconOptions);
    }, []);

    const handleCreated = layer => 
        setFeatures((prevFeatures => [
            ...prevFeatures, 
            layer.toGeoJSON()
        ]));
 
    return (
        <Box sx={{mt:3}}>
            <MapContainer 
                center={initialLocation} 
                zoom={13} 
                style={mapContainerStyle}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                    <FeatureGroup>
                        <EditControl
                            position="topright"
                            onCreated={e => handleCreated(e.layer)}
                            draw={drawOptions}/>
                    </FeatureGroup>
            </MapContainer>
        </Box>
    );
};


export default MapComponent;