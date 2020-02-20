import { ObjectTypes } from "./object-types";

export default interface SystemObject {
    id: string,
    type: ObjectTypes,
    name: string,
    posX: number,
    posY: number
}
