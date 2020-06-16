import Hazard, { isRelatorInHazard, isRoleInHazard, isKindInHazard, getIsSystemObjectInHazard } from '../../../entities/hazard-population/hazard';
import { SystemModelActionTypes, CREATE_HAZARD, UPDATE_HAZARD, DELETE_HAZARD, RENAME_SYSTEM_OBJECT, DELETE_CONNECTION, DELETE_SYSTEM_OBJECT } from '../types';
import SystemObject from '../../../entities/system-description/system-object';
import { ObjectTypes } from '../../../entities/system-description/object-types';

export function hazardsReducer(state: Hazard[], action: SystemModelActionTypes): Hazard[] {
    switch (action.type) {
        case CREATE_HAZARD:
            return state.concat(action.payload);
        case UPDATE_HAZARD:
            return state.map(e => e.id === action.payload.id ? action.payload : e);
        case DELETE_HAZARD:
            return state.filter(e => e.id !== action.payload.id);
        case RENAME_SYSTEM_OBJECT:
            const transform = getHazardTransform(action.payload);
            return state.map(transform);
        case DELETE_CONNECTION:
            const isTargetInHazard = getIsSystemObjectInHazard(action.payload.target);
            // both connection's source and destination are always part of the same hazard.
            // so no sense to check them both, checking either of them
            return state.filter(e => !isTargetInHazard(e));
        case DELETE_SYSTEM_OBJECT:
            const isObjectInHazard = getIsSystemObjectInHazard(action.payload);
            return state.filter(e => !isObjectInHazard(e));
        default:
            return state
    }
}

function getHazardTransform(entity: SystemObject) {
    switch (entity.type) {
        case ObjectTypes.relator:
            return (hazard: Hazard) => {
                if (!isRelatorInHazard(entity, hazard)) {
                    return hazard;
                }
                return {
                    ...hazard,
                    ...{ exposure: { id: entity.id, name: entity.name } }
                };
            };
        case ObjectTypes.role:
            return (hazard: Hazard) => {
                if (!isRoleInHazard(entity, hazard)) {
                    return hazard;
                }
                return {
                    ...hazard,
                    ...{
                        mishapVictim: hazard.mishapVictim.id === entity.id ?
                            { id: entity.id, name: entity.name } : hazard.mishapVictim,
                        hazardElement: hazard.hazardElement.id === entity.id ?
                            { id: entity.id, name: entity.name } : hazard.hazardElement,
                    }
                };
            };
        case ObjectTypes.kind:
            return (hazard: Hazard) => {
                if (!isKindInHazard(entity, hazard)) {
                    return hazard;
                }
                return {
                    ...hazard,
                    ...{
                        mishapVictimEnvObj: hazard.mishapVictimEnvObj.id === entity.id ?
                            { id: entity.id, name: entity.name } : hazard.mishapVictimEnvObj,
                        hazardElementEnvObj: hazard.hazardElementEnvObj.id === entity.id ?
                            { id: entity.id, name: entity.name } : hazard.hazardElementEnvObj,
                    }
                };
            };
    }
}
