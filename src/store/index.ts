import { combineReducers } from 'redux'
import { systemModelReducer } from './system-model/reducers'
import { unsavedChangesReducer } from './unsaved-changes/reducers'

export const rootReducer = combineReducers({
    systemModel: systemModelReducer,
    unsavedChanges: unsavedChangesReducer
})

export type RootState = ReturnType<typeof rootReducer>
