import { SystemModel } from "../../entities/system-model"
import { getFirstStepId } from "../../entities/meny/flow"
import { SystemModelActionTypes, CREATE_HAZARD, UPDATE_HAZARD, DELETE_HAZARD, LOAD_MODEL, RESET_MODEL } from "./types"

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
                ...{ hazards: state.hazards.concat(action.payload) }
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
            return action.payload;
        case RESET_MODEL:
            return initialState;
        default:
            return state
    }
}