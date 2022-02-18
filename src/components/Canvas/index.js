import { useEffect, useContext, useRef } from "react";
import { fabric } from "fabric";
import { Box } from "@chakra-ui/react";

import AppContext from "src/context/AppContext";
import { CommandListToPath, ExtractPathCoords, GetTopLeftCoords } from "src/helpers/PathUtils";

const Canvas = () => {
    const { inPath, setCommandList } = useContext(AppContext);

    useEffect(() => {
        initCanvas();
    }, [inPath]);

    const initCanvas = () => {
        console.log("init canvas");

        let commands = ExtractPathCoords(inPath.current);
        console.log(commands);
        setCommandList(commands);

        let pathString = CommandListToPath(commands);
        console.log(pathString);

        let root = document.querySelector("#canvasCont");

        let canvas = new fabric.Canvas("c", {
            backgroundColor: "cyan",
            preserveObjectStacking: true
        });
        canvas.setWidth(root.clientWidth);
        canvas.setHeight(root.clientHeight);
        canvas.selection = true;
        canvas.hoverCursor = "default";
        canvas.moveCursor = "default";
        //canvas.hasControls = false;
        fabric.Object.prototype.hasControls = false;
        fabric.Object.prototype.hasBorders = false;
        //canvas.setViewportTransform([0.9, 0, 0, 0.9, 50, 50]);
        window.canvas = canvas;

        var svgObj = new fabric.Path(pathString, {
            absolutePositioned: true,
            fill: "#000000",
            stroke: "#000000",
            strokeMiterLimit: 10,
            opacity: 1,
            selectable: false
        });
        canvas.add(svgObj);

        commands.forEach((cmnd, i) => {
            if (cmnd.coords) {
                for (let x = 0; x < cmnd.coords.length; x++) {
                    console.log(`c${i} - ${cmnd.type}`, cmnd.coords[x], cmnd.coords[x + 1]);
                    let obj = new fabric.Rect({
                        id: `c${i}_pt${Math.floor(x / 2)}`,
                        left: Number(cmnd.coords[x]),
                        top: Number(cmnd.coords[x + 1]),
                        strokeWidth: 0,
                        strokeUniform: true,
                        fill: "#ff00ff",
                        selectable: true,
                        width: 17,
                        height: 17,
                        originX: 0.5,
                        originY: 0.5
                    });
                    canvas.add(obj);
                    canvas.bringToFront(obj);
                    x++;
                }
            }
        });

        // canvas.calcOffset();
        // canvas.requestRenderAll();
        // console.log(canvas._objects);

        let updateSvgPath = (targets) => {
            targets.forEach((target) => {
                let { id, left, top } = target;
                if (!id) return;
                let commandIndex = Number(id.split("_")[0].replace(/[a-zA-Z]/g, ""));
                let coordIndex = Number(id.split("_")[1].replace(/[a-zA-Z]/g, ""));
                commands[commandIndex].coords[coordIndex * 2] = left;
                commands[commandIndex].coords[coordIndex * 2 + 1] = top;
            });

            let pos = GetTopLeftCoords(commands);

            let path = CommandListToPath(commands);
            var updatedPath = new fabric.Path(path);
            svgObj.set({
                left: pos.x,
                top: pos.y,
                path: updatedPath.path,
                width: updatedPath.width,
                height: updatedPath.height,
                pathOffset: updatedPath.pathOffset
            });
        };

        canvas.on("object:moving", (e) => {
            console.log(e);
            let { id } = e.target;
            if (!id) return;

            updateSvgPath([e.target]);
        });
        canvas.on("object:modified", (e) => {
            console.log(e);
            canvas.discardActiveObject();
            setCommandList(JSON.parse(JSON.stringify(commands)));
        });
        canvas.on("selection:cleared", ({ deselected }) => {
            if (deselected.length > 1) {
                updateSvgPath(deselected);
            }
            setCommandList(JSON.parse(JSON.stringify(commands)));
        });
    };

    return (
        <Box id="canvasCont" flex={1}>
            <canvas id="c"></canvas>
        </Box>
    );
};

export default Canvas;
