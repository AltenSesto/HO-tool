import { SystemModelActionTypes, RESET_MODEL, LOAD_MODEL } from '../system-model/types';
import { UnsavedChangesActionType, SAVE_CHANGES } from './types';

export function unsavedChangesReducer(
    state = false,
    action: SystemModelActionTypes | UnsavedChangesActionType
): boolean {
    if ('unsavedChanges' in action) {
        return action.unsavedChanges;
    }
    switch (action.type) {
        case RESET_MODEL:
        case LOAD_MODEL:
        case SAVE_CHANGES:
            return false;
        default:
            return state;
    }
}
