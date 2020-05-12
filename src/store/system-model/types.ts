import Hazard from '../../entities/hazard-population/hazard'
import { SystemModel } from '../../entities/system-model'
import { FlowStepId } from '../../entities/meny/flow-step'
import { MishapVictim } from '../../entities/system-description/role'
import Subsystem from '../../entities/system-description/subsystem'
import Connection from '../../entities/system-description/connection'
import SystemObject from '../../entities/system-description/system-object'

export const CREATE_HAZARD = 'CREATE_HAZARD'
export const DELETE_HAZARDS = 'DELETE_HAZARDS'
export const UPDATE_HAZARD = 'UPDATE_HAZARD'
export const UPDATE_MODEL = 'UPDATE_MODEL'
export const LOAD_MODEL = 'LOAD_MODEL'
export const RESET_MODEL = 'RESET_MODEL'
export const UPDATE_FLOW_STEP = 'UPDATE_FLOW_STEP'
export const ADD_POSSIBLE_HARM = 'ADD_POSSIBLE_HARM'
export const REMOVE_POSSIBLE_HARM = 'REMOVE_POSSIBLE_HARM'
export const CREATE_SUBSYSTEM = 'CREATE_SUBSYSTEM'
export const DELETE_SUBSYSTEM = 'DELETE_SUBSYSTEM'
export const UPDATE_SUBSYSTEM = 'UPDATE_SUBSYSTEM'
export const CREATE_CONNECTION = 'CREATE_CONNECTION'
export const DELETE_CONNECTION = 'DELETE_CONNECTION'
export const CREATE_SYSTEM_OBJECT = 'CREATE_SYSTEM_OBJECT'
export const DELETE_SYSTEM_OBJECT = 'DELETE_SYSTEM_OBJECT'
export const UPDATE_SYSTEM_OBJECT = 'UPDATE_SYSTEM_OBJECT'
export const RENAME_SYSTEM_OBJECT = 'RENAME_SYSTEM_OBJECT'
export const UPDATE_PROJECT_NAME = 'UPDATE_PROJECT_NAME'


interface CrudActionBase<T, P> {
    type: T;
    payload: P;
    unsavedChanges: boolean;
}

interface CreateHazardAction extends CrudActionBase<typeof CREATE_HAZARD, Hazard> { }

interface DeleteHazardsAction extends CrudActionBase<typeof DELETE_HAZARDS, Hazard[]> { }

interface UpdateHazardAction extends CrudActionBase<typeof UPDATE_HAZARD, Hazard> { }

interface CreateSubsystemAction extends CrudActionBase<typeof CREATE_SUBSYSTEM, Subsystem> { }

interface DeleteSubsystemAction extends CrudActionBase<typeof DELETE_SUBSYSTEM, Subsystem> { }

interface UpdateSubsystemAction extends CrudActionBase<typeof UPDATE_SUBSYSTEM, Subsystem> { }

interface CreateConnectionAction extends CrudActionBase<typeof CREATE_CONNECTION, Connection> { }

interface DeleteConnectionAction extends CrudActionBase<typeof DELETE_CONNECTION, Connection> { }

interface CreateSystemObjectAction extends CrudActionBase<typeof CREATE_SYSTEM_OBJECT, SystemObject> { }

interface DeleteSystemObjectAction extends CrudActionBase<typeof DELETE_SYSTEM_OBJECT, SystemObject> { }

interface UpdateSystemObjectAction extends CrudActionBase<typeof UPDATE_SYSTEM_OBJECT, SystemObject> { }

interface RenameSystemObjectAction extends CrudActionBase<typeof RENAME_SYSTEM_OBJECT, SystemObject> { }

interface UpdateModelAction extends CrudActionBase<typeof UPDATE_MODEL, SystemModel> { }

interface LoadModelAction {
    type: typeof LOAD_MODEL,
    payload: SystemModel
}

interface ResetModelAction {
    type: typeof RESET_MODEL;
}

interface UpdateFlowStepAction {
    type: typeof UPDATE_FLOW_STEP;
    payload: FlowStepId
}

interface AddPossibleHarmAction extends CrudActionBase<
        typeof ADD_POSSIBLE_HARM,
        { mishapVictim: MishapVictim, harm: string }
    > { }

interface RemovePossibleHarmAction extends CrudActionBase<
    typeof REMOVE_POSSIBLE_HARM,
    { mishapVictim: MishapVictim, harm: string }
    > { }

interface UpdateProjectName extends CrudActionBase<typeof UPDATE_PROJECT_NAME, string> { }

export type SystemModelActionTypes = CreateHazardAction | DeleteHazardsAction | UpdateHazardAction |
    LoadModelAction | ResetModelAction | UpdateModelAction | UpdateFlowStepAction |
    AddPossibleHarmAction | RemovePossibleHarmAction | UpdateProjectName |
    CreateSubsystemAction | UpdateSubsystemAction | DeleteSubsystemAction |
    CreateConnectionAction | DeleteConnectionAction | RenameSystemObjectAction |
    CreateSystemObjectAction | DeleteSystemObjectAction | UpdateSystemObjectAction
