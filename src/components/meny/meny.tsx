import React from "react";
import { SystemModel } from "../../entities/system-model";

interface Props {
    
    openFile: (model: SystemModel) => void;
    saveFile: () => SystemModel;
}

export default class Meny extends React.Component<Props> {
    constructor(props: Props) {
        super(props);

        this.readFile = this.readFile.bind(this);
        this.downloadFile = this.downloadFile.bind(this);
        this.processResult = this.processResult.bind(this);
        this.handleFileError = this.handleFileError.bind(this);
        this.reportError = this.reportError.bind(this);
    }
       
    render () {
        let openFile;
        if (window.FileReader && window.FileList) {
            openFile = <input type="file" onChange={(ev) => this.readFile(ev.target.files)} accept=".json"/>;
        } else {
            openFile = <span>File API not supported</span>;
        }

        return (
            <div>
                {openFile}
                <button type="button" onClick={this.downloadFile}>Download</button>
            </div>
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
        const data = JSON.stringify(this.props.saveFile(), null, '\t');

        var element = document.createElement('a');
        element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(data));
        element.setAttribute('download', 'HazardOntology.json');
        element.style.display = 'none';
        document.body.appendChild(element);
      
        element.click();
        document.body.removeChild(element);
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
        
        this.props.openFile(model);
    }
};
