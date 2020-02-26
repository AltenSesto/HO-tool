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
    }

    render() {
        return <ElementActions
            id={this.props.id}
            cy={this.props.cy}
            elementDeleted={this.props.elementDeleted}>
        </ElementActions>;
    };

    componentWillUnmount() {
        this.node && this.node.off(ElementActions.EVENT_POSITION, undefined, this.updatePopperPosition);
        this.node1 && this.node1.off(ElementActions.EVENT_POSITION, undefined, this.updatePopperPosition);
    }

    shouldComponentUpdate() {
        return false;
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
