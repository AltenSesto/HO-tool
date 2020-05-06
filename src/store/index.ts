import { combineReducers } from 'redux'
import { systemModelReducer } from './system-model/system-model-reducer'
import { unsavedChangesReducer } from './unsaved-changes/reducers'
import { modalDialogReducer } from './modal-dialog/reducers'

export const rootReducer = combineReducers({
    systemModel: systemModelReducer,
    unsavedChanges: unsavedChangesReducer,
    modalDialog: modalDialogReducer
})

export type RootState = ReturnType<typeof rootReducer>
