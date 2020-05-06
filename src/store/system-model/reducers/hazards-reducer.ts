import Hazard from '../../../entities/hazard-population/hazard';
import { SystemModelActionTypes, CREATE_HAZARD, UPDATE_HAZARD, DELETE_HAZARDS } from '../types';

export function hazardsReducer(state: Hazard[], action: SystemModelActionTypes): Hazard[] {
    switch (action.type) {
        case CREATE_HAZARD:
            return state.concat(action.payload);
        case UPDATE_HAZARD:
            return state.map(e => e.id === action.payload.id ? action.payload : e);
        case DELETE_HAZARDS:
            return state.filter(e => !action.payload.some(d => e.id === d.id));
        default:
            return state
    }
}
