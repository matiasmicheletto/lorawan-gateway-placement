import { useEffect } from 'react';
import L from 'leaflet';
import { Box } from '@mui/material';
import 'leaflet-draw';
import { 
    MapContainer, 
    TileLayer, 
    FeatureGroup
} from 'react-leaflet';
import Feature from '../Feature';
import DrawingComponent from '../DrawingComponent';
import { layer2GeoJSON } from '../../model/utils';
import edIconURL from '../../assets/icons/ed-icon.png'; // Default icon
import shadowUrl from '../../assets/icons/marker-shadow.png';
import iconRetinaUrl from '../../assets/icons/marker-icon-2x.png';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

const iconOptions = {
    iconUrl: edIconURL,
    shadowUrl,
    iconRetinaUrl,
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
        const newFeature = layer2GeoJSON(layer);
        const newFeatureCollection = {
            type: "FeatureCollection",
            features: [...featureCollection.features, newFeature]
        };
        console.log(newFeature.geometry.coordinates);
        setFeatureCollection(newFeatureCollection);
    };

    const handleGeometryEdit = (layers, operation) => {
        if(operation === 'delete') {
            const ids = Object.keys(layers._layers);
            setFeatureCollection(prevFeatureCollection => {
                prevFeatureCollection.features = prevFeatureCollection.features.filter(f => !ids.includes(f.id));
                return prevFeatureCollection;
            });
        } else {
            const editedFeatures = layers.getLayers()
                .map(layer => {
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
        <Box sx={{m:0}}>
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
                        onDelete={layers => handleGeometryEdit(layers, 'delete')}/>
                </FeatureGroup>
                <FeatureGroup>
                    {
                        featureCollection.features.map((feature, index) => (
                            <Feature key={index} feature={feature}/>
                        ))
                    }
                </FeatureGroup>
                {/*<GeoJSON data={featureCollection} key={JSON.stringify(featureCollection.features)}/>*/}
            </MapContainer>
        </Box>
    );
};


export default MapComponent;