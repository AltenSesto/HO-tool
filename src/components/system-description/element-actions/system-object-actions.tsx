import React from 'react';
import { Core, Singular, NodeSingular, EventObjectNode } from 'cytoscape';
import IconButton from '@material-ui/core/IconButton';
import { Link, Edit, Delete } from '@material-ui/icons';

import SystemObject from '../../../entities/system-description/system-object';
import ElementActions from '../../graph/element-actions';
import ObjectConnections from '../../../entities/system-description/object-connections';
import { ObjectTypes } from '../../../entities/system-description/object-types';

interface Props {
    object: SystemObject,
    cy: Core,
    currentFlowStep: string,
    isConnectionCreating: boolean,
    nodeDeleted: (nodeAndEdgesIds: string[]) => void,
    nodeEditing: (obj: SystemObject) => void,
    nodeRepositioned: (updatedObj: SystemObject) => void,
    connectionCreateStarted: (source: ObjectConnections) => void,
    onClick: (obj: SystemObject) => void,
    onMouseOver: (obj: SystemObject) => void,
    onMouseOut: (obj: SystemObject) => void,
    onElementMoved: (position: { x: number, y: number }, width: number, height: number) => void
}

export default class SystemObjectActions extends React.Component<Props> {

    private ele: NodeSingular | null = null;

    constructor(props: Props) {
        super(props);

        this.initPopper = this.initPopper.bind(this);
        this.saveNodePosition = this.saveNodePosition.bind(this);
        this.deleteNodeWithEdges = this.deleteNodeWithEdges.bind(this);
        this.nodeClicked = this.nodeClicked.bind(this);
        this.startCreateConnection = this.startCreateConnection.bind(this);
        this.mouseEntered = this.mouseEntered.bind(this);
        this.mouseLeft = this.mouseLeft.bind(this);
        this.isParentExpanded = this.isParentExpanded.bind(this);
        this.elementMoved = this.elementMoved.bind(this);
        this.isConnectingAllowed = this.isConnectingAllowed.bind(this);
        this.isEditingAllowed = this.isEditingAllowed.bind(this);
    }

    render() {
        let actionButtons = <React.Fragment></React.Fragment>;
        if (!this.props.isConnectionCreating) {
            actionButtons = (
                <React.Fragment>
                    {this.isConnectingAllowed() ? (
                        <IconButton title="Connect" onClick={this.startCreateConnection}>
                            <Link />
                        </IconButton>
                    ) : null}
                    {this.isEditingAllowed() ? (
                        <React.Fragment>
                            <IconButton title="Edit" onClick={() => this.props.nodeEditing(this.props.object)}>
                                <Edit />
                            </IconButton>
                            <IconButton title="Delete" onClick={this.deleteNodeWithEdges}>
                                <Delete />
                            </IconButton>
                        </React.Fragment>
                    ) : null}
                </React.Fragment>
            );
        }

        return (
            <ElementActions
                id={this.props.object.id}
                cy={this.props.cy}
                elementDeleted={this.deleteNodeWithEdges}
                popperInitialized={this.initPopper}
                mouseEntered={this.mouseEntered}
                mouseLeft={this.mouseLeft}
                allowActionsVisible={this.isParentExpanded}
                childrenStatic={this.props.isConnectionCreating ? <Link /> : undefined}
                elementMoving={this.elementMoved}
            >
                {actionButtons}
            </ElementActions>
        );
    };

    shouldComponentUpdate(nextProps: Readonly<Props>) {
        return this.props.isConnectionCreating !== nextProps.isConnectionCreating || this.props.currentFlowStep !== nextProps.currentFlowStep;
    }

    componentWillUnmount() {
        this.ele && this.ele.off(ElementActions.EVENT_DRAGFREE, undefined, this.saveNodePosition);
        this.ele && this.ele.off(ElementActions.EVENT_CLICK, undefined, this.nodeClicked);
    }

    private isConnectingAllowed() {
        switch (this.props.currentFlowStep) {
            case 'SDF-1':
            case 'SDF-2':
                return this.props.object.type === ObjectTypes.kind;
            case 'SDF-3':
                return this.props.object.type === ObjectTypes.relator || this.props.object.type === ObjectTypes.role;
            case 'SDF-4':
                return this.props.object.type === ObjectTypes.role;
        }
        return false;
    }

    private isEditingAllowed() {
        switch (this.props.currentFlowStep) {
            case 'SDF-1':
                return this.props.object.type === ObjectTypes.kind || this.props.object.type === ObjectTypes.role;
            case 'SDF-3':
                return this.props.object.type === ObjectTypes.relator;
        }
        return false;
    }

    private isParentExpanded() {
        // cytoscape.js-expand-collapse excludes a node from the graph when it's parent collapses, so the parent is lost
        if (!this.ele) {
            return true;
        }
        return !(this.ele.parent().length === 0 && this.props.object.parent);
    }

    private elementMoved() {
        if (this.ele) {
            const position = this.ele.position();
            this.props.onElementMoved(position, this.ele.outerWidth(), this.ele.outerHeight())
        }
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
        this.props.nodeRepositioned(updatedObj);
    }

    private initPopper(_popperObj: any, ele: Singular) {
        if (ele.isNode()) {
            this.ele = ele;
            ele.on(ElementActions.EVENT_DRAGFREE, this.saveNodePosition);
            ele.on(ElementActions.EVENT_CLICK, this.nodeClicked);
            this.elementMoved(); // to set canvas size on loading graph from file
        }
    }
};
