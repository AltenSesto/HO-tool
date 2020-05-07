import SystemObject from '../../../entities/system-description/system-object';
import { SystemModelActionTypes } from '../types';
import { systemObjectReducer } from './system-object-reducer';
import { ObjectTypes } from '../../../entities/system-description/object-types';

export function kindsReducer(state: SystemObject[], action: SystemModelActionTypes): SystemObject[] {
    return systemObjectReducer(state, action, ObjectTypes.kind);
}
