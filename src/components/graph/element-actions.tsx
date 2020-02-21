import React, { ReactElement } from 'react';
import { Core, Singular, EventObject, NodeSingular } from 'cytoscape';
import Popper from 'popper.js';

interface Props {
    id: string;
    cy: Core;
    updateRequired: boolean;
    childrenStatic?: ReactElement;
    popperInitialized?: (popperObj: any, ele: Singular) => void;
    mouseEntered?: () => void;
    mouseLeft?: () => void;
    elementDeleted: (id: string) => void;
}

interface State {
    areActionsVisible: boolean;
}

export default class ElementActions extends React.Component<Props, State> {

    private readonly CY_EVENTS = 'pan zoom';
    private readonly EVENT_ADD = 'add';
    private readonly EVENT_POSITION = 'position';
    private readonly EVENT_MOUSEOVER = 'mouseover';
    private readonly EVENT_MOUSEOUT = 'mouseout';

    private ele: Singular | null = null;
    private node: NodeSingular | null = null;
    private node1: NodeSingular | null = null;
    private popperObj: Popper | null = null;
    private root: HTMLElement | null = null;

    constructor(props: Props) {
        super(props);

        this.updatePopperPosition = this.updatePopperPosition.bind(this);
        this.initPopper = this.initPopper.bind(this);
        this.mouseEntered = this.mouseEntered.bind(this);
        this.mouseLeft = this.mouseLeft.bind(this);

        this.state = {
            areActionsVisible: false
        };
    }

    render() {
        const visibility = this.state.areActionsVisible ? 'visible' : 'hidden';
        return (
            <div ref={r => this.root = r} style={{ marginBottom: '10px', zIndex: 100 }}
                onMouseEnter={() => this.setState({ areActionsVisible: true })}
                onMouseLeave={() => this.setState({ areActionsVisible: false })}>
                {this.props.childrenStatic}
                <div style={{ visibility: visibility }}>
                    {this.props.children}
                    <button type='button' onClick={() => this.props.elementDeleted(this.props.id)}>Delete</button>
                </div>
            </div>
        );
    };

    componentDidMount() {
        this.props.cy.on(this.EVENT_ADD, this.initPopper);
    }

    componentWillUnmount() {
        this.node && this.node.off(this.EVENT_POSITION, undefined, this.updatePopperPosition);
        this.node1 && this.node1.off(this.EVENT_POSITION, undefined, this.updatePopperPosition);
        this.props.cy.off(this.CY_EVENTS, undefined, this.updatePopperPosition);
        this.props.cy.off(this.EVENT_ADD, undefined, this.initPopper);
        this.ele && this.ele.off(this.EVENT_MOUSEOVER, undefined, this.mouseEntered);
        this.ele && this.ele.off(this.EVENT_MOUSEOUT, undefined, this.mouseLeft);
    }

    shouldComponentUpdate(_newProps: Readonly<Props>, newState: Readonly<State>) {
        return this.props.updateRequired || this.state !== newState;
    }

    private mouseEntered() {
        this.setState({ areActionsVisible: true });
        if (this.props.mouseEntered) {
            this.props.mouseEntered();
        }
    }

    private mouseLeft() {
        this.setState({ areActionsVisible: false });
        if (this.props.mouseLeft) {
            this.props.mouseLeft();
        }
    }

    private initPopper(event: EventObject) {
        const ele: Singular = event.target.element();
        if (ele.data().id !== this.props.id) {
            // some other component's event
            return;
        }

        this.ele = ele;
        if (ele.isEdge()) {
            const nodes = ele.connectedNodes();
            this.node = nodes[0];
            this.node1 = nodes[1];
        } else if (ele.isNode()) {
            this.node = ele;
        } else {
            throw new Error('Unable to initialize popper - unknown node type');
        }

        this.popperObj = (ele as any).popper({
            content: () => this.root,
            popper: {
                placement: 'top'
            }
        });
        this.node && this.node.on(this.EVENT_POSITION, this.updatePopperPosition);
        this.node1 && this.node1.on(this.EVENT_POSITION, this.updatePopperPosition);
        this.props.cy.on(this.CY_EVENTS, this.updatePopperPosition);
        this.props.cy.off(this.EVENT_ADD, undefined, this.initPopper);
        ele.on(this.EVENT_MOUSEOUT, this.mouseLeft);
        ele.on(this.EVENT_MOUSEOVER, this.mouseEntered);

        this.props.popperInitialized && this.props.popperInitialized(this.popperObj, ele);
    }

    private updatePopperPosition() {
        this.popperObj && this.popperObj.scheduleUpdate();
    }
};
