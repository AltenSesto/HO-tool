import { SystemModelActionTypes, ADD_POSSIBLE_HARM, REMOVE_POSSIBLE_HARM } from '../types';
import { systemObjectReducer } from './system-object-reducer';
import { ObjectTypes } from '../../../entities/system-description/object-types';
import Role from '../../../entities/system-description/role';

export function rolesReducer(state: Role[], action: SystemModelActionTypes): Role[] {
    switch (action.type) {
        case ADD_POSSIBLE_HARM:
            return state.map(e => {
                if (e.id === action.payload.mishapVictim.id) {
                    const possibleHarms = e.possibleHarms.concat(action.payload.harm);
                    return { ...e, ...{ possibleHarms } }
                }
                return e
            });
        case REMOVE_POSSIBLE_HARM:
            return state.map(e => {
                if (e.id === action.payload.mishapVictim.id) {
                    const possibleHarms = e.possibleHarms.filter(h => h !== action.payload.harm);
                    return { ...e, ...{ possibleHarms } }
                }
                return e
            });
        default:
            return systemObjectReducer(state, action, ObjectTypes.role) as Role[];
    }
}
