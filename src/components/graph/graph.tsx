import React from 'react';
import cytoscape, { Core, EventObject, Singular, NodeSingular } from 'cytoscape';
import CytoscapeComponent from 'react-cytoscapejs';
import expandCollapse from 'cytoscape-expand-collapse';
import popper from 'cytoscape-popper';

import style from '../../entities/graph/style';
import Element from '../../entities/graph/element';
import { GraphElement, isSubsystemData } from '../../entities/graph/graph-element';
import { initCollapseApi, CollapseApi, getCollapseApi } from '../../entities/graph/collapse-api';

cytoscape.use(popper);
expandCollapse(cytoscape);

interface Props {
    elements: Element[] | GraphElement<any>[];
    cursorStyle: string;
    useCollapseApi?: boolean;
    mouseEnteredNode: (ev: EventObject) => void;
    mouseLeftNode: (ev: EventObject) => void;
    nodeClicked: (ev: EventObject) => void;
    graphClicked: (ev: EventObject) => void;
    nodeMoved?: (ev: EventObject) => void;
}

interface State {
    cy: Core | null;
    collapseApi: CollapseApi | null;
    maxX: number;
    maxY: number;
}

export default class Graph extends React.Component<Props, State> {

    // storing max canvas dimentions to use while loading a graph from a file
    // state will non work here as nodes load one by one without state being updated
    private newMaxX: number;
    private newMaxY: number;

    constructor(props: Props) {
        super(props);

        this.initCytoscape = this.initCytoscape.bind(this);
        this.addEventListeners = this.addEventListeners.bind(this);
        this.checkCanvasSizeToFitNode = this.checkCanvasSizeToFitNode.bind(this);
        this.resizeCanvas = this.resizeCanvas.bind(this);
        this.handleNodeMoved = this.handleNodeMoved.bind(this);

        this.newMaxX = 1500;
        this.newMaxY = 900;
        this.state = {
            cy: null,
            collapseApi: null,
            maxX: this.newMaxX,
            maxY: this.newMaxY
        };
    }

    render() {
        // if cytoscape is not initialized yet it is impossible to render elements, so first init empty cytoscape 
        const elements = this.state.cy ? this.props.elements : [];
        const graphContainerStyle = {
            width: this.state.maxX,
            height: this.state.maxY,
            zIndex: 10,
            cursor: this.props.cursorStyle
        };

        return (
            <CytoscapeComponent
                elements={elements}
                style={graphContainerStyle}
                stylesheet={style}
                userZoomingEnabled={false}
                userPanningEnabled={false}
                cy={this.initCytoscape} />
        );
    }

    private resizeCanvas() {
        if (this.newMaxX > this.state.maxX || this.newMaxY > this.state.maxY) {
            this.setState({ ...this.state, ...{ maxX: this.newMaxX, maxY: this.newMaxY } });
        }
    }

    private checkCanvasSizeToFitNode(event: EventObject) {
        const node = event.target as NodeSingular;
        const position = node.position();
        const width = node.outerWidth();
        const height = node.outerHeight();

        const margin = 120; // we'll add more space than needed as node dimensions are not correct when loading from file
        if (position.x + width + margin > this.newMaxX) {
            this.newMaxX = position.x + width + margin;
        }
        if (position.y + height + margin > this.newMaxY) {
            this.newMaxY = position.y + height + margin;
        }
    }

    private handleNodeMoved(event: EventObject) {
        if (this.props.nodeMoved) {
            this.props.nodeMoved(event);
        }
    }

    private addEventListeners(event: EventObject) {
        const ele: Singular = event.target.element();
        if (ele.isNode()) {
            ele.on('position', this.checkCanvasSizeToFitNode);
            ele.trigger('position');
            ele.on('dragfree', this.handleNodeMoved);

            const data = ele.data();
            if (this.state.collapseApi && isSubsystemData(data) && data.subsystem.isCollapsed) {
                this.state.collapseApi.collapse(ele);
            }
        }
        ele.on('mouseover', this.props.mouseEnteredNode);
        ele.on('mouseout', this.props.mouseLeftNode);
        ele.on('click', this.props.nodeClicked);
    }

    private initCytoscape(cy: Core) {
        // this method must run only once
        if (this.state.cy) {
            return;
        }
        cy.zoom(1.1); // hack to fix blurring
        cy.on('add', this.addEventListeners);
        cy.on('click', this.props.graphClicked);
        cy.on('render', this.resizeCanvas);

        let collapseApi = null;
        if (this.props.useCollapseApi) {
            initCollapseApi(cy);
            collapseApi = getCollapseApi(cy);
        }

        this.setState({ ...this.state, ...{ cy, collapseApi } });
    }
}
