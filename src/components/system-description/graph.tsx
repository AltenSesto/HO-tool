import React from 'react';

import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import popper from 'cytoscape-popper';

import SystemObject from '../../entities/system-description/system-object';
import Element from '../../entities/graph/element';
import style from '../../entities/graph/style';
import { Core } from 'cytoscape';
import NodeActions from '../graph/node-actions';
import { GraphEntity, isSystemObject, isConnection } from '../../entities/graph/graph-entity';
import ElementActions from '../graph/element-actions';

cytoscape.use(popper);

interface State {
    elements: Element[];
    cy: Core | null;
}

interface Props {
    entities: GraphEntity[];
    entitiesDeleted: (ids: string[]) => void;
    objectUpdated: (updatedObject: SystemObject) => void;
}

export default class Graph extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.initCytoscape = this.initCytoscape.bind(this);
        this.updateNode = this.updateNode.bind(this);
        this.state = {
            elements: [],
            cy: null
        };
    }

    static getDerivedStateFromProps(props: Props, state: State): State {
        const newEntities = props.entities.filter(o => !state.elements.some(e => o.id === e.data.id && !e.data.updateRequired));
        const deletedEntities = state.elements.filter(e => props.entities.every(o => e.data.id !== o.id) || e.data.updateRequired);
        const elements = state.elements
            .filter(e => deletedEntities.indexOf(e) === -1)
            .concat(newEntities.map((o) => Graph.createElement(o)));
        return {
            elements: elements,
            cy: state.cy
        };
    }

    render() {
        // if cytoscape is not initialized yet it is impossible to render elements, so first init empty cytoscape 
        const elements = this.state.cy ? this.state.elements : [];

        const actions = elements.map(e => {
                if (e.group === 'nodes') {
                    return <NodeActions
                        key={e.data.id}
                        cy={this.state.cy as Core}
                        object={e.data.object as SystemObject}
                        nodeUpdated={this.updateNode}
                        nodeDeleted={this.props.entitiesDeleted}>
                    </NodeActions>
                } else {
                    return <ElementActions
                        key={e.data.id}
                        id={e.data.id}
                        cy={this.state.cy as Core}
                        elementDeleted={(id) => this.props.entitiesDeleted([id])}>
                    </ElementActions>
                }
            });

        return (
            <React.Fragment>
                {actions}
                <CytoscapeComponent elements={elements} style={{ width: '1200px', height: '1200px', zIndex: 10 }} stylesheet={style} cy={this.initCytoscape} />
            </React.Fragment>
        );
    }

    private updateNode(updatedObject: SystemObject) {
        const element = this.state.elements.find(e => e.data.id === updatedObject.id);
        if (element) {
            element.data.updateRequired = true; // not mutating state as rerender is not needed now
        }
        this.props.objectUpdated(updatedObject);
    }

    private initCytoscape(cy: Core) {
        // this method must run only once
        if (this.state.cy) {
            return;
        }

        cy.zoom(1.1); // hack to fix blurring

        this.setState({
            cy: cy,
            elements: this.state.elements
        });
    }

    private static createElement(entity: GraphEntity): Element {
        if (isSystemObject(entity)) {
            return {
                group: 'nodes',
                data: {
                    id: entity.id,
                    label: `<<${entity.type.toString()}>>\n\n${entity.name}`,
                    object: entity
                },
                position: {
                    x: entity.posX, y: entity.posY
                },
                classes: [entity.type.toString()]
            };
        }
        if (isConnection(entity)) {
            return {
                group: "edges",
                data: {
                    id: entity.id,
                    source: entity.source,
                    target: entity.target
                },
                pannable: true
            }
        }
        throw new Error(`Unknown entity type. ${entity}`);
    }
};
