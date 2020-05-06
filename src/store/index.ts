import { combineReducers } from 'redux'
import { systemModelReducer } from './system-model/reducers'
import { unsavedChangesReducer } from './unsaved-changes/reducers'
import { modalDialogReducer } from './modal-dialog/reducers'

export const rootReducer = combineReducers({
    systemModel: systemModelReducer,
    unsavedChanges: unsavedChangesReducer,
    modalDialog: modalDialogReducer
})

export type RootState = ReturnType<typeof rootReducer>
