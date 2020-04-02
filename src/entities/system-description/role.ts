import SystemObject from "./system-object";
import { ObjectTypes } from "./object-types";

interface Role extends SystemObject {
    possibleHarms: string[]
}

export function isRole(obj: SystemObject): obj is Role {
    return obj.type === ObjectTypes.role;
}

export default Role;
