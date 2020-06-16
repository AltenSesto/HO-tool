import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../store';
import { confirmDiscardModel } from '../../store/modal-dialog/actions';
import { resetModel } from '../../store/system-model/actions';
import { IconButton } from '@material-ui/core';
import { InsertDriveFileOutlined } from '@material-ui/icons';

const mapState = (state: RootState) => ({
    hasUnsavedChanges: state.unsavedChanges
});

const mapDispatch = {
    confirmDiscardModel: confirmDiscardModel,
    resetModel: resetModel
};

const connector = connect(mapState, mapDispatch);

type Props = ConnectedProps<typeof connector>

const NewFileButton: React.FC<Props> = (props) => {

    const setNewProject = () => {
        if (!props.hasUnsavedChanges) {
            props.resetModel();
        } else {
            props.confirmDiscardModel(props.resetModel);
        }
    };

    return (
        <IconButton
            size='small'
            title='New Project'
            color='inherit'
            onClick={setNewProject}
        >
            <InsertDriveFileOutlined />
        </IconButton>
    );
};

export default connector(NewFileButton);
