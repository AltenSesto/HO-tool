import Hazard from '../../entities/hazard-population/hazard'
import { SystemModel } from '../../entities/system-model'

export const CREATE_HAZARD = 'CREATE_HAZARD'
export const DELETE_HAZARD = 'DELETE_HAZARD'
export const UPDATE_HAZARD = 'UPDATE_HAZARD'
export const UPDATE_MODEL = 'UPDATE_MODEL'
export const LOAD_MODEL = 'LOAD_MODEL'
export const RESET_MODEL = 'RESET_MODEL'

interface CrudActionBase<T, P> {
    type: T;
    payload: P;
    unsavedChanges: boolean;
}

interface CreateHazardAction extends CrudActionBase<typeof CREATE_HAZARD, Hazard> {}

interface DeleteHazardAction extends CrudActionBase<typeof DELETE_HAZARD, Hazard> { }

interface UpdateHazardAction extends CrudActionBase<typeof UPDATE_HAZARD, Hazard> { }

interface UpdateModelAction extends CrudActionBase<typeof UPDATE_MODEL, SystemModel> { }

interface LoadModelAction {
    type: typeof LOAD_MODEL,
    payload: SystemModel
}

interface ResetModelAction {
    type: typeof RESET_MODEL;
}

export type SystemModelActionTypes = CreateHazardAction | DeleteHazardAction | UpdateHazardAction |
    LoadModelAction | ResetModelAction | UpdateModelAction
