import { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import MainView from "../../components/MainView";
import background from "../../assets/backgrounds/background3.jpg";
import LeafletMapArea from "../../components/LeafletMapArea";
import { compute } from "../../model/core.js";
import { 
    csv2Matrix, 
    network2GeoJSON,
    geoJSON2network 
} from "../../model/utils";
import {
    nodesCSVFile,
    polygonsCSVFile,
    linksCSVFile
} from "../../model/testData";


const initialLocation = [-45.86168350577915, -67.5188749673741]; // Comodoro Rivadavia, Argentina
const networkData = {
    nodes: csv2Matrix(nodesCSVFile),
    areas: csv2Matrix(polygonsCSVFile),
    links: csv2Matrix(linksCSVFile)
};

const initialFeatureCollection = network2GeoJSON(networkData);

const View = () => {

    const [featureCollection, setFeatureCollection] = useState(initialFeatureCollection);

    const handleCompute = () => {
        const network = geoJSON2network(featureCollection);
        const resultNetwork = compute(network);
        console.log(resultNetwork);
        const geoJSONResult = network2GeoJSON(resultNetwork);
        setFeatureCollection(geoJSONResult);
    };

    return (
        <MainView background={background}>
            <LeafletMapArea 
                initialLocation={initialLocation}
                featureCollection={featureCollection}
                setFeatureCollection={setFeatureCollection}/>
            <Box sx={{height: "10vh"}}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    sx={{position: "absolute", bottom: "10px", right: "10px"}}
                    onClick={handleCompute}>
                        Compute
                </Button>
            </Box>
        </MainView>
    );
};

export default View;