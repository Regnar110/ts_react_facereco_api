"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateFaceLocation = void 0;
const calculateFaceLocation = (data, width, height) => {
    const image = document.getElementById("inputimage");
    // const width = +image.width
    // const height = +image.height
    const arrayOfBoxes = data.map(box => {
        return {
            top_row: box.top_row * height,
            left_col: box.left_col * width,
            right_col: width - (box.right_col * width),
            bottom_row: height - (box.bottom_row * height)
        };
    });
    return arrayOfBoxes;
};
exports.calculateFaceLocation = calculateFaceLocation;
