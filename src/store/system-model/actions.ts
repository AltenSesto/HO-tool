import { SystemModelActionTypes, CREATE_HAZARD, UPDATE_HAZARD, DELETE_HAZARD, LOAD_MODEL, RESET_MODEL } from "./types";
import Hazard from "../../entities/hazard-population/hazard";
import { SystemModel } from "../../entities/system-model";

export function createHazard(hazard: Hazard): SystemModelActionTypes {
    return {
        type: CREATE_HAZARD,
        payload: hazard
    };
}

export function updateHazard(hazard: Hazard): SystemModelActionTypes {
    return {
        type: UPDATE_HAZARD,
        payload: hazard
    };
}

export function deleteHazard(hazard: Hazard): SystemModelActionTypes {
    return {
        type: DELETE_HAZARD,
        payload: hazard
    };
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
