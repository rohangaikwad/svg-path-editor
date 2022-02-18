console.clear();
let x = "M0,0 0,50 L100,0 100 100 0 100 z";

let y = x.replaceAll(",", " ");
console.log(y);

y = y.split(" ");
console.log(y);
y = y.map((c) => {
    if (/^(?=.*[a-zA-Z])(?=.*[0-9])/.test(c)) {
        c = c.split(/([a-zA-Z])/);
    }
    return c;
});
y = y.flat().filter((_x) => _x !== "");
console.log(y.flat());

let commandList = [];

let isLetter = (char) => /[a-zA-Z]/.test(char);

for (let i = 0; i < y.length; i++) {
    let p = y[i];
    let command = {};
    if (isLetter(p)) {
        command["type"] = p;
        i++;

        let coords = [];

        while (i < y.length && !isLetter(y[i])) {
            coords.push(y[i]);
            i++;
        }

        if (coords.length > 0) {
            command["coords"] = coords;
        }

        commandList.push(command);
        i--;
    }
}

console.log(commandList);

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
console.log(processedCommandList);
