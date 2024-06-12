import MainView from "../../components/MainView";
import background from "../../assets/backgrounds/background3.jpg";
import MapArea from "../../components/MapArea";

const View = () => (
    <MainView background={background}>
        <MapArea/>
    </MainView>
)

export default View;