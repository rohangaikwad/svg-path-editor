import React, { useRef, useState } from "react";

import Canvas from "./components/Canvas";
import Editor from "./components/Editor";
import { Box } from "@chakra-ui/react";
import { AppContextProvider } from "./context/AppContext";

const App = () => {
    const inPath = useRef("M200 200 L 400 200 400 400 200 400z");
    const [outPath, setOutPath] = useState("");
    const [commandList, setCommandList] = useState([]);

    return (
        <AppContextProvider
            value={{
                inPath,
                outPath,
                setOutPath,
                commandList,
                setCommandList
            }}
        >
            <Box flex={1} className="app container">
                <Editor />
                <Canvas />
            </Box>
        </AppContextProvider>
    );
};

export default App;
