import React from "react";
import { SystemModel } from "../../entities/system-model";
import { Button, Menu, MenuItem } from "@material-ui/core";
import { isConnectionToCollapsed } from "../../entities/system-description/system-description-entity";
import Connection from "../../entities/system-description/connection";
import { FlowStepId } from "../../entities/meny/flow-step";
import { flowSteps } from "../../entities/meny/flow";

interface Props {
    openFile: (model: SystemModel) => void;
    saveFile: () => SystemModel;
}

interface State {
    anchorEl: any;
}

export default class Meny extends React.Component<Props, State> {

    private _openFileRef: HTMLFormElement | null;

    constructor(props: Props) {
        super(props);

        this.readFile = this.readFile.bind(this);
        this.downloadFile = this.downloadFile.bind(this);
        this.processResult = this.processResult.bind(this);
        this.handleFileError = this.handleFileError.bind(this);
        this.reportError = this.reportError.bind(this);
        this.openMenu = this.openMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
        this.prepareDataToDownload = this.prepareDataToDownload.bind(this);

        this.state = {
            anchorEl: null
        };
        this._openFileRef = null;
    }

    render() {
        let openFile;
        if (window.FileReader && window.FileList) {
            openFile = <form ref={(ref) => this._openFileRef = ref}>
                <input
                    type="file"
                    onChange={(ev) => this.readFile(ev.target.files)}
                    accept=".json" />
            </form>;
        } else {
            openFile = <span>File API not supported</span>;
        }

        return (
            <React.Fragment>
                <Button color="inherit" onClick={this.openMenu}>File</Button>
                <Menu
                    anchorEl={this.state.anchorEl}
                    keepMounted
                    open={Boolean(this.state.anchorEl)}
                    onClose={this.closeMenu}
                >
                    <MenuItem>{openFile}</MenuItem>
                    <MenuItem onClick={this.downloadFile}>Download</MenuItem>
                </Menu>
            </React.Fragment>
        );
    }

    private openMenu(event: any) {
        this.setState({ anchorEl: event.currentTarget });
    };

    private closeMenu() {
        this.setState({ anchorEl: null });
    };

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

        this.closeMenu();
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

        this.closeMenu();
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
