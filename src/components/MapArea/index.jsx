import { 
    useEffect, 
    useRef, 
    useState 
} from 'react';
import { Box } from '@mui/material';
import L from 'leaflet';
import 'leaflet-draw';
import { 
    MapContainer, 
    TileLayer, 
    FeatureGroup,
    Marker,
    useMapEvent,
    useMap
} from 'react-leaflet';
import DrawingComponent from '../DrawingComponent';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { latlng2CanvasXY } from '../../model/utils';
import iconRetinaUrl from '../../assets/icons/marker-icon-2x.png';
import iconUrl from '../../assets/icons/marker-icon.png';
import shadowUrl from '../../assets/icons/marker-shadow.png';


const networkData = {
    nodes: [
        {id: 1, label: 'Node 1', lat: 150, lng: 100},
        {id: 2, label: 'Node 2', lat: 410, lng: 412},
        {id: 3, label: 'Node 3', lat: 320, lng: 358},
        {id: 4, label: 'Node 4', lat: 250, lng: 450},
    ]
};

const nodes = networkData.nodes.map(node => latlng2CanvasXY(node));
let mapBounds, mapCenter;

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

const canvasStyle = {
    position: 'absolute',
    pointerEvents: 'none',
    zIndex: '1000'

};

const getBounds = bounds => ({
    maxLat: bounds._southWest.lat,
    minLat: bounds._northEast.lat,
    maxLng: bounds._southWest.lng,
    minLng: bounds._northEast.lng
});

const MapChangeHandler = ({ onChange }) => {

    const map = useMap();

    useMapEvent('move', event => {
        if(event.originalEvent){
            const mX = event.originalEvent.movementX;
            const mY = event.originalEvent.movementY;
            onChange({
                type: 'move',
                payload: {mX, mY}
            });
        }
    });

    useEffect(() => {
        if (!map) return;
        
        mapBounds = getBounds(map.getBounds());
        const mapCenter = map.getCenter();

        const onZoomEnd = event => {
            const newMapBounds = getBounds(map.getBounds());
            const newMapCenter = map.getCenter();
            onChange({ 
                type: 'zoom',
                payload: {newMapBounds, newMapCenter}
            });
            mapBounds = newMapBounds;
            mapCenter = newMapCenter;
        };

        map.on("zoomend", onZoomEnd);

        return () => {
            map.off("zoomend", onZoomEnd);
        };
    }, [map, onChange]);
    
    return null;
};

const MapComponent = props => {

    const {initialLocation, features, setFeatures} = props;

    const canvasRef = useRef();

    useEffect(() => {
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions(iconOptions);
        handleMapChange({type: 'move', payload: {mX: 0, mY: 0}});
    }, []);

    const onMapReady = map => {
        const canvas = canvasRef.current;
        canvas.width = map.target._size.x;
        canvas.height = map.target._size.y;
    };

    const handleMapChange = change => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        const payload = change.payload;
        if(change.type === 'move'){
            const {mX, mY} = payload;
            nodes.forEach(node => {
                node.x += mX;
                node.y += mY;
                ctx.fillRect(node.x, node.y, 10, 10);
                ctx.stroke();
            });
        }
        if(change.type === 'zoom'){
            nodes.forEach(node => {
                const scaleLat = (mapBounds.maxLat + mapBounds.minLat) / (payload.newMapBounds.maxLat - payload.newMapBounds.minLat);
                const scaleLng = (mapBounds.maxLng + mapBounds.minLng) / (payload.newMapBounds.maxLng - payload.newMapBounds.minLng);
                node.x = (ctx.canvas.width/2 - node.x) * scaleLat + ctx.canvas.width/2;
                node.y = (ctx.canvas.height/2 - node.y) * scaleLng + ctx.canvas.height/2;
                ctx.fillRect(node.x, node.y, 10, 10);
                ctx.stroke();
            });
        }
    };

    const handleGeometryCreate = (layer) => {
        const newFeature = layer.toGeoJSON();
        newFeature.id = layer._leaflet_id;
        setFeatures(prevFeatures => [...prevFeatures, newFeature]);
    };

    const handleGeometryEdit = (layers, operation) => {
        if(operation === 'delete') {
            const ids = Object.keys(layers._layers);
            setFeatures(prevFeatures => prevFeatures.filter(f => !ids.includes(f.id.toString())));
        } else {
            const editedFeatures = layers.getLayers().map(layer => {
                const editedFeature = layer.toGeoJSON();
                editedFeature.id = layer._leaflet_id;
                return editedFeature;
            });
            setFeatures(prevFeatures => prevFeatures.map(f => {
                const editedFeature = editedFeatures.find(ef => ef.id === f.id);
                return editedFeature ? editedFeature : f;
            }));
        }
    };
 
    return (
        <Box sx={{mt:3}}>
            <canvas ref={canvasRef} style={canvasStyle}/>
            <MapContainer 
                whenReady={map => onMapReady(map)}
                center={initialLocation} 
                zoom={13} 
                attributionControl={false}
                style={mapContainerStyle}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                <MapChangeHandler onChange={handleMapChange} />
                <FeatureGroup>
                    <DrawingComponent 
                        onCreate={layer => handleGeometryCreate(layer)}
                        onEdit={layers => handleGeometryEdit(layers, 'edit')}
                        onDelete={layer => handleGeometryEdit(layer, 'delete')}/>
                </FeatureGroup>
                <FeatureGroup>
                    {
                        features.map((feature, index) => (
                            feature.geometry.type === 'Point' && <Marker key={index} position={feature.geometry.coordinates}/>
                        ))
                    }
                </FeatureGroup>
            </MapContainer>
        </Box>
    );
};


export default MapComponent;