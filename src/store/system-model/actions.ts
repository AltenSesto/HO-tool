import { SystemModelActionTypes, CREATE_HAZARD, UPDATE_HAZARD, DELETE_HAZARD, LOAD_MODEL, RESET_MODEL, UPDATE_MODEL } from "./types";
import Hazard from "../../entities/hazard-population/hazard";
import { SystemModel } from "../../entities/system-model";

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
