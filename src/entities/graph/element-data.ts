import SystemObject from "../system-description/system-object";

export default interface ElementData  {
    id: string,
    label?: string,
    source?: string,
    target?: string,
    object?: SystemObject,
    updateRequired?: boolean
};
