import { SystemModel } from '../../entities/system-model'
import { getFirstStepId, getFlowStepOrder } from '../../entities/meny/flow'
import { SystemModelActionTypes, LOAD_MODEL, RESET_MODEL, UPDATE_FLOW_STEP, UPDATE_PROJECT_NAME } from './types'
import { hazardsReducer } from './reducers/hazards-reducer'
import { nextHazardIdReducer } from './reducers/next-hazard-id-reducer'
import { subsystemReducer } from './reducers/subsystems-reducer'
import { connectionReducer } from './reducers/connections-reducer'
import { kindsReducer } from './reducers/kinds-reducer'
import { rolesReducer } from './reducers/roles-reducer'
import { relatorsReducer } from './reducers/relators-reducer'

const initialState: SystemModel = {
    projectName: 'Hazard Ontology',
    currentStep: getFirstStepId(),
    lastCompletedStep: getFirstStepId(),
    kinds: [],
    roles: [],
    relators: [],
    systemObjectConnections: [],
    subsystems: [],
    hazards: [],
    nextHazardId: 1
}

export function systemModelReducer(state = initialState, action: SystemModelActionTypes): SystemModel {
    switch (action.type) {
        case LOAD_MODEL:
            return action.payload;
        case RESET_MODEL:
            return initialState;
        case UPDATE_FLOW_STEP:
            const step = action.payload;
            const stepOrder = getFlowStepOrder(step);
            if (stepOrder === getFlowStepOrder(state.currentStep)) {
                return state;
            }
            if (stepOrder > getFlowStepOrder(state.lastCompletedStep)) {
                return { ...state, ...{ currentStep: step, lastCompletedStep: step } };
            }
            return { ...state, ...{ currentStep: step } };
        case UPDATE_PROJECT_NAME:
            return { ...state, ...{ projectName: action.payload } };
        default:
            return {
                ...state,
                ...{
                    hazards: hazardsReducer(state.hazards, action),
                    nextHazardId: nextHazardIdReducer(state.nextHazardId, action),
                    subsystems: subsystemReducer(state.subsystems, action),
                    systemObjectConnections: connectionReducer(state.systemObjectConnections, action),
                    kinds: kindsReducer(state.kinds, action),
                    roles: rolesReducer(state.roles, action),
                    relators: relatorsReducer(state.relators, action)
                }
            }
    }
}
