import React from 'react';
import { Core, Singular, NodeSingular, EventObjectNode } from 'cytoscape';
import IconButton from '@material-ui/core/IconButton';
import LinkIcon from "@material-ui/icons/Link";
import EditIcon from "@material-ui/icons/Edit";

import SystemObject from '../../../entities/system-description/system-object';
import ElementActions from '../../graph/element-actions';
import ObjectConnections from '../../../entities/system-description/object-connections';

interface Props {
    object: SystemObject,
    cy: Core,
    isConnectionCreating: boolean,
    nodeDeleted: (nodeAndEdgesIds: string[]) => void,
    nodeEditing: (obj: SystemObject) => void,
    nodeRepositioned: (updatedObj: SystemObject) => void,
    connectionCreateStarted: (source: ObjectConnections) => void,
    onClick: (obj: SystemObject) => void,
    onMouseOver: (obj: SystemObject) => void,
    onMouseOut: (obj: SystemObject) => void,
    onElementMoved: (position: {x: number, y: number}, width: number, height: number) => void
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
    }

    render() {
        return (
            <ElementActions
                id={this.props.object.id}
                cy={this.props.cy}
                elementDeleted={this.deleteNodeWithEdges}
                popperInitialized={this.initPopper}
                mouseEntered={this.mouseEntered}
                mouseLeft={this.mouseLeft}
                allowActionsVisible={this.isParentExpanded}
                childrenStatic={this.props.isConnectionCreating ? <LinkIcon /> : undefined}
                childrenOverride={this.props.isConnectionCreating ? <React.Fragment></React.Fragment> : undefined}
                elementMoving={this.elementMoved}
            >
                <IconButton title="Connect" onClick={this.startCreateConnection}>
                    <LinkIcon />
                </IconButton>
                <IconButton title="Edit" onClick={() => this.props.nodeEditing(this.props.object)}>
                    <EditIcon />
                </IconButton>
            </ElementActions>
        );
    };

    shouldComponentUpdate(nextProps: Readonly<Props>) {
        return this.props.isConnectionCreating !== nextProps.isConnectionCreating;
    }

    componentWillUnmount() {
        this.ele && this.ele.off(ElementActions.EVENT_DRAGFREE, undefined, this.saveNodePosition);
        this.ele && this.ele.off(ElementActions.EVENT_CLICK, undefined, this.nodeClicked);
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
        const connections = this.ele.connectedEdges()
            .map(e => { return { id: e.data().id, source: e.data().source, target: e.data().target }; });
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
