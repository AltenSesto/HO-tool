import React from 'react';
import cytoscape, { Core, EventObject, Singular } from 'cytoscape';
import CytoscapeComponent from 'react-cytoscapejs';
import expandCollapse from 'cytoscape-expand-collapse';
import popper from 'cytoscape-popper';
import { withTheme, Theme } from '@material-ui/core/styles';

import style from '../../styles/graph-style';
import { GraphElement, isSubsystemData } from '../../entities/graph/graph-element';
import { initCollapseApi, CollapseApi, getCollapseApi } from '../../entities/graph/collapse-api';
import GraphContainer from './graph-container';

cytoscape.use(popper);
expandCollapse(cytoscape);

interface Props {
    elements: GraphElement<any>[];
    cursorStyle: string;
    useCollapseApi?: boolean;
    mouseEnteredNode: (ev: EventObject) => void;
    mouseLeftNode: (ev: EventObject) => void;
    nodeClicked: (ev: EventObject) => void;
    graphClicked?: (ev: EventObject) => void;
    nodeMoved?: (ev: EventObject) => void;
    cy?: (cy: Core) => void;
    theme: Theme;
}

interface State {
    cy: Core | null;
    collapseApi: CollapseApi | null;
    maxX: number;
    maxY: number;
}

class Graph extends React.Component<Props, State> {

    private containerSize = {
        height: 0,
        width: 0
    };

    constructor(props: Props) {
        super(props);

        this.initCytoscape = this.initCytoscape.bind(this);
        this.addEventListeners = this.addEventListeners.bind(this);
        this.resizeCanvas = this.resizeCanvas.bind(this);
        this.handleNodeMoved = this.handleNodeMoved.bind(this);
        this.setInitialCanvasSize = this.setInitialCanvasSize.bind(this);

        this.state = {
            cy: null,
            collapseApi: null,
            maxX: this.containerSize.width,
            maxY: this.containerSize.height
        };
    }

    render() {
        // if cytoscape is not initialized yet it is impossible to render elements, so first init empty cytoscape 
        const elements = this.state.cy ? this.props.elements : [];
        const graphContainerStyle = {
            width: this.state.maxX,
            height: this.state.maxY,
            zIndex: this.props.theme.zIndex.graph,
            cursor: this.props.cursorStyle
        };

        return (
            <GraphContainer size={this.setInitialCanvasSize}>
                <CytoscapeComponent
                    elements={elements}
                    style={graphContainerStyle}
                    stylesheet={style}
                    userZoomingEnabled={false}
                    userPanningEnabled={false}
                    cy={this.initCytoscape} />
            </GraphContainer>
        );
    }

    componentDidMount() {
        this.setState({
            ...this.state,
            ...{ maxX: this.containerSize.width, maxY: this.containerSize.height }
        });
    }

    private setInitialCanvasSize(height: number, width: number) {
        this.containerSize = { height, width };
    }

    private resizeCanvas() {
        if (this.state.cy) {
            const boundingBox = this.state.cy.nodes().renderedBoundingBox({});
            const height = Math.max(boundingBox.y2, this.state.maxY);
            const width = Math.max(boundingBox.x2, this.state.maxX);
            if (height !== this.state.maxY || width !== this.state.maxX) {
                this.setState({ ...this.state, ...{ maxX: width, maxY: height } });
            }
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
        if (this.props.cy) {
            this.props.cy(cy);
        }

        // this method must run only once
        if (this.state.cy) {
            return;
        }
        cy.zoom(1.1); // hack to fix blurring
        cy.on('add', this.addEventListeners);
        cy.on('click', (ev) => this.props.graphClicked && this.props.graphClicked(ev));
        cy.on('render', this.resizeCanvas);

        let collapseApi = null;
        if (this.props.useCollapseApi) {
            initCollapseApi(cy);
            collapseApi = getCollapseApi(cy);
        }

        this.setState({ ...this.state, ...{ cy, collapseApi } });
    }
}

export default withTheme(Graph);
