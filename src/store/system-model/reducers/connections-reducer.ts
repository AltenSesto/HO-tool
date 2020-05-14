import { SystemModelActionTypes, CREATE_CONNECTION, DELETE_CONNECTION, DELETE_SYSTEM_OBJECT } from '../types';
import Connection from '../../../entities/system-description/connection';

export function connectionReducer(state: Connection[], action: SystemModelActionTypes): Connection[] {
    switch (action.type) {
        case CREATE_CONNECTION:
            return state.concat(action.payload);
        case DELETE_CONNECTION:
            return state.filter(e => e.id !== action.payload.connection.id);
        case DELETE_SYSTEM_OBJECT:
            const objectId = action.payload.id;
            return state.filter(e => e.source !== objectId && e.target !== objectId);
        default:
            return state
    }
}
