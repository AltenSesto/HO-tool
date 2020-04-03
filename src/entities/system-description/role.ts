import SystemObject from "./system-object";
import { ObjectTypes } from "./object-types";

interface Role extends SystemObject {
    possibleHarms: string[]
}

export interface MishapVictim extends Role {
}

export function isRole(obj: SystemObject): obj is Role {
    return obj.type === ObjectTypes.role;
}

export function isMishapVictim(obj: SystemObject): obj is MishapVictim {
    return isRole(obj) && obj.possibleHarms.length > 0;
}

export default Role;
