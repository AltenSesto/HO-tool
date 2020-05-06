import { Action, Dispatch } from 'redux';
import { SystemModelActionTypes, CREATE_HAZARD, UPDATE_HAZARD, DELETE_HAZARD, LOAD_MODEL, RESET_MODEL, UPDATE_MODEL, UPDATE_FLOW_STEP, ADD_POSSIBLE_HARM, REMOVE_POSSIBLE_HARM } from "./types";
import Hazard from "../../entities/hazard-population/hazard";
import { SystemModel } from "../../entities/system-model";
import { FlowStepId } from "../../entities/meny/flow-step";
import { MishapVictim } from "../../entities/system-description/role";
import { showConfirmationDialog } from "../modal-dialog/actions";

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

export function addPossibleHarm(mishapVictim: MishapVictim, harm: string): SystemModelActionTypes {
    return createBaseCrudAction(ADD_POSSIBLE_HARM, { mishapVictim, harm });
}

export function removePossibleHarm(
    mishapVictim: MishapVictim,
    harm: string,
    hazards: Hazard[],
    dispatch: Dispatch<Action>
) {
    if (mishapVictim.possibleHarms.length === 1) {
        const affectedHazards = hazards.filter(e => e.mishapVictim.id === mishapVictim.id);
        if (affectedHazards.length > 0) {
            dispatch(showConfirmationDialog(
                'This mishap victim has hazard(s) associated with it. If you delete the only possible harm it will no longer be a mishap victim and all it\'s hazards will be deleted. Continue?',
                () => dispatch(createBaseCrudAction(REMOVE_POSSIBLE_HARM, { mishapVictim, harm, affectedHazards }))
            ));
            return;
        }
    }

    dispatch(createBaseCrudAction(REMOVE_POSSIBLE_HARM, { mishapVictim, harm, affectedHazards: [] }));
}
