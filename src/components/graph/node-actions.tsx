import React from 'react';
import { Core, Singular, NodeSingular, EventObjectNode } from 'cytoscape';
import SystemObject from '../../entities/system-description/system-object';
import ElementActions from './element-actions';
import ObjectConnections from '../../entities/system-description/object-connections';

interface Props {
    object: SystemObject,
    cy: Core,
    isConnectionCreating: boolean,
    nodeDeleted: (nodeAndEdgesIds: string[]) => void,
    nodeUpdated: (updatedObj: SystemObject) => void,
    connectionCreateStarted: (source: ObjectConnections) => void,
    onClick: (obj: SystemObject) => void,
    onMouseOver: (obj: SystemObject) => void,
    onMouseOut: (obj: SystemObject) => void
}

export default class NodeActions extends React.Component<Props> {

    private readonly EVENT_DRAGFREE = 'dragfree';
    private readonly EVENT_CLICK = 'click';

    private ele: NodeSingular | null = null;

    constructor(props: Props) {
        super(props);

        this.initPopper = this.initPopper.bind(this);
        this.rename = this.rename.bind(this);
        this.saveNodePosition = this.saveNodePosition.bind(this);
        this.deleteNodeWithEdges = this.deleteNodeWithEdges.bind(this);
        this.nodeClicked = this.nodeClicked.bind(this);
        this.startCreateConnection = this.startCreateConnection.bind(this);
        this.mouseEntered = this.mouseEntered.bind(this);
        this.mouseLeft = this.mouseLeft.bind(this);

        this.state = {
            isActive: false
        };
    }

    render() {
        return (
            <ElementActions 
            id={this.props.object.id} 
            cy={this.props.cy} 
            elementDeleted={this.deleteNodeWithEdges} 
            popperInitialized={this.initPopper}
            updateRequired={true}
            mouseEntered={this.mouseEntered}
            mouseLeft={this.mouseLeft}
            childrenStatic={<span>{this.props.isConnectionCreating ? 'linking' : ''}</span>}>
                <button type='button' onClick={this.startCreateConnection}>Link</button>
                <button type='button' onClick={this.rename}>Rename</button>
            </ElementActions>
        );
    };

    shouldComponentUpdate(nextProps: Readonly<Props>) {
        return this.props.isConnectionCreating !== nextProps.isConnectionCreating;
    }

    componentWillUnmount() {
        this.ele && this.ele.off(this.EVENT_DRAGFREE, undefined, this.saveNodePosition);
        this.ele && this.ele.off(this.EVENT_CLICK, undefined, this.nodeClicked);
    }

    private mouseEntered() {
        this.props.onMouseOver(this.props.object);        
    }

    private mouseLeft() {
        this.props.onMouseOut(this.props.object);        
    }

    private startCreateConnection() {
        if (!this.ele) {
            return;
        }
        const connections = this.ele.connectedEdges().map(e => e.data());
        this.props.connectionCreateStarted({
            object: this.props.object,
            connections: connections
        });
    }

    private nodeClicked() {
        this.props.onClick(this.props.object);
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
            ele.on(this.EVENT_CLICK, this.nodeClicked);
        }
    }
};
