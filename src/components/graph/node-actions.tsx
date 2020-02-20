import React from 'react';
import { Core } from 'cytoscape';
import SystemObject from '../../entities/system-description/system-object';

interface Props {
    object: SystemObject,
    cy: Core,
    nodeDeleted: (id: string) => void,
    nodeUpdated: (updatedObj: SystemObject) => void
}

export default class NodeActions extends React.Component<Props> {

    private readonly CY_EVENTS = 'pan zoom';
    private readonly EVENT_ADD = 'add';
    private readonly EVENT_POSITION = 'position';
    private readonly EVENT_DRAGFREE = 'dragfree';

    private ele: any = null;
    private popperObj: any = null;
    private root: HTMLElement | null = null;

    constructor(props: Props) {
        super(props);
        this.updatePopperPosition = this.updatePopperPosition.bind(this);
        this.initPopper = this.initPopper.bind(this);
        this.rename = this.rename.bind(this);
        this.saveNodePosition = this.saveNodePosition.bind(this);
    }

    render() {
        console.log('render ' + this.props.object.id);
        return (
            <div ref={r => this.root = r} style={{ marginBottom: '10px', zIndex: 100 }}>
                <span>{this.props.object.id}</span>
                <button type='button' onClick={this.rename}>Rename</button>
                <button type='button' onClick={() => this.props.nodeDeleted(this.props.object.id)}>Delete</button>
            </div>
        );
    };

    componentDidMount() {
        console.log('mount ' + this.props.object.id);
        this.props.cy.on(this.EVENT_ADD, this.initPopper);
    }

    componentWillUnmount() {
        console.log('unmount ' + this.props.object.id);
        this.ele && this.ele.removeAllListeners();
        this.props.cy.off(this.CY_EVENTS, undefined, this.updatePopperPosition);
        this.props.cy.off(this.EVENT_ADD, undefined, this.initPopper);
    }

    shouldComponentUpdate() {
        return false;
    }

    private saveNodePosition(event: any) {
        const newPosition = event.target[0].position();
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

    private initPopper(event: any) {
        const ele = event.target.element();
        if (ele.data()['id'] !== this.props.object.id) {
            // some other component's event
            return;
        }

        this.ele = ele;

        this.popperObj = ele.popper({
            content: () => this.root,
            popper: {
                placement: 'top'
            }
        });
        this.ele.on(this.EVENT_POSITION, this.updatePopperPosition);
        this.ele.on(this.EVENT_DRAGFREE, this.saveNodePosition);
        this.props.cy.on(this.CY_EVENTS, this.updatePopperPosition);
        this.props.cy.off(this.EVENT_ADD, undefined, this.initPopper);
    }

    private updatePopperPosition() {
        this.popperObj && this.popperObj.scheduleUpdate();
    }
};
