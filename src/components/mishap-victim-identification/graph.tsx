import React from 'react';
import { Core, EventObject, Singular } from 'cytoscape';
import CytoscapeComponent from 'react-cytoscapejs';

import style from '../../entities/graph/style';
import Element from '../../entities/graph/element';

interface Props {
    elements: Element[];
    cursorStyle: string;
    mouseEnteredNode: (ev: EventObject) => void;
    mouseLeftNode: (ev: EventObject) => void;
    nodeClicked: (ev: EventObject) => void;
    graphClicked: (ev: EventObject) => void;
}

interface State {
    cy: Core | null;
}

export default class Graph extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.initCytoscape = this.initCytoscape.bind(this);
        this.addEventListeners = this.addEventListeners.bind(this);

        this.state = {
            cy: null,
        };
    }

    render() {
        // if cytoscape is not initialized yet it is impossible to render elements, so first init empty cytoscape 
        const elements = this.state.cy ? this.props.elements : [];
        return (
            <CytoscapeComponent
                elements={elements}
                style={{ width: 1500, height: 900, zIndex: 10, cursor: this.props.cursorStyle }}
                stylesheet={style}
                userZoomingEnabled={false}
                cy={this.initCytoscape} />
        );
    }

    private addEventListeners(event: EventObject) {
        const ele: Singular = event.target.element();
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

        this.setState({ ...this.state, ...{ cy: cy } });
    }
}
