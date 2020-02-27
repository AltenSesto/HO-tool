import React from 'react';
import { Core, Singular, NodeSingular, EdgeSingular } from 'cytoscape';
import ElementActions from './element-actions';

interface Props {
    id: string;
    cy: Core;
    elementDeleted: (id: string) => void;
}

export default class ConnectionActions extends React.Component<Props> {

    private node: NodeSingular | null = null;
    private node1: NodeSingular | null = null;
    private ele: EdgeSingular | null = null;

    constructor(props: Props) {
        super(props);

        this.initPopper = this.initPopper.bind(this);
        this.updatePopperPosition = this.updatePopperPosition.bind(this);
        this.areBothEndsExpanded = this.areBothEndsExpanded.bind(this);
    }

    render() {
        return <ElementActions
            id={this.props.id}
            cy={this.props.cy}
            elementDeleted={this.props.elementDeleted}
            allowActionsVisible={this.areBothEndsExpanded}
            popperInitialized={this.initPopper}>
        </ElementActions>;
    };

    componentWillUnmount() {
        this.node && this.node.off(ElementActions.EVENT_POSITION, undefined, this.updatePopperPosition);
        this.node1 && this.node1.off(ElementActions.EVENT_POSITION, undefined, this.updatePopperPosition);
    }

    shouldComponentUpdate() {
        return false;
    }

    private areBothEndsExpanded() {
        // connection is not visible only if it's source and target nodes both belong to the same subsystem which is collapsed
        // cytoscape.js-expand-collapse excludes a node from the graph when it's parent collapses, so the parent is lost
        if (this.node === null || this.node1 === null) {
            return true;
        }
        const expectedParentSource = this.node.data().object.parent;
        const expectedParentTarget = this.node1.data().object.parent;
        const actualParentSource = this.node.parent();
        return !(expectedParentSource === expectedParentTarget && expectedParentSource && actualParentSource.length === 0);
    }

    private updatePopperPosition() {
        this.ele && this.ele.trigger(ElementActions.EVENT_POSITION);
    }

    private initPopper(_popperObj: any, ele: Singular) {
        if (ele.isEdge()) {
            this.ele = ele;
            const nodes = ele.connectedNodes();
            this.node = nodes[0];
            this.node1 = nodes[1];
        } 
        this.node && this.node.on(ElementActions.EVENT_POSITION, this.updatePopperPosition);
        this.node1 && this.node1.on(ElementActions.EVENT_POSITION, this.updatePopperPosition);
    }
};
