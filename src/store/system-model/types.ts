import Hazard from "../../entities/hazard-population/hazard"

export const CREATE_HAZARD = 'CREATE_HAZARD'
export const DELETE_HAZARD = 'DELETE_HAZARD'
export const UPDATE_HAZARD = 'UPDATE_HAZARD'

interface CrudActionBase<T, P> {
    type: T;
    payload: P;
}

interface CreateHazardAction extends CrudActionBase<typeof CREATE_HAZARD, Hazard> {}

interface DeleteHazardAction extends CrudActionBase<typeof DELETE_HAZARD, Hazard> { }

interface UpdateHazardAction extends CrudActionBase<typeof UPDATE_HAZARD, Hazard> { }

export type SyustemModelActionTypes = CreateHazardAction | DeleteHazardAction | UpdateHazardAction
