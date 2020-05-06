import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Dialog, DialogContentText, DialogContent, Button, DialogActions } from '@material-ui/core';
import { RootState } from '../store';
import { hideConfirmationDialog } from '../store/modal-dialog/actions';

const mapState = (state: RootState) => ({
    dialog: state.modalDialog
});

const mapDispatch = {
    close: hideConfirmationDialog
};

const connector = connect(mapState, mapDispatch);

type Props = ConnectedProps<typeof connector>

const ConfirmationDialog: React.FC<Props> = (props) => {

    const handleYes = () => {
        props.close();
        props.dialog.onYes();
    };

    const handleNo = () => {
        props.close();
        if (props.dialog.onNo) {
            props.dialog.onNo();
        }
    };

    return (
        <Dialog
            open={!!props.dialog.contentText}
            onClose={props.close}
            disableBackdropClick
            disableEscapeKeyDown
        >
            <DialogContent>
                <DialogContentText>
                    {props.dialog.contentText}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleYes} color="primary">
                    Yes
                </Button>
                <Button onClick={handleNo} color="primary" autoFocus>
                    No
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default connector(ConfirmationDialog);
