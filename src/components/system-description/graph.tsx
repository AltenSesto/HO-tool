import React from 'react';

import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape, { Core } from 'cytoscape';
import popper from 'cytoscape-popper';

import SystemObject from '../../entities/system-description/system-object';
import Element from '../../entities/graph/element';
import style from '../../entities/graph/style';
import NodeActions from '../graph/node-actions';
import { GraphEntity, isSystemObject, isConnection } from '../../entities/graph/graph-entity';
import ElementActions from '../graph/element-actions';
import Connection from '../../entities/system-description/connection';
import { ObjectTypes } from '../../entities/system-description/object-types';
import ObjectConnections from '../../entities/system-description/object-connections';

cytoscape.use(popper);

interface State {
    elements: Element[];
    cy: Core | null;
    connectionCreatingSource: ObjectConnections | null;
}

interface Props {
    entities: GraphEntity[];
    entitiesDeleted: (ids: string[]) => void;
    objectUpdated: (updatedObject: SystemObject) => void;
    connectionCreated: (connection: Connection) => void
}

export default class Graph extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.initCytoscape = this.initCytoscape.bind(this);
        this.updateNode = this.updateNode.bind(this);
        this.startCreatingConnection = this.startCreatingConnection.bind(this);
        this.nodeClicked = this.nodeClicked.bind(this);
        this.state = {
            elements: [],
            cy: null,
            connectionCreatingSource: null
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
            cy: state.cy,
            connectionCreatingSource: state.connectionCreatingSource
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
                        isConnectionCreating={this.state.connectionCreatingSource !== null && this.state.connectionCreatingSource.object.id === e.data.id}
                        connectionCreateStarted={this.startCreatingConnection}
                        nodeUpdated={this.updateNode}
                        nodeDeleted={this.props.entitiesDeleted}
                        onClick={this.nodeClicked}>
                    </NodeActions>
                } else {
                    return <ElementActions
                        key={e.data.id}
                        id={e.data.id}
                        cy={this.state.cy as Core}
                        elementDeleted={(id) => this.props.entitiesDeleted([id])}
                        updateRequired={false}>
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

    private nodeClicked(target: SystemObject) {
        if (!this.state.connectionCreatingSource) {
            return;
        }
        if (this.state.connectionCreatingSource.connections.some(e => e.target === target.id)) {
            this.setState({...this.state, ...{connectionCreatingSource: null}});
            return;
        }

        let connectionSource;
        let connectionTarget;
        if ((this.state.connectionCreatingSource.object.type === ObjectTypes.kind && target.type === ObjectTypes.role) ||
            (this.state.connectionCreatingSource.object.type === ObjectTypes.role && target.type === ObjectTypes.relator)) {
            connectionSource = this.state.connectionCreatingSource.object;
            connectionTarget = target;
        } else if ((this.state.connectionCreatingSource.object.type === ObjectTypes.role && target.type === ObjectTypes.kind) ||
            (this.state.connectionCreatingSource.object.type === ObjectTypes.relator && target.type === ObjectTypes.role)) {
            connectionSource = target;
            connectionTarget = this.state.connectionCreatingSource.object;
        } else {
            this.setState({...this.state, ...{connectionCreatingSource: null}});
            return;
        }

        this.setState({...this.state, ...{connectionCreatingSource: null}});
        this.props.connectionCreated({
            id: `connection-${new Date().getTime()}`,
            source: connectionSource.id,
            target: connectionTarget.id 
        });
    }

    private startCreatingConnection(source: ObjectConnections) {
        if (!this.state.connectionCreatingSource) {
            this.setState({...this.state, ...{connectionCreatingSource: source}});
        }
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
            elements: this.state.elements,
            connectionCreatingSource: this.state.connectionCreatingSource
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
                data: entity,
                pannable: true
            }
        }
        throw new Error(`Unknown entity type. ${entity}`);
    }
};
