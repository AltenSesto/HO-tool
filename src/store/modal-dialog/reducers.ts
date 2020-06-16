import DialogConfirmation from "../../entities/dialog-confirmation";
import { ModalDialogActionTypes, SHOW_CONFIRMATION_DIALOG, HIDE_CONFIRMATION_DIALOG } from "./types";

const initialState = {
    contentText: '',
    onYes: () => { }
};

export function modalDialogReducer(state = initialState, action: ModalDialogActionTypes): DialogConfirmation {
    switch (action.type) {
        case SHOW_CONFIRMATION_DIALOG:
            return action.payload;
        case HIDE_CONFIRMATION_DIALOG:
            return initialState;
        default:
            return state;
    }
}
