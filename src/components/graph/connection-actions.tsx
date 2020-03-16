import React from 'react';
import { Core, Singular, NodeSingular, EdgeSingular } from 'cytoscape';
import ElementActions from './element-actions';
import { IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';

interface Props {
    id: string;
    cy: Core;
    elementDeleted: (id: string) => void;
}

export default class ConnectionActions extends React.Component<Props> {

    private nodeSource: NodeSingular | null = null;
    private nodeTarget: NodeSingular | null = null;
    private ele: EdgeSingular | null = null;

    constructor(props: Props) {
        super(props);

        this.initPopper = this.initPopper.bind(this);
        this.updatePopperPosition = this.updatePopperPosition.bind(this);
        this.areNotBothEndsCollapsed = this.areNotBothEndsCollapsed.bind(this);
    }

    render() {
        return (
            <ElementActions
                id={this.props.id}
                cy={this.props.cy}
                elementDeleted={this.props.elementDeleted}
                allowActionsVisible={this.areNotBothEndsCollapsed}
                popperInitialized={this.initPopper}
            >
                <IconButton
                    title='Delete'
                    onClick={() => this.props.elementDeleted(this.props.id)}
                    size='small'
                >
                    <Delete />
                </IconButton>
            </ElementActions>
        );
    };

    componentWillUnmount() {
        this.nodeSource && this.nodeSource.off(ElementActions.EVENT_POSITION, undefined, this.updatePopperPosition);
        this.nodeTarget && this.nodeTarget.off(ElementActions.EVENT_POSITION, undefined, this.updatePopperPosition);
    }

    shouldComponentUpdate() {
        return false;
    }

    private areNotBothEndsCollapsed() {
        // connection is not visible only if it's source and target nodes both belong to the same subsystem which is collapsed
        // cytoscape.js-expand-collapse excludes a node from the graph when it's parent collapses, so the parent is lost
        if (this.nodeSource === null || this.nodeTarget === null) {
            return true;
        }
        // if one end lies inside a collapsed subsystem it is set to the subsystem itself, not the actual node
        if (!this.nodeSource.data().object || !this.nodeTarget.data().object) {
            return true;
        }
        const expectedParentSource = this.nodeSource.data().object.parent;
        const expectedParentTarget = this.nodeTarget.data().object.parent;
        const actualParentSource = this.nodeSource.parent();
        return !(expectedParentSource === expectedParentTarget && expectedParentSource && actualParentSource.length === 0);
    }

    private updatePopperPosition() {
        this.ele && this.ele.trigger(ElementActions.EVENT_POSITION);
    }

    private initPopper(_popperObj: any, ele: Singular) {
        if (ele.isEdge()) {
            this.ele = ele;
            this.nodeSource = ele.source();
            this.nodeTarget = ele.target();
        }
        this.nodeSource && this.nodeSource.on(ElementActions.EVENT_POSITION, this.updatePopperPosition);
        this.nodeTarget && this.nodeTarget.on(ElementActions.EVENT_POSITION, this.updatePopperPosition);
    }
};
