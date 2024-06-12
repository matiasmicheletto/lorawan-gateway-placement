import React from 'react';
import { AppBar, Box, Toolbar } from "@mui/material";

const toolbarStyle = {
    backgroundColor: "#333333 !important",
    opacity: "0.8"
};

const Component = () => (
    <Box sx={{ flexGrow: 1}} >
        <AppBar position="static" color="primary" sx={toolbarStyle}>
            <Toolbar>
            </Toolbar>
        </AppBar>
    </Box>
);


export default Component;