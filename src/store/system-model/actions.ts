import { Action, Dispatch } from 'redux';
import { SystemModelActionTypes, CREATE_HAZARD, UPDATE_HAZARD, DELETE_HAZARD, LOAD_MODEL, RESET_MODEL, UPDATE_MODEL, UPDATE_FLOW_STEP, ADD_POSSIBLE_HARM, REMOVE_POSSIBLE_HARM, CREATE_SUBSYSTEM, UPDATE_SUBSYSTEM, DELETE_SUBSYSTEM, CREATE_CONNECTION, DELETE_CONNECTION, CREATE_SYSTEM_OBJECT, UPDATE_SYSTEM_OBJECT, DELETE_SYSTEM_OBJECT, RENAME_SYSTEM_OBJECT, UPDATE_PROJECT_NAME } from "./types";
import Hazard from "../../entities/hazard-population/hazard";
import { SystemModel } from "../../entities/system-model";
import { FlowStepId } from "../../entities/meny/flow-step";
import { MishapVictim } from "../../entities/system-description/role";
import { showConfirmationDialog } from "../modal-dialog/actions";
import Subsystem from '../../entities/system-description/subsystem';
import Connection from '../../entities/system-description/connection';
import SystemObject from '../../entities/system-description/system-object';

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

export function createSubsystem(subsystem: Subsystem): SystemModelActionTypes {
    return createBaseCrudAction(CREATE_SUBSYSTEM, subsystem);
}

export function updateSubsystem(subsystem: Subsystem): SystemModelActionTypes {
    return createBaseCrudAction(UPDATE_SUBSYSTEM, subsystem);
}

export function deleteSubsystem(subsystem: Subsystem): SystemModelActionTypes {
    return createBaseCrudAction(DELETE_SUBSYSTEM, subsystem);
}

export function createConnection(connection: Connection): SystemModelActionTypes {
    return createBaseCrudAction(CREATE_CONNECTION, connection);
}

export function deleteConnection(connection: Connection, target: SystemObject): SystemModelActionTypes {
    return createBaseCrudAction(DELETE_CONNECTION, { connection, target });
}

export function createSystemObject(systemObject: SystemObject): SystemModelActionTypes {
    return createBaseCrudAction(CREATE_SYSTEM_OBJECT, systemObject);
}

export function updateSystemObject(systemObject: SystemObject): SystemModelActionTypes {
    return createBaseCrudAction(UPDATE_SYSTEM_OBJECT, systemObject);
}

export function deleteSystemObject(systemObject: SystemObject): SystemModelActionTypes {
    return createBaseCrudAction(DELETE_SYSTEM_OBJECT, systemObject);
}

export function renameSystemObject(systemObject: SystemObject): SystemModelActionTypes {
    return createBaseCrudAction(RENAME_SYSTEM_OBJECT, systemObject);
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
    const removeHarmAction = createBaseCrudAction(REMOVE_POSSIBLE_HARM, { mishapVictim, harm });

    if (mishapVictim.possibleHarms.length === 1) {
        const affectedHazards = hazards.filter(e => e.mishapVictim.id === mishapVictim.id);
        if (affectedHazards.length > 0) {
            dispatch(showConfirmationDialog(
                'This mishap victim has hazard(s) associated with it. If you delete the only possible harm it will no longer be a mishap victim and all it\'s hazards will be deleted. Continue?',
                () => {
                    dispatch(removeHarmAction);
                    affectedHazards.forEach((h) => dispatch(deleteHazard(h)));
                }
            ));
            return;
        }
    }

    dispatch(removeHarmAction);
}

export function updateProjectName(name: string): SystemModelActionTypes {
    return createBaseCrudAction(UPDATE_PROJECT_NAME, name);
}
