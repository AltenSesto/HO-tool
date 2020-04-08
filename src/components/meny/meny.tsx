import React from "react";
import { IconButton } from "@material-ui/core";
import { FolderOpen, SaveAlt } from "@material-ui/icons";

import { SystemModel } from "../../entities/system-model";
import { isConnectionToCollapsed } from "../../entities/system-description/system-description-entity";
import Connection from "../../entities/system-description/connection";
import { FlowStepId } from "../../entities/meny/flow-step";
import { flowSteps } from "../../entities/meny/flow";

interface Props {
    openFile: (model: SystemModel) => void;
    saveFile: () => SystemModel;
}

export default class Meny extends React.Component<Props> {

    private _openFileRef: HTMLFormElement | null;

    constructor(props: Props) {
        super(props);

        this.readFile = this.readFile.bind(this);
        this.downloadFile = this.downloadFile.bind(this);
        this.processResult = this.processResult.bind(this);
        this.handleFileError = this.handleFileError.bind(this);
        this.reportError = this.reportError.bind(this);
        this.prepareDataToDownload = this.prepareDataToDownload.bind(this);

        this._openFileRef = null;
    }

    render() {
        let openFile;
        if (window.FileReader && window.FileList) {
            openFile = (
                <React.Fragment>
                    <form
                        ref={(ref) => this._openFileRef = ref}
                        style={{display: 'inline-block'}}
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
                <div title='File API not supported' style={{display: 'inline-block'}}>
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
        if (files === null || files.length !== 1) {
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
        const data = JSON.stringify(this.prepareDataToDownload(), null, '\t');

        var element = document.createElement('a');
        element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(data));
        element.setAttribute('download', 'HazardOntology.json');
        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();
        document.body.removeChild(element);
    }

    private prepareDataToDownload() {
        const data = this.props.saveFile();
        return {
            ...data,
            ...{
                systemObjectConnections: this.patchCollapsedConnections(data.systemObjectConnections),
                currentStep: this.serializeStepId(data.currentStep),
                lastCompletedStep: this.serializeStepId(data.lastCompletedStep)
            }
        };
    }

    private prepareReadData(data: any) {
        return {
            ...data,
            ...{
                currentStep: this.deserializeStepId(data.currentStep),
                lastCompletedStep: this.deserializeStepId(data.lastCompletedStep)
            }
        };
    }

    private patchCollapsedConnections(connections: Connection[]) {
        // needed as cytoscape.js-expand-collapse modifies the model so that it brings circular references
        return connections.map(e => {
            if (isConnectionToCollapsed(e)) {
                return {
                    id: e.id,
                    source: e.originalEnds.source.data().id,
                    target: e.originalEnds.target.data().id
                };
            }
            return e;
        });
    }

    private serializeStepId(step: FlowStepId) {
        return step.name;
    }

    private deserializeStepId(name: string) {
        for (var key in flowSteps) {
            if (flowSteps[key].name === name) {
                return flowSteps[key];
            }
        }
        throw new Error(`Unknown flow step id - ${name}`);
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
        const model = this.prepareReadData(JSON.parse(data));
        this._openFileRef && this._openFileRef.reset();
        this.props.openFile(model);
    }
};
