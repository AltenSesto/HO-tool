import { SystemModelActionTypes, CREATE_CONNECTION, DELETE_CONNECTION } from '../types';
import Connection from '../../../entities/system-description/connection';

export function connectionReducer(state: Connection[], action: SystemModelActionTypes): Connection[] {
    switch (action.type) {
        case CREATE_CONNECTION:
            return state.concat(action.payload);
        case DELETE_CONNECTION:
            return state.filter(e => e.id !== action.payload.id);
        default:
            return state
    }
}
