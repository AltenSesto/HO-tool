import { UnsavedChangesActionType, SAVE_CHANGES } from './types';

export function saveChanges(): UnsavedChangesActionType {
    return {
        type: SAVE_CHANGES
    };
}
