"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBoundingBoxes = void 0;
const getBoundingBoxes = (response) => {
    const { regions } = response.outputs[0].data;
    if (!regions) {
        return false;
    }
    const boundingBoxes = regions.map((el) => {
        return el.region_info.bounding_box;
    });
    return boundingBoxes;
};
exports.getBoundingBoxes = getBoundingBoxes;
