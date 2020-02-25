import React from 'react';
import { Core, Singular, NodeSingular, EventObjectNode } from 'cytoscape';
import Subsystem from '../../entities/system-description/subsystem';
import ElementActions from './element-actions';

interface Props {
    subsystem: Subsystem;
    cy: Core;
    subsystemDeleted: (nodeIds: string[]) => void,
    subsystemEditing: (subsystem: Subsystem) => void,
    subsystemRepositioned: (subsystem: Subsystem) => void,
}

export default class SubsystemActions extends React.Component<Props> {

    private readonly EVENT_DRAGFREE = 'dragfree';

    private ele: NodeSingular | null = null;

    constructor(props: Props) {
        super(props);
        this.deleteWithChildren = this.deleteWithChildren.bind(this);
        this.initPopper = this.initPopper.bind(this);
        this.savePosition = this.savePosition.bind(this);
    }

    render() {
        return <ElementActions
            id={this.props.subsystem.id}
            cy={this.props.cy}
            elementDeleted={this.deleteWithChildren}
            popperInitialized={this.initPopper}
            updateRequired={true}>
            <button type='button' onClick={() => this.props.subsystemEditing(this.props.subsystem)}>Edit</button>
        </ElementActions>;
    }

    shouldComponentUpdate() {
        return false;
    }

    componentWillUnmount() {
        this.ele && this.ele.off(this.EVENT_DRAGFREE, undefined, this.savePosition);
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

    private savePosition(event: EventObjectNode) {
        const newPosition = event.target.position();
        const updatedObj = { ...this.props.subsystem, ...{ posX: newPosition.x, posY: newPosition.y } };
        this.props.subsystemRepositioned(updatedObj);
    }    

    private initPopper(popperObj: any, ele: Singular) {
        if (ele.isNode()) {
            this.ele = ele;
            ele.on(this.EVENT_DRAGFREE, this.savePosition);
        }
    }
};
