import { SystemModelActionTypes, CREATE_HAZARD } from '../types';

export function nextHazardIdReducer(state: number, action: SystemModelActionTypes): number {
    if (action.type === CREATE_HAZARD) {
        return state + 1;
    }
    return state;
}
