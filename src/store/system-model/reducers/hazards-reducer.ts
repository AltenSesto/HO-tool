import Hazard from '../../../entities/hazard-population/hazard';
import { SystemModelActionTypes, CREATE_HAZARD, UPDATE_HAZARD, DELETE_HAZARDS, RENAME_SYSTEM_OBJECT } from '../types';
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
