import React from 'react';

import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape, { Core } from 'cytoscape';
import popper from 'cytoscape-popper';

import SystemObject from '../../entities/system-description/system-object';
import Element, { defaultPosition } from '../../entities/graph/element';
import style from '../../entities/graph/style';
import NodeActions from '../graph/node-actions';
import { SystemDescriptionEntity, isSystemObject, isConnection, isSubsystem } from '../../entities/system-description/system-description-entity';
import ElementActions from '../graph/element-actions';
import Connection from '../../entities/system-description/connection';
import { ObjectTypes } from '../../entities/system-description/object-types';
import ObjectConnections from '../../entities/system-description/object-connections';
import Subsystem from '../../entities/system-description/subsystem';
import NodeEditor from './node-editor';
import SubsystemActions from '../graph/subsystem-actions';

cytoscape.use(popper);

interface State {
    elements: Element[];
    cy: Core | null;
    connectionCreatingSource: ObjectConnections | null;
    isConnectionTargetValid: boolean;
    nodeEditing: SystemObject | Subsystem | null;
}

interface Props {
    entities: SystemDescriptionEntity[];
    entitiesDeleted: (ids: string[]) => void;
    nodeUpdated: (updatedObject: SystemObject | Subsystem) => void;
    connectionCreated: (connection: Connection) => void
}

enum ConnectionTargetOptions {
    NotValid,
    Valid,
    SwapEnds
}

