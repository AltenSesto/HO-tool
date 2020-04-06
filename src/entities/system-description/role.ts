import SystemObject from "./system-object";
import { ObjectTypes } from "./object-types";
import { HazardDetails } from "../hazard-population/hazard-details";

interface Role extends SystemObject {
    possibleHarms: string[];
    hazards: HazardDetails[];
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
