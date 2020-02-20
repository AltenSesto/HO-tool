import React from 'react';
import { Core, Singular, EventObject } from 'cytoscape';

interface Props {
    id: string,
    cy: Core,
    popperInitialized: (popperObj: any, ele: Singular) => void,
    elementDeleted: (id: string) => void
}

export default class ElementActions extends React.Component<Props> {

    private readonly CY_EVENTS = 'pan zoom';
    private readonly EVENT_ADD = 'add';
    private readonly EVENT_POSITION = 'position';

    private ele: Singular | null = null;
    private popperObj: any = null;
    private root: HTMLElement | null = null;

    constructor(props: Props) {
        super(props);
        this.updatePopperPosition = this.updatePopperPosition.bind(this);
        this.initPopper = this.initPopper.bind(this);
    }

    render() {
        return (
            <div ref={r => this.root = r} style={{ marginBottom: '10px', zIndex: 100 }}>
                <span>{this.props.id}</span>
                {this.props.children}
                <button type='button' onClick={() => this.props.elementDeleted(this.props.id)}>Delete</button>
            </div>
        );
    };

    componentDidMount() {
        this.props.cy.on(this.EVENT_ADD, this.initPopper);
    }

    componentWillUnmount() {
        this.ele && this.ele.off(this.EVENT_POSITION, undefined, this.updatePopperPosition);
        this.props.cy.off(this.CY_EVENTS, undefined, this.updatePopperPosition);
        this.props.cy.off(this.EVENT_ADD, undefined, this.initPopper);
    }

    shouldComponentUpdate() {
        return false;
    }

    private initPopper(event: EventObject) {
        const ele = event.target.element();
        if (ele.data()['id'] !== this.props.id) {
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
        this.ele && this.ele.on(this.EVENT_POSITION, this.updatePopperPosition);
        this.props.cy.on(this.CY_EVENTS, this.updatePopperPosition);
        this.props.cy.off(this.EVENT_ADD, undefined, this.initPopper);

        this.props.popperInitialized(this.popperObj, this.ele as Singular);
    }

    private updatePopperPosition() {
        this.popperObj && this.popperObj.scheduleUpdate();
    }
};
