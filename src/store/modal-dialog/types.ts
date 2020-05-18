import DialogConfirmation from "../../entities/dialog-confirmation";

export const SHOW_CONFIRMATION_DIALOG = 'SHOW_CONFIRMATION_DIALOG'
export const HIDE_CONFIRMATION_DIALOG = 'HIDE_CONFIRMATION_DIALOG'

interface ShowConfirmationDialogAction {
    type: typeof SHOW_CONFIRMATION_DIALOG;
    payload: DialogConfirmation;
}

interface HideConfirmationDialogAction {
    type: typeof HIDE_CONFIRMATION_DIALOG;
}

export type ModalDialogActionTypes = ShowConfirmationDialogAction | HideConfirmationDialogAction
