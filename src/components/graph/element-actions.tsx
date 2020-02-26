import React, { ReactElement } from 'react';
import { Core, Singular, EventObject } from 'cytoscape';
import Popper from 'popper.js';

interface Props {
    id: string;
    cy: Core;
    childrenStatic?: ReactElement;
    popperInitialized?: (popperObj: any, ele: Singular) => void;
    mouseEntered?: () => void;
    mouseLeft?: () => void;
    elementDeleted: (id: string) => void;
    allowActionsVisible?: () => boolean;
}

interface State {
    areActionsVisible: boolean;
}

export default class ElementActions extends React.Component<Props, State> {

    public static readonly CY_EVENTS = 'pan zoom';
    public static readonly EVENT_ADD = 'add';
    public static readonly EVENT_MOVE = 'move';
    public static readonly EVENT_REMOVE = 'remove';
    public static readonly EVENT_POSITION = 'position';
    public static readonly EVENT_MOUSEOVER = 'mouseover';
    public static readonly EVENT_MOUSEOUT = 'mouseout';
    public static readonly EVENT_DRAGFREE = 'dragfree';
    public static readonly EVENT_CLICK = 'click';

    private ele: Singular | null = null;
    private popperObj: Popper | null = null;
    private root: HTMLElement | null = null;

    constructor(props: Props) {
        super(props);

        this.updatePopperPosition = this.updatePopperPosition.bind(this);
        this.initPopper = this.initPopper.bind(this);
        this.mouseEntered = this.mouseEntered.bind(this);
        this.mouseLeft = this.mouseLeft.bind(this);
        this.setActionsVisible = this.setActionsVisible.bind(this);

        this.state = {
            areActionsVisible: false
        };
    }

    render() {
        const visibility = this.state.areActionsVisible ? 'visible' : 'hidden';
        return (
            <div ref={r => this.root = r} style={{ marginBottom: '10px', zIndex: 100 }}
                onMouseEnter={() => this.setActionsVisible(true)}
                onMouseLeave={() => this.setActionsVisible(false)}>
                {this.props.childrenStatic}
                <div style={{ visibility: visibility }}>
                    {this.props.children}
                    <button type='button' onClick={() => this.props.elementDeleted(this.props.id)}>Delete</button>
                </div>
            </div>
        );
    };

    componentDidMount() {
        this.props.cy.on(ElementActions.EVENT_ADD, this.initPopper);
    }

    componentWillUnmount() {
        this.props.cy.off(ElementActions.CY_EVENTS, undefined, this.updatePopperPosition);
        this.props.cy.off(ElementActions.EVENT_ADD, undefined, this.initPopper);
        this.ele && this.ele.off(ElementActions.EVENT_MOUSEOVER, undefined, this.mouseEntered);
        this.ele && this.ele.off(ElementActions.EVENT_MOUSEOUT, undefined, this.mouseLeft);
        this.ele && this.ele.off(ElementActions.EVENT_POSITION, undefined, this.updatePopperPosition);
    }

    private setActionsVisible(visible: boolean) {
        if (visible && (!this.props.allowActionsVisible || this.props.allowActionsVisible())) {
            this.setState({areActionsVisible: true});
        } else if (this.state.areActionsVisible) {
            this.setState({areActionsVisible: false});
        }
    }

    private mouseEntered() {
        this.setActionsVisible(true);
        if (this.props.mouseEntered) {
            this.props.mouseEntered();
        }
    }

    private mouseLeft() {
        this.setActionsVisible(false);
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

        this.popperObj = (ele as any).popper({
            content: () => this.root,
            popper: {
                placement: 'top'
            }
        });
        this.props.cy.on(ElementActions.CY_EVENTS, this.updatePopperPosition);
        this.props.cy.off(ElementActions.EVENT_ADD, undefined, this.initPopper);
        ele.on(ElementActions.EVENT_MOUSEOUT, this.mouseLeft);
        ele.on(ElementActions.EVENT_MOUSEOVER, this.mouseEntered);
        ele.on(ElementActions.EVENT_POSITION, this.updatePopperPosition);

        this.props.popperInitialized && this.props.popperInitialized(this.popperObj, ele);
    }

    private updatePopperPosition() {
        this.popperObj && this.popperObj.scheduleUpdate();
    }
};
