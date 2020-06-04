import { HazardCategory } from "../hazard-description-categorization/hazard-category";
import SystemObject from "../system-description/system-object";
import { ObjectTypes } from "../system-description/object-types";

interface NameIdPair {
    id: string;
    name: string;
}

export default interface Hazard {
    id: number;
    harmTruthmaker: string;
    description: string;
    mishapVictim: NameIdPair;
    mishapVictimEnvObj: NameIdPair;
    exposure: NameIdPair;
    hazardElement: NameIdPair;
    hazardElementEnvObj: NameIdPair;
    category?: HazardCategory;
    expansion?: {};
}

export function isKindInHazard(kind: SystemObject, hazard: Hazard) {
    return hazard.hazardElementEnvObj.id === kind.id ||
        hazard.mishapVictimEnvObj.id === kind.id;
}

export function isRoleInHazard(role: SystemObject, hazard: Hazard) {
    return hazard.mishapVictim.id === role.id ||
        hazard.hazardElement.id === role.id;
}

export function isRelatorInHazard(relator: SystemObject, hazard: Hazard) {
    return hazard.exposure.id === relator.id;
}

export function getIsSystemObjectInHazard(entity: SystemObject) {
    switch (entity.type) {
        case ObjectTypes.kind:
            return (hazard: Hazard) => isKindInHazard(entity, hazard);
        case ObjectTypes.relator:
            return (hazard: Hazard) => isRelatorInHazard(entity, hazard);
        case ObjectTypes.role:
            return (hazard: Hazard) => isRoleInHazard(entity, hazard);
    }
}
