import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet-draw';
import { useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

const DrawingComponent = ({ onCreate, onEdit, onDelete }) => {
    const map = useMap();
    const drawnItems = useRef(new L.FeatureGroup());
  
    useEffect(() => {
  
        map.addLayer(drawnItems.current);

        const drawControl = new L.Control.Draw({
            edit: {
                featureGroup: drawnItems.current,
            },
            draw: {
                polyline: false,
                rectangle: false,
                circle: false,
                circlemarker: false,
            },
        });
  
        map.addControl(drawControl);
  
        map.on(L.Draw.Event.CREATED, e => {
            const layer = e.layer;
            drawnItems.current.addLayer(layer);
            onCreate(layer);
        });

        map.on(L.Draw.Event.EDITED, e => {
            onEdit(e.layers);
        });

        map.on(L.Draw.Event.DELETED, e => {
            drawnItems.current.removeLayer(e.layers);
            onDelete(e.layers);
        });
  
        return () => {
            map.off(L.Draw.Event.CREATED);
            map.off(L.Draw.Event.EDITED);
            map.off(L.Draw.Event.DELETED);
            map.removeControl(drawControl);
            map.removeLayer(drawnItems.current);
        };
    }, [map, onCreate, onEdit, onDelete]);
  
    return null;
};

export default DrawingComponent;