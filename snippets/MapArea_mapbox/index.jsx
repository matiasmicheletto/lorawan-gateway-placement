import React, { useState, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import Map, { useControl, Source, Layer } from 'react-map-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { getFeatureProperties } from '../../model/utils';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_API_KEY;

const initialViewState = { // Comodoro rivadavia
    latitude: -45.8641,
    longitude: -67.4977,
    zoom: 12
};

const mapStyle = {
    width: "100%", 
    height: "70vh", 
    marginTop: "20px",    
    //background: `rgba(250,250,250,0.8) url(${loadingMapIcon}) no-repeat center`
};

const DrawControl = props => {
    useControl(() => new MapboxDraw(props),
        ({map}) => {
            map.on('draw.create', props.onCreate);
            map.on('draw.update', props.onUpdate);
            map.on('draw.delete', props.onDelete);
            map.on('click', 'points', e => console.log(e));
            map.on('touchend', 'points', e => console.log(e));
        },
        ({map}) => {
            map.off('draw.create', props.onCreate);
            map.off('draw.update', props.onUpdate);
            map.off('draw.delete', props.onDelete);
        },
        {
            position: props.position
        }
    );
    return null;
};

const geometryStyles = {
    Polygon: {
        type: "fill",
        paint: {
            'fill-color': '#58ACFA',
            'fill-opacity': 0.75,
            'fill-outline-color': "red"
        }
    },
    Point: {
        type: "circle",
        paint: {
            'circle-radius': 5,
            'circle-color': '#007cbf'
        }
    }
};

const LeafletMapArea = ({features, onChange}) => {
    
    const [editingCoords, setEditingCoords] = useState(false);
    const [viewState, setViewState] = useState(initialViewState);

    const handleUpdateInputCoords = () => {
        setInputCoords([
            viewState.latitude, 
            viewState.longitude
        ]);
        setEditingCoords(true);
    };

    const onUpdate = useCallback(e => {
        const newFeatures = {};
        for (const f of e.features) {
            newFeatures[f.id] = f;
            newFeatures[f.id].properties = getFeatureProperties(f);
        }
        onChange(newFeatures);
    }, []);
    
    const onDelete = useCallback(e => {
        onChange(currFeatures => {
            const newFeatures = {...currFeatures};
            for (const f of e.features) {
                delete newFeatures[f.id];
            }
            return newFeatures;
        });
    }, []);

    return (
        <Box>
            {MAPBOX_TOKEN ? 
                <Map
                    initialViewState={initialViewState}
                    {...viewState}
                    onMove={evt => setViewState(evt.viewState)}
                    style={mapStyle}
                    mapStyle="mapbox://styles/mapbox/satellite-v9"
                    attributionControl={false}
                    interactive={true}
                    mapboxAccessToken={MAPBOX_TOKEN}>                    
                        <DrawControl
                            position="top-right"
                            displayControlsDefault={false}
                            controls={{
                                point: true,
                                polygon: true,
                                trash: true
                            }}
                            onCreate={onUpdate}
                            onUpdate={onUpdate}
                            onDelete={onDelete} />
                        {
                            Object.values(features).map(feature => (
                                <Source type="geojson" key={feature.id} data={feature}>
                                    <Layer
                                        id={feature.id}
                                        {...geometryStyles[feature.geometry.type]}/>
                                </Source>
                            ))
                        }
                </Map>
                :
                <Box>
                    No se puede acceder a las funciones de mapas
                </Box>
            }
            <Box display={"flex"} justifyContent={"flex-end"}>
                {
                    !editingCoords && 
                    <Typography 
                        fontSize={12} 
                        fontStyle="italic"
                        onClick={handleUpdateInputCoords}>
                        Lat: {viewState.latitude?.toFixed(6)}, Long: {viewState.longitude?.toFixed(6)}
                    </Typography>
                }
            </Box>
        </Box>
    );
};

export default LeafletMapArea;
