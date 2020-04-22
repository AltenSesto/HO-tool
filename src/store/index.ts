import { combineReducers } from 'redux'
import { systemModelReducer } from './system-model/reducers'

const rootReducer = combineReducers({
    systemModel: systemModelReducer
})

export type RootState = ReturnType<typeof rootReducer>
