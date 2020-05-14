import React from 'react';
import { IconButton } from '@material-ui/core';
import { FolderOpen, SaveAlt } from '@material-ui/icons';
import { connect, ConnectedProps } from 'react-redux';

import { SystemModel } from '../../entities/system-model';
import { RootState } from '../../store';
import { loadModel, resetModel } from '../../store/system-model/actions';
import { saveChanges } from '../../store/unsaved-changes/actions';

const mapState = (state: RootState) => ({
    systemModel: state.systemModel,
    hasUnsavedChanges: state.unsavedChanges
})

const mapDispatch = {
    setSystemModel: (model: SystemModel) => loadModel(model),
    resetSystemModel: () => resetModel(),
    saveChanges: () => saveChanges()
}

const connector = connect(mapState, mapDispatch);

type Props = ConnectedProps<typeof connector>

class Meny extends React.Component<Props> {

    private _openFileRef: HTMLFormElement | null;

    constructor(props: Props) {
        super(props);

        this.readFile = this.readFile.bind(this);
        this.downloadFile = this.downloadFile.bind(this);
        this.processResult = this.processResult.bind(this);
        this.handleFileError = this.handleFileError.bind(this);
        this.reportError = this.reportError.bind(this);

        this._openFileRef = null;
    }

    render() {
        let openFile;
        if (window.FileReader && window.FileList) {
            openFile = (
                <React.Fragment>
                    <form
                        ref={(ref) => this._openFileRef = ref}
                        style={{ display: 'inline-block' }}
                    >
                        <input
                            style={{ display: 'none' }}
                            type='file'
                            onChange={(ev) => this.readFile(ev.target.files)}
                            accept='.json'
                            id='input-open-file'
                        />
                        <label htmlFor='input-open-file'>
                            <IconButton title='Open File' size='small' color='inherit' component='span'>
                                <FolderOpen />
                            </IconButton>
                        </label>
                    </form>
                </React.Fragment>
            );
        } else {
            openFile = (
                <div title='File API not supported' style={{ display: 'inline-block' }}>
                    <IconButton size='small' color='inherit' disabled={true}>
                        <FolderOpen />
                    </IconButton>
                </div>
            );
        }

        return (
            <React.Fragment>
                {openFile}
                <IconButton
                    size='small'
                    title='Download'
                    color='inherit'
                    onClick={this.downloadFile}
                >
                    <SaveAlt />
                </IconButton>
            </React.Fragment>
        );
    }

    private readFile(files: FileList | null) {
        if (files === null || files.length !== 1 ||
            (this.props.hasUnsavedChanges && !window.confirm('You have unsaved changes that will be lost. Continue?'))
        ) {
            return;
        }
        const file = files[0];
        if (file.type !== 'application/json') {
            return this.reportError('File type not supported');
        }

        const reader = new FileReader();
        reader.onload = this.processResult;
        reader.onerror = this.handleFileError;
        reader.readAsText(file, 'utf-8');
    }

    private downloadFile() {
        const data = this.props.systemModel;
        const serialized = JSON.stringify(data, null, '\t');
        const fileName = `${data.projectName} ${new Date().toISOString().replace(/:/g, '_')}.json`;

        var element = document.createElement('a');
        element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(serialized));
        element.setAttribute('download', fileName);
        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();
        document.body.removeChild(element);

        this.props.saveChanges();
    }

    private reportError(message: string) {
        return alert(message);
    }

    private handleFileError(ev: ProgressEvent<FileReader>) {
        let message = 'Error reading a file';
        if (ev.target && ev.target.error) {
            message = ev.target.error.message;
        }
        this.reportError(message);
    }

    private processResult(ev: ProgressEvent<FileReader>) {
        if (!ev.target) {
            return this.reportError('Error reading a file');
        }

        const data = ev.target.result as string;
        const model = JSON.parse(data);
        this._openFileRef && this._openFileRef.reset();
        this.props.resetSystemModel();
        this.props.setSystemModel(model);
    }
};

export default connector(Meny)
