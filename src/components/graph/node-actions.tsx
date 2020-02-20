import React from 'react';
import { Core, Singular, NodeSingular, EventObjectNode } from 'cytoscape';
import SystemObject from '../../entities/system-description/system-object';
import ElementActions from './element-actions';

interface Props {
    object: SystemObject,
    cy: Core,
    nodeDeleted: (nodeAndEdgesIds: string[]) => void,
    nodeUpdated: (updatedObj: SystemObject) => void
}

export default class NodeActions extends React.Component<Props> {

    private readonly EVENT_DRAGFREE = 'dragfree';

    private ele: NodeSingular | null = null;

    constructor(props: Props) {
        super(props);
        this.initPopper = this.initPopper.bind(this);
        this.rename = this.rename.bind(this);
        this.saveNodePosition = this.saveNodePosition.bind(this);
        this.deleteNodeWithEdges = this.deleteNodeWithEdges.bind(this);
    }

    render() {
        return (
            <ElementActions id={this.props.object.id} cy={this.props.cy} elementDeleted={this.deleteNodeWithEdges} popperInitialized={this.initPopper}>
                <button type='button' onClick={this.rename}>Rename</button>
            </ElementActions>
        );
    };

    shouldComponentUpdate() {
        return false;
    }

    componentWillUnmount() {
        this.ele && this.ele.off(this.EVENT_DRAGFREE, undefined, this.saveNodePosition);
    }

    private deleteNodeWithEdges() {
        let ids = [this.props.object.id];
        if (this.ele) {
            ids = ids.concat(this.ele.connectedEdges().map(e => e.data().id));
        }
        this.props.nodeDeleted(ids);
    }

    private saveNodePosition(event: EventObjectNode) {
        const newPosition = event.target.position();
        const updatedObj = { ...this.props.object, ...{ posX: newPosition.x, posY: newPosition.y } };
        this.props.nodeUpdated(updatedObj);
    }    

    private rename() {
        const name = prompt('Enter name');
        if (!name || !name.trim()) {
            return;
        }
        const updatedObj = { ...this.props.object, ...{ name } };
        this.props.nodeUpdated(updatedObj);
    }

    private initPopper(_popperObj: any, ele: Singular) {
        if (ele.isNode()) {
            this.ele = ele;
            ele.on(this.EVENT_DRAGFREE, this.saveNodePosition);
        }
    }
};