export default class Graph extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.initCytoscape = this.initCytoscape.bind(this);
        this.updateNode = this.updateNode.bind(this);
        this.startCreatingConnection = this.startCreatingConnection.bind(this);
        this.nodeClicked = this.nodeClicked.bind(this);
        this.graphClicked = this.graphClicked.bind(this);
        this.validateConnectionTarget = this.validateConnectionTarget.bind(this);
        this.nodeMouseEntered = this.nodeMouseEntered.bind(this);
        this.nodeMouseLeft = this.nodeMouseLeft.bind(this);
        this.startEditNode = this.startEditNode.bind(this);
        this.completeEditNode = this.completeEditNode.bind(this);
        this.findEntityById = this.findEntityById.bind(this);

        this.state = {
            elements: [],
            cy: null,
            connectionCreatingSource: null,
            isConnectionTargetValid: false,
            nodeEditing: null
        };
    }

    static getDerivedStateFromProps(props: Props, state: State): State {
        const newEntities = props.entities.filter(o => !state.elements.some(e => o.id === e.data.id && !e.data.updateRequired));
        const deletedEntities = state.elements.filter(e => props.entities.every(o => e.data.id !== o.id) || e.data.updateRequired);
        const elements = state.elements
            .filter(e => deletedEntities.indexOf(e) === -1)
            .concat(newEntities.map((o) => Graph.createElement(o)));
        return { ...state, ...{ elements: elements } };
    }

    render() {
        // if cytoscape is not initialized yet it is impossible to render elements, so first init empty cytoscape 
        const elements = this.state.cy ? this.state.elements : [];

        const actions = elements.map(e => {
            if (e.group === 'nodes' && e.data.object) {
                return <NodeActions
                    key={e.data.id}
                    cy={this.state.cy as Core}
                    object={e.data.object as SystemObject}
                    isConnectionCreating={this.state.connectionCreatingSource !== null && this.state.connectionCreatingSource.object.id === e.data.id}
                    connectionCreateStarted={this.startCreatingConnection}
                    nodeEditing={this.startEditNode}
                    nodeRepositioned={this.updateNode}
                    nodeDeleted={this.props.entitiesDeleted}
                    onMouseOver={this.nodeMouseEntered}
                    onMouseOut={this.nodeMouseLeft}
                    onClick={this.nodeClicked}>
                </NodeActions>
            } else if (e.group === 'nodes' && e.data.subsystem) {
                return <SubsystemActions
                    key={e.data.id}
                    cy={this.state.cy as Core}
                    subsystem={e.data.subsystem as Subsystem}
                    subsystemDeleted={this.props.entitiesDeleted}
                    subsystemEditing={this.startEditNode}
                    subsystemRepositioned={this.updateNode}>
                </SubsystemActions>
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

        let cursorStyle = 'default';
        if (this.state.connectionCreatingSource) {
            if (this.state.isConnectionTargetValid) {
                cursorStyle = 'pointer';
            } else {
                cursorStyle = 'not-allowed';
            }
        }

        let nodeEditor;
        if (this.state.nodeEditing) {
            nodeEditor = <NodeEditor
                allEntities={this.props.entities}
                entity={this.state.nodeEditing}
                entityUpdated={this.completeEditNode}
                editCancelled={() => this.setState({ ...this.state, ...{ nodeEditing: null } })}>
            </NodeEditor>
        }

        return (
            <React.Fragment>
                {nodeEditor}
                {actions}
                <CytoscapeComponent
                    elements={elements}
                    style={{ width: '1200px', height: '1200px', zIndex: 10, cursor: cursorStyle }}
                    stylesheet={style}
                    cy={this.initCytoscape} />
            </React.Fragment>
        );
    }

    private findEntityById(id: string) {
        return this.props.entities.find(e => e.id === id);
    }

    private startEditNode(node: SystemObject | Subsystem) {
        this.setState({ ...this.state, ...{ nodeEditing: node } });
    }

    private completeEditNode(node: SystemObject | Subsystem) {
        this.setState({ ...this.state, ...{ nodeEditing: null } });
        if (isSystemObject(node)) {
            const oldObject = this.findEntityById(node.id);
            if (oldObject && isSystemObject(oldObject)) {
                if (oldObject.parent && !node.parent) {
                    node.posX = defaultPosition.x;
                    node.posY = defaultPosition.y;
                } else if (!oldObject.parent && node.parent) {
                    const parent = this.findEntityById(node.parent);
                    if (parent && isSubsystem(parent)) {
                        node.posX = parent.posX;
                        node.posY = parent.posY;
                    }
                }
            }
        }
        this.updateNode(node);
    }

    private nodeMouseEntered(target: SystemObject) {
        if (this.state.connectionCreatingSource) {
            const connectionOptions = this.validateConnectionTarget(target);
            const isTargetValid = connectionOptions === ConnectionTargetOptions.Valid || connectionOptions === ConnectionTargetOptions.SwapEnds;
            this.setState({ ...this.state, ...{ isConnectionTargetValid: isTargetValid } });
        }
    }

    private nodeMouseLeft() {
        if (this.state.connectionCreatingSource) {
            this.setState({ ...this.state, ...{ isConnectionTargetValid: false } });
        }
    }

    private graphClicked() {
        this.setState({ ...this.state, ...{ connectionCreatingSource: null } });
    }

    private validateConnectionTarget(target: SystemObject): ConnectionTargetOptions {
        if (!this.state.connectionCreatingSource || this.state.connectionCreatingSource.connections.some(e => e.target === target.id)) {
            return ConnectionTargetOptions.NotValid;
        }

        if ((this.state.connectionCreatingSource.object.type === ObjectTypes.kind && target.type === ObjectTypes.role) ||
            (this.state.connectionCreatingSource.object.type === ObjectTypes.role && target.type === ObjectTypes.relator)) {
            return ConnectionTargetOptions.Valid;
        }
        if ((this.state.connectionCreatingSource.object.type === ObjectTypes.role && target.type === ObjectTypes.kind) ||
            (this.state.connectionCreatingSource.object.type === ObjectTypes.relator && target.type === ObjectTypes.role)) {
            return ConnectionTargetOptions.SwapEnds;
        }
        return ConnectionTargetOptions.NotValid;
    }

    private nodeClicked(target: SystemObject) {
        if (this.state.connectionCreatingSource === null) {
            return;
        }

        const connectionOptions = this.validateConnectionTarget(target);
        let connectionSource;
        let connectionTarget;

        switch (connectionOptions) {
            case ConnectionTargetOptions.Valid:
                connectionSource = this.state.connectionCreatingSource.object;
                connectionTarget = target;
                break;
            case ConnectionTargetOptions.SwapEnds:
                connectionSource = target;
                connectionTarget = this.state.connectionCreatingSource.object;
                break;
            default:
                return;
        }

        this.props.connectionCreated({
            id: `connection-${new Date().getTime()}`,
            source: connectionSource.id,
            target: connectionTarget.id
        });
    }

    private startCreatingConnection(source: ObjectConnections) {
        if (!this.state.connectionCreatingSource) {
            this.setState({ ...this.state, ...{ connectionCreatingSource: source } });
        }
    }

    private updateNode(updatedNode: SystemObject | Subsystem) {
        const element = this.state.elements.find(e => e.data.id === updatedNode.id);
        if (element) {
            element.data.updateRequired = true; // not mutating state as rerender is not needed now
        }
        this.props.nodeUpdated(updatedNode);
    }

    private initCytoscape(cy: Core) {
        // this method must run only once
        if (this.state.cy) {
            return;
        }
        cy.zoom(1.1); // hack to fix blurring

        cy.on('click', this.graphClicked);

        this.setState({ ...this.state, ...{ cy: cy } });
    }

    private static createElement(entity: SystemDescriptionEntity): Element {
        if (isSystemObject(entity)) {
            return {
                group: 'nodes',
                data: {
                    id: entity.id,
                    label: `<<${entity.type.toString()}>>\n\n${entity.name}`,
                    object: entity,
                    parent: entity.parent
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
        if (isSubsystem(entity)) {
            return {
                group: 'nodes',
                data: {
                    id: entity.id,
                    label: entity.name,
                    subsystem: entity
                },
                position: {
                    x: entity.posX, y: entity.posY
                },
                classes: ['subsystem']
            };
        }
        throw new Error(`Unknown entity type. ${entity}`);
    }
};
