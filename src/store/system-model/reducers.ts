import { SystemModel } from '../../entities/system-model'
import { getFirstStepId } from '../../entities/meny/flow'
import { SystemModelActionTypes, CREATE_HAZARD, UPDATE_HAZARD, DELETE_HAZARD, LOAD_MODEL, RESET_MODEL, UPDATE_MODEL, UPDATE_FLOW_STEP, ADD_POSSIBLE_HARM, REMOVE_POSSIBLE_HARM } from './types'

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
        case CREATE_HAZARD:
            return {
                ...state,
                ...{
                    hazards: state.hazards.concat(action.payload),
                    nextHazardId: state.nextHazardId + 1
                }
            }
        case UPDATE_HAZARD:
            return {
                ...state,
                ...{ hazards: state.hazards.map(e => e.id === action.payload.id ? action.payload : e) }
            }
        case DELETE_HAZARD:
            return {
                ...state,
                ...{ hazards: state.hazards.filter(e => e.id !== action.payload.id) }
            }
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
            const { mishapVictim, harm, affectedHazards } = action.payload;

            let hazards = state.hazards;
            if (affectedHazards.length > 0) {
                hazards = hazards.filter(h => !affectedHazards.some(a => h.id === a.id));
            }

            return {
                ...state,
                ...{
                    roles: state.roles.map(e => e.id === mishapVictim.id ?
                        {
                            ...e, ...{ possibleHarms: e.possibleHarms.filter(h => h !== harm) }
                        }
                        :
                        e),
                    hazards
                }
            }
        default:
            return state
    }
}
