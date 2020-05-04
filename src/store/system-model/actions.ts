import { SystemModelActionTypes, CREATE_HAZARD, UPDATE_HAZARD, DELETE_HAZARD, LOAD_MODEL, RESET_MODEL, UPDATE_MODEL, UPDATE_FLOW_STEP, ADD_POSSIBLE_HARM, REMOVE_POSSIBLE_HARM } from "./types";
import Hazard from "../../entities/hazard-population/hazard";
import { SystemModel } from "../../entities/system-model";
import { FlowStepId } from "../../entities/meny/flow-step";

function createBaseCrudAction<T extends string, P>(type: T, payload: P) {
    return {
        type,
        payload,
        unsavedChanges: true
    };
}

export function createHazard(hazard: Hazard): SystemModelActionTypes {
    return createBaseCrudAction(CREATE_HAZARD, hazard);
}

export function updateHazard(hazard: Hazard): SystemModelActionTypes {
    return createBaseCrudAction(UPDATE_HAZARD, hazard);
}

export function deleteHazard(hazard: Hazard): SystemModelActionTypes {
    return createBaseCrudAction(DELETE_HAZARD, hazard);
}

export function updateModel(model: SystemModel): SystemModelActionTypes {
    return createBaseCrudAction(UPDATE_MODEL, model);
}

export function loadModel(model: SystemModel): SystemModelActionTypes {
    return {
        type: LOAD_MODEL,
        payload: model
    };
}

export function resetModel(): SystemModelActionTypes {
    return {
        type: RESET_MODEL
    };
}

export function updateFlowStep(step: FlowStepId): SystemModelActionTypes {
    return {
        type: UPDATE_FLOW_STEP,
        payload: step
    };
}

export function addPossibleHarm(mishapVictimId: string, harm: string): SystemModelActionTypes {
    return createBaseCrudAction(ADD_POSSIBLE_HARM, { mishapVictimId, harm });
}

export function removePossibleHarm(mishapVictimId: string, harm: string): SystemModelActionTypes {
    return createBaseCrudAction(REMOVE_POSSIBLE_HARM, { mishapVictimId, harm });
}
