import { useEffect } from 'react';
import { Box } from '@mui/material';
import L from 'leaflet';
import 'leaflet-draw';
import { 
    MapContainer, 
    TileLayer, 
    FeatureGroup
} from 'react-leaflet';
import Feature from '../Feature';
import DrawingComponent from '../DrawingComponent';
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

const MapComponent = props => { // Displays geoJSON features with change callbacks

    const {initialLocation, featureCollection, setFeatureCollection} = props;

    useEffect(() => {
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions(iconOptions);
    }, []);

    const handleGeometryCreate = (layer) => {
        const newFeature = layer.toGeoJSON();
        newFeature.id = layer._leaflet_id;
        const newFeatureCollection = {
            type: "FeatureCollection",
            features: [...featureCollection.features, newFeature]
        };
        setFeatureCollection(newFeatureCollection);
    };

    const handleGeometryEdit = (layers, operation) => {
        if(operation === 'delete') {
            const ids = Object.keys(layers._layers);
            setFeatureCollection(prevFeatures => prevFeatures.filter(f => !ids.includes(f.id.toString())));
        } else {
            const editedFeatures = layers.getLayers().map(layer => {
                const editedFeature = layer.toGeoJSON();
                editedFeature.id = layer._leaflet_id;
                return editedFeature;
            });
            setFeatureCollection(prevFeatures => prevFeatures.map(f => {
                const editedFeature = editedFeatures.find(ef => ef.id === f.id);
                return editedFeature ? editedFeature : f;
            }));
        }
    };
 
    return (
        <Box sx={{mt:3}}>
            <MapContainer 
                center={initialLocation} 
                zoom={13} 
                attributionControl={false}
                style={mapContainerStyle}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                <FeatureGroup>
                    <DrawingComponent 
                        onCreate={layer => handleGeometryCreate(layer)}
                        onEdit={layers => handleGeometryEdit(layers, 'edit')}
                        onDelete={layer => handleGeometryEdit(layer, 'delete')}/>
                </FeatureGroup>
                <FeatureGroup>
                    {
                        featureCollection.features.map((feature, index) => (
                            <Feature key={index} feature={feature}/>
                        ))
                    }
                </FeatureGroup>
            </MapContainer>
        </Box>
    );
};


export default MapComponent;