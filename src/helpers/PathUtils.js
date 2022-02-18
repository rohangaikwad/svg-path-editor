export const ExtractPathCoords = (pathString) => {
    let pathArr = pathString.replaceAll(",", " ");

    pathArr = pathArr.split(" ");
    pathArr = pathArr.map((c) => {
        if (/^(?=.*[a-zA-Z])(?=.*[0-9])/.test(c)) {
            c = c.split(/([a-zA-Z])/);
        }
        return c;
    });
    pathArr = pathArr.flat().filter((_x) => _x !== "");

    let commandList = [];

    let isLetter = (char) => /[a-zA-Z]/.test(char);

    for (let i = 0; i < pathArr.length; i++) {
        let p = pathArr[i];
        let command = {};
        if (isLetter(p)) {
            command["type"] = p;
            i++;

            let coords = [];

            while (i < pathArr.length && !isLetter(pathArr[i])) {
                coords.push(pathArr[i]);
                i++;
            }

            if (coords.length > 0) {
                command["coords"] = coords;
            }

            commandList.push(command);
            i--;
        }
    }

    let processedCommandList = [];

    commandList.forEach((cmnd) => {
        if (cmnd.type.toLowerCase() === "m" && cmnd.coords.length > 2) {
            processedCommandList.push({
                type: "M",
                coords: [cmnd.coords[0], cmnd.coords[1]]
            });

            for (let i = 2; i < cmnd.coords.length; i++) {
                processedCommandList.push({
                    type: "L",
                    coords: [cmnd.coords[i], cmnd.coords[i + 1]]
                });
                i++;
            }
        } else if (cmnd.type === "L" || cmnd.type === "l") {
            for (let i = 0; i < cmnd.coords.length; i++) {
                processedCommandList.push({
                    type: "L",
                    coords: [cmnd.coords[i], cmnd.coords[i + 1]]
                });
                i++;
            }
        } else {
            processedCommandList.push(cmnd);
        }
    });
    return processedCommandList;
};

export const CommandListToPath = (list) => {
    let string = "";
    list.forEach(({ type, coords }) => {
        string += `${type} `;
        coords?.forEach((c) => {
            string += `${c} `;
        });
    });
    return string.trim();
};

export const GetTopLeftCoords = (list) => {
    let x = list[0].coords[0],
        y = list[0].coords[1];

    list.forEach((cmnd, i) => {
        if (cmnd.coords) {
            for (let j = 0; j < cmnd.coords.length; j++) {
                let ptx = cmnd.coords[j];
                let pty = cmnd.coords[j + 1];
                if (ptx < x) x = ptx;
                if (pty < y) y = pty;
                j++;
            }
        }
    });
    return { x: Number(x), y: Number(y) };
};
