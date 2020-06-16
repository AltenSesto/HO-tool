import { SystemModelActionTypes, CREATE_SUBSYSTEM, UPDATE_SUBSYSTEM, DELETE_SUBSYSTEM } from '../types';
import Subsystem from '../../../entities/system-description/subsystem';

export function subsystemReducer(state: Subsystem[], action: SystemModelActionTypes): Subsystem[] {
    switch (action.type) {
        case CREATE_SUBSYSTEM:
            return state.concat(action.payload);
        case UPDATE_SUBSYSTEM:
            return state.map(e => e.id === action.payload.id ? action.payload : e);
        case DELETE_SUBSYSTEM:
            return state.filter(e => e.id !== action.payload.id);
        default:
            return state
    }
}
