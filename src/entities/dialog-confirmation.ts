interface DialogConfirmation {
    contentText: string;
    onYes: () => void;
    onNo?: () => void;
}

export default DialogConfirmation
