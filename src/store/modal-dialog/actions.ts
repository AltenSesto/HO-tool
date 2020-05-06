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
