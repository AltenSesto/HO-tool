import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../store';
import { IconButton, Badge } from '@material-ui/core';
import { SaveAlt } from '@material-ui/icons';
import { saveChanges } from '../../store/unsaved-changes/actions';

const mapState = (state: RootState) => ({
    systemModel: state.systemModel,
    hasUnsavedChanges: state.unsavedChanges
});

const mapDispatch = {
    saveChanges: saveChanges
};

const connector = connect(mapState, mapDispatch);

type Props = ConnectedProps<typeof connector>

const DownloadFileButton: React.FC<Props> = (props) => {

    const downloadFile = () => {
        const data = props.systemModel;
        const serialized = JSON.stringify(data, null, '\t');
        const fileName = `${data.projectName} ${new Date().toISOString().replace(/:/g, '_')}.json`;

        var element = document.createElement('a');
        element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(serialized));
        element.setAttribute('download', fileName);
        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();
        document.body.removeChild(element);

        props.saveChanges();
    };

    return (
        <IconButton
            size='small'
            title={props.hasUnsavedChanges ? 'Download Project - You have unsaved changes' : 'Download Project'}
            color='inherit'
            onClick={downloadFile}
        >
            <Badge variant='dot' color='secondary' invisible={!props.hasUnsavedChanges}>
                <SaveAlt />
            </Badge>
        </IconButton>
    );
};

export default connector(DownloadFileButton);
