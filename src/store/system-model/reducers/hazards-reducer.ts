import Hazard from '../../../entities/hazard-population/hazard';
import { SystemModelActionTypes, CREATE_HAZARD, UPDATE_HAZARD, DELETE_HAZARDS, RENAME_SYSTEM_OBJECT, DELETE_CONNECTION } from '../types';
import SystemObject from '../../../entities/system-description/system-object';
import { ObjectTypes } from '../../../entities/system-description/object-types';

export function hazardsReducer(state: Hazard[], action: SystemModelActionTypes): Hazard[] {
    switch (action.type) {
        case CREATE_HAZARD:
            return state.concat(action.payload);
        case UPDATE_HAZARD:
            return state.map(e => e.id === action.payload.id ? action.payload : e);
        case DELETE_HAZARDS:
            return state.filter(e => !action.payload.some(d => e.id === d.id));
        case RENAME_SYSTEM_OBJECT:
            const transform = getHazardTransform(action.payload);
            return state.map(transform);
        case DELETE_CONNECTION:
            const targetId = action.payload.target;
            // both connection's source and destination are always part of the same hazard.
            // so no sense to check them both, checking only destination
            return state.filter(e =>
                e.mishapVictim.id !== targetId &&
                e.exposure.id !== targetId &&
                e.hazardElement.id !== targetId &&
                e.hazardElementEnvObj.id !== targetId &&
                e.mishapVictimEnvObj.id !== targetId);
        default:
            return state
    }
}

function getHazardTransform(entity: SystemObject) {
    switch (entity.type) {
        case ObjectTypes.relator:
            return (hazard: Hazard) => {
                if (hazard.exposure.id !== entity.id) {
                    return hazard;
                }
                return {
                    ...hazard,
                    ...{ exposure: { id: entity.id, name: entity.name } }
                };
            };
        case ObjectTypes.role:
            return (hazard: Hazard) => {
                if (hazard.mishapVictim.id !== entity.id && hazard.hazardElement.id !== entity.id) {
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
                if (hazard.mishapVictimEnvObj.id !== entity.id &&
                    hazard.hazardElementEnvObj.id !== entity.id
                ) {
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
