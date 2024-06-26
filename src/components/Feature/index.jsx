import L from 'leaflet';
import { Marker, Polygon, Polyline } from 'react-leaflet';
import edIconURL from '../../assets/icons/ed-icon.png';
import gwIconURL from '../../assets/icons/gw-icon.png';


const iconOptions = {
    iconSize: [15, 15],
    iconAnchor: [7.5, 7.5]
};

const edIcon = new L.Icon({iconUrl: edIconURL, ...iconOptions});
const gwIcon = new L.Icon({iconUrl: gwIconURL, ...iconOptions});

const iconTypes = {
    'ed': edIcon,
    'gw': gwIcon
};

const getFeatureComponent = (coordinates, icon = null, polyColor = "") => ({
    'Point': <Marker position={coordinates} icon={icon}/>,
    'Polygon': <Polygon positions={coordinates} color={polyColor}/>,
    'Polyline': <Polyline positions={coordinates} color={polyColor} />
});

const Feature = ({ feature }) => {
    const {type, coordinates} = feature.geometry;
    const nType = feature.properties.type;
    const icon = nType ? iconTypes[nType] : null;
    const color = feature.properties.color;
    return getFeatureComponent(coordinates, icon, color)[type];
};

export default Feature;