import { SHOW_CONFIRMATION_DIALOG, ModalDialogActionTypes, HIDE_CONFIRMATION_DIALOG } from "./types";

export function showConfirmationDialog(
    contentText: string,
    onYes: () => void,
    onNo: (() => void) | undefined = undefined
): ModalDialogActionTypes {
    return {
        type: SHOW_CONFIRMATION_DIALOG,
        payload: { contentText, onYes, onNo }
    };
}

export function hideConfirmationDialog(): ModalDialogActionTypes {
    return {
        type: HIDE_CONFIRMATION_DIALOG
    };
}

export function confirmDiscardModel(onYes: () => void) {
    return showConfirmationDialog('You have unsaved changes that will be lost. Continue ?', onYes);
}
