import { useState } from 'react';
import MainView from "../../components/MainView";
import background from "../../assets/backgrounds/background3.jpg";
import MapArea from "../../components/MapArea";

const initialLocation = [-45.86168350577915, -67.5188749673741];

const View = () => {

    const [features, setFeatures] = useState([]);

    //console.clear();
    //console.table(features.map(f => ({type: f.geometry.type, id: f.id})));

    return (
        <MainView background={background}>
            <MapArea 
                initialLocation={initialLocation}
                features={features}
                setFeatures={setFeatures}/>
        </MainView>
    );
};

export default View;