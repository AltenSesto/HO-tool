import React from 'react';
import { Core, Singular, NodeSingular, EventObjectNode, EventObject } from 'cytoscape';
import Subsystem from '../../entities/system-description/subsystem';
import ElementActions from './element-actions';

interface Props {
    subsystem: Subsystem;
    cy: Core;
    subsystemDeleted: (nodeIds: string[]) => void,
    subsystemEditing: (subsystem: Subsystem) => void,
    subsystemUpdated: (subsystem: Subsystem) => void,
}

export default class SubsystemActions extends React.Component<Props> {

    private readonly EVENT_DRAGFREE = 'dragfree';
    private readonly EVENT_POSITION = 'position';
    private readonly EVENT_MOVE = 'move';
    private readonly EVENT_ADD = 'add';
    private readonly EVENT_REMOVE = 'remove';

    private ele: NodeSingular | null = null;
    private children: string[] = [];
    private collapseAPI: any;

    constructor(props: Props) {
        super(props);
        this.collapseAPI = (this.props.cy as any).expandCollapse('get');

        this.deleteWithChildren = this.deleteWithChildren.bind(this);
        this.initPopper = this.initPopper.bind(this);
        this.updatePositionOnMove = this.updatePositionOnMove.bind(this);
        this.updatePositionOnChildAdded = this.updatePositionOnChildAdded.bind(this);
        this.updatePositionOnChildRemoved = this.updatePositionOnChildRemoved.bind(this);
        this.updatePositionOnParentChanged = this.updatePositionOnParentChanged.bind(this);
        this.savePosition = this.savePosition.bind(this);
        this.toggleCollapsedState = this.toggleCollapsedState.bind(this);
    }

    render() {
        return <ElementActions
            id={this.props.subsystem.id}
            cy={this.props.cy}
            elementDeleted={this.deleteWithChildren}
            popperInitialized={this.initPopper}
            updateRequired={true}>
            <button type='button' onClick={this.toggleCollapsedState}>
                {this.props.subsystem.isCollapsed ? 'Expand' : 'Collapse'}
            </button>
            <button type='button' onClick={() => this.props.subsystemEditing(this.props.subsystem)}>Edit</button>
        </ElementActions>;
    }

    shouldComponentUpdate(newProps: Readonly<Props>) {
        return newProps.subsystem.isCollapsed !== this.props.subsystem.isCollapsed;
    }

    componentWillUnmount() {
        this.ele && this.ele.off(this.EVENT_DRAGFREE, undefined, this.updatePositionOnMove);
        this.props.cy.off(this.EVENT_ADD, undefined, this.updatePositionOnChildAdded);
        this.props.cy.off(this.EVENT_REMOVE, undefined, this.updatePositionOnChildRemoved);
        this.props.cy.off(this.EVENT_MOVE, undefined, this.updatePositionOnParentChanged);
    }

    private toggleCollapsedState() {
        const newStateCollapsed = !this.props.subsystem.isCollapsed;
        if (newStateCollapsed) {
            this.collapseAPI.collapse(this.ele);
        } else {
            this.collapseAPI.expand(this.ele);
        }

        this.props.subsystemUpdated({ ...this.props.subsystem, ...{ isCollapsed: newStateCollapsed } });
    }

    private deleteWithChildren() {
        let ids = [this.props.subsystem.id];
        if (this.ele) {
            const children = this.ele.children();
            if (children.length > 0 && !window.confirm('All the objects in the subsystem will be removed as well. Continue?')) {
                return;
            }
            ids = children.reduce((prev, curr) => {
                return prev.concat(curr.connectedEdges().map(e => e.data().id).concat(curr.data().id))
            }, ids);
        }
        this.props.subsystemDeleted(ids);
    }

    private updatePositionOnMove(event: EventObjectNode) {
        const newPosition = event.target.position();
        if (this.ele) {
            this.ele.children().forEach(e => { e.trigger(this.EVENT_POSITION); });
        }
        this.savePosition(newPosition);
    }

    private updatePositionOnChildAdded(event: EventObject) {
        const node: Singular = event.target.element();
        if (node.isNode() && this.ele) {
            const parent = node.parent();
            if (parent.length > 0 && parent[0].data().id === this.props.subsystem.id) {
                this.children = this.children.concat(node.data().id);
                this.ele.trigger(this.EVENT_POSITION);
            }
        }
    }

    private updatePositionOnChildRemoved(event: EventObject) {
        const node: Singular = event.target.element();
        if (node.isNode() && this.ele) {
            const nodeId = node.data().id;
            if (this.children.indexOf(nodeId) > -1) {
                this.children = this.children.filter(e => e !== nodeId);
                this.ele.trigger(this.EVENT_POSITION);
                // if no more children we have to track our position ourself
                this.savePosition(this.ele.position());
            }
        }
    }

    private updatePositionOnParentChanged(event: EventObject) {
        this.updatePositionOnChildAdded(event);
        this.updatePositionOnChildRemoved(event);
    }

    private savePosition(position: cytoscape.Position) {
        if (this.ele && this.ele.children().length > 0) {
            // position of non-empty subsystem is defined by its children
            return;
        }
        const updatedObj = { ...this.props.subsystem, ...{ posX: position.x, posY: position.y } };
        this.props.subsystemUpdated(updatedObj);
    }

    private initPopper(_popperObj: any, ele: Singular) {
        if (ele.isNode()) {
            this.ele = ele;
            if (this.props.subsystem.isCollapsed) {
                this.collapseAPI.collapse(ele);
            }

            ele.on(this.EVENT_DRAGFREE, this.updatePositionOnMove);
            this.props.cy.on(this.EVENT_REMOVE, this.updatePositionOnChildRemoved);
            this.props.cy.on(this.EVENT_ADD, this.updatePositionOnChildAdded);
            this.props.cy.on(this.EVENT_MOVE, this.updatePositionOnParentChanged);
        }
    }
};
