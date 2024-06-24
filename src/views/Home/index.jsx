import { useState } from 'react';
import { Box, Button } from '@mui/material';
import MainView from "../../components/MainView";
import background from "../../assets/backgrounds/background3.jpg";
import MapComponent from "../../components/LeafletMapArea"; // CanvasMapArea
import { compute } from "../../model/core.js";
import { 
    csv2Matrix,
    network2GeoJSON,
    geoJSON2Network 
} from "../../model/utils";
import {
    nodesCSVFile,
    linksCSVFile
} from "../../model/testData";


const initialLocation = [-45.86168350577915, -67.5188749673741]; // Comodoro Rivadavia, Argentina
const network = {
    nodes: csv2Matrix(nodesCSVFile),
    links: csv2Matrix(linksCSVFile)
};

const initialFeatureCollection = network2GeoJSON(network);

const View = () => {

    const [featureCollection, setFeatureCollection] = useState(initialFeatureCollection);

    const handleCompute = () => {
        const network = geoJSON2Network(featureCollection);
        const resultNetwork = compute(network);
        const geoJSONResult = network2GeoJSON(resultNetwork);
        setFeatureCollection(geoJSONResult);
    };

    return (
        <MainView background={background}>
            <MapComponent 
                initialLocation={initialLocation}
                featureCollection={featureCollection}
                setFeatureCollection={setFeatureCollection}/>
            
            <Box sx={{mt:1, textAlign: "right"}}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleCompute}>
                        Calcular
                </Button>
            </Box>
        </MainView>
    );
};

export default View;