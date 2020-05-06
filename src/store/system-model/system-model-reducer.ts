import { SystemModel } from '../../entities/system-model'
import { getFirstStepId } from '../../entities/meny/flow'
import { SystemModelActionTypes, LOAD_MODEL, RESET_MODEL, UPDATE_MODEL, UPDATE_FLOW_STEP, ADD_POSSIBLE_HARM, REMOVE_POSSIBLE_HARM } from './types'
import { hazardsReducer } from './reducers/hazards-reducer'
import { nextHazardIdReducer } from './reducers/next-hazard-id-reducer'

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
        case UPDATE_MODEL:
            return action.payload;
        case RESET_MODEL:
            return initialState;
        case UPDATE_FLOW_STEP:
            const step = action.payload;
            if (step.order === state.currentStep.order) {
                return state;
            }
            if (step.order > state.lastCompletedStep.order) {
                return { ...state, ...{ currentStep: step, lastCompletedStep: step } };
            }
            return { ...state, ...{ currentStep: step } };
        case ADD_POSSIBLE_HARM:
            return {
                ...state,
                ...{
                    roles: state.roles.map(e => e.id === action.payload.mishapVictim.id ?
                        {
                            ...e, ...{ possibleHarms: e.possibleHarms.concat(action.payload.harm) }
                        }
                        :
                        e)
                }
            }
        case REMOVE_POSSIBLE_HARM:
            const { mishapVictim, harm } = action.payload;
            return {
                ...state,
                ...{
                    roles: state.roles.map(e => e.id === mishapVictim.id ?
                        {
                            ...e, ...{ possibleHarms: e.possibleHarms.filter(h => h !== harm) }
                        }
                        :
                        e)
                }
            }
        default:
            return {
                ...state,
                ...{
                    hazards: hazardsReducer(state.hazards, action),
                    nextHazardId: nextHazardIdReducer(state.nextHazardId, action)
                }
            }
    }
}
