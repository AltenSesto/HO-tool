import { SystemModelActionTypes, CREATE_SYSTEM_OBJECT, UPDATE_SYSTEM_OBJECT, DELETE_SYSTEM_OBJECT } from '../types';
import SystemObject from '../../../entities/system-description/system-object';
import { ObjectTypes } from '../../../entities/system-description/object-types';

export function systemObjectReducer(
    state: SystemObject[],
    action: SystemModelActionTypes,
    objectType: ObjectTypes
): SystemObject[] {
    switch (action.type) {
        case CREATE_SYSTEM_OBJECT:
            if (action.payload.type !== objectType) {
                return state;
            }
            return state.concat(action.payload);
        case UPDATE_SYSTEM_OBJECT:
            if (action.payload.type !== objectType) {
                return state;
            }
            return state.map(e => e.id === action.payload.id ? action.payload : e);
        case DELETE_SYSTEM_OBJECT:
            if (action.payload.type !== objectType) {
                return state;
            }
            return state.filter(e => e.id !== action.payload.id);
        default:
            return state
    }
}
