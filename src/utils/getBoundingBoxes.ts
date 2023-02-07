import { BoundingBoxArrayOfObjects } from "../Interfaces/utils_interfaces"
export const getBoundingBoxes = (response:any):BoundingBoxArrayOfObjects[] | boolean =>{
    const {regions} = response.outputs[0].data
    if(!regions) {
        return false
    }
    const boundingBoxes:BoundingBoxArrayOfObjects[] = regions.map((el:any) => {
        return el.region_info.bounding_box;
    })
    return boundingBoxes
}