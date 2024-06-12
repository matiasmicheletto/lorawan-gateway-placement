import { CssBaseline, GlobalStyles } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles"; 
import theme, { globalStyles } from "./themes";
import Home from "./views/Home";
import Navigation from "./components/Navigation";

const App = () =>(
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles styles={globalStyles}/>
            <Navigation/>
            <Home/>
    </ThemeProvider>
);

export default App
