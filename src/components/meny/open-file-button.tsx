import React, { useRef } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../store';
import { IconButton, makeStyles } from '@material-ui/core';
import { FolderOpen } from '@material-ui/icons';
import { resetModel, loadModel } from '../../store/system-model/actions';
import { confirmDiscardModel } from '../../store/modal-dialog/actions';

const mapState = (state: RootState) => ({
    hasUnsavedChanges: state.unsavedChanges
});

const mapDispatch = {
    resetSystemModel: resetModel,
    setSystemModel: loadModel,
    confirmDiscardModel: confirmDiscardModel
};

const connector = connect(mapState, mapDispatch);

type Props = ConnectedProps<typeof connector>

const useStyles = makeStyles(() => ({
    inlineBlock: {
        display: 'inline-block'
    },
    hidden: {
        display: 'none'
    }
}));

const OpenFileButton: React.FC<Props> = (props) => {
    const classes = useStyles();
    const formRef = useRef<HTMLFormElement | null>();
    const inputRef = useRef<HTMLInputElement | null>();

    const openSelectFileDialog = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    const confirmOpenFile = () => {
        if (!props.hasUnsavedChanges) {
            openSelectFileDialog();
        } else {
            props.confirmDiscardModel(openSelectFileDialog);
        }
    };

    const readFile = (files: FileList | null) => {
        if (files === null || files.length !== 1) {
            return;
        }
        const file = files[0];
        if (file.type !== 'application/json') {
            throw new Error('File type not supported');
        }

        const reader = new FileReader();
        reader.onload = processFile;
        reader.onerror = handleFileError;
        reader.readAsText(file, 'utf-8');
    };

    const handleFileError = (ev: ProgressEvent<FileReader>) => {
        let message = 'Error reading a file';
        if (ev.target && ev.target.error) {
            message = ev.target.error.message;
        }
        throw new Error(message);
    };

    const processFile = (ev: ProgressEvent<FileReader>) => {
        if (!ev.target) {
            throw new Error('Error reading a file');
        }

        const data = ev.target.result as string;
        const model = JSON.parse(data);
        if (formRef.current) {
            formRef.current.reset();
        }

        props.resetSystemModel();
        props.setSystemModel(model);
    };

    if (window.FileReader && window.FileList) {
        return (
            <form
                ref={(ref) => formRef.current = ref}
                className={classes.inlineBlock}
            >
                <input
                    ref={(ref) => inputRef.current = ref}
                    className={classes.hidden}
                    type='file'
                    onChange={(ev) => readFile(ev.target.files)}
                    accept='.json'
                />
                <IconButton
                    title='Open Project File'
                    size='small'
                    color='inherit'
                    component='span'
                    onClick={confirmOpenFile}
                >
                    <FolderOpen />
                </IconButton>
            </form>
        );
    }

    return (
        <div title='File API not supported' className={classes.inlineBlock}>
            <IconButton size='small' color='inherit' disabled={true}>
                <FolderOpen />
            </IconButton>
        </div>
    );
};

export default connector(OpenFileButton);
