import React from 'react';
import Popper from 'popper.js';

import SystemObject from '../../entities/system-description/system-object';
import Subsystem from '../../entities/system-description/subsystem';
import { SystemDescription, createObjectId } from '../../entities/system-model';
import GraphElementsFactory from '../../entities/graph/graph-elements-factory';
import Graph from '../graph/graph';
import { NodeSingular, EventObject, Singular } from 'cytoscape';
import NodeEditor from './node-editor';
import { Add } from '@material-ui/icons';
import ToolbarButtons from './toolbar-buttons';
import { ObjectTypes } from '../../entities/system-description/object-types';
import { defaultPosition } from '../../entities/graph/element';
import { isSystemObject, isSubsystem, SystemDescriptionEntity, isConnection } from '../../entities/system-description/system-description-entity';
import { isSystemObjectData, isSubsystemData, GraphElementPosition } from '../../entities/graph/graph-element';
import NodePopper from './node-popper';
import SdfStep1Actions from './sdf-step-1-actions';

interface Props {
    system: SystemDescription;
    systemUpdated: (system: SystemDescription) => void;
}

interface State {
    objectEditing: SystemObject | Subsystem | null;
    isNewObjectEditing: boolean;
    nodeConnecting: NodeSingular | null;
    isConnectionValid: boolean;
    elementDisplayPopper: Singular | null;
}

export default class SdfStep1 extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.showNodeActions = this.showNodeActions.bind(this);
        this.hideNodeActions = this.hideNodeActions.bind(this);
        this.tryCreateConnection = this.tryCreateConnection.bind(this);
        this.updateEntity = this.updateEntity.bind(this);
        this.deleteEntities = this.deleteEntities.bind(this);
        this.startCreatingObject = this.startCreatingObject.bind(this);
        this.startCreatingSubsystem = this.startCreatingSubsystem.bind(this);
        this.completeEditEntity = this.completeEditEntity.bind(this);
        this.modifySystemDescription = this.modifySystemDescription.bind(this);
        this.updateNodePosition = this.updateNodePosition.bind(this);
        this.editNode = this.editNode.bind(this);
        this.validateConnection = this.validateConnection.bind(this);
        this.preventOverlap = this.preventOverlap.bind(this);
        this.startCreatingConnection = this.startCreatingConnection.bind(this);
        this.updateSubsystemCollapsedState = this.updateSubsystemCollapsedState.bind(this);

        this.state = {
            nodeConnecting: null,
            objectEditing: null,
            elementDisplayPopper: null,
            isNewObjectEditing: false,
            isConnectionValid: false
        };
    }

    render() {
        const elementsFactory = new GraphElementsFactory();
        const elements = elementsFactory.mapSystemDescription(this.props.system);

        const toolbarActions = [
            {
                icon: <Add />,
                text: 'Kind',
                action: () => this.startCreatingObject(ObjectTypes.kind)
            },
            {
                icon: <Add />,
                text: 'Role',
                action: () => this.startCreatingObject(ObjectTypes.role)
            },
            {
                icon: <Add />,
                text: 'Subsystem',
                action: this.startCreatingSubsystem
            },
        ];

        let actionButtonsPlacement: Popper.Placement = 'top';
        if (this.state.elementDisplayPopper && this.state.elementDisplayPopper.isNode()) {
            if (isSystemObjectData(this.state.elementDisplayPopper.data())) {
                actionButtonsPlacement = 'top-start';
            } else {
                actionButtonsPlacement = 'bottom-start';
            }
        }

        let cursorStyle = 'default';
        if (this.state.nodeConnecting) {
            if (this.state.isConnectionValid) {
                cursorStyle = 'pointer';
            } else {
                cursorStyle = 'not-allowed';
            }
        }

        return (
            <React.Fragment>
                <Graph
                    elements={elements}
                    cursorStyle={cursorStyle}
                    graphClicked={() => this.setState({ ...this.state, ...{ nodeConnecting: null } })}
                    nodeClicked={this.tryCreateConnection}
                    mouseEnteredNode={this.showNodeActions}
                    mouseLeftNode={this.hideNodeActions}
                    nodeMoved={this.updateNodePosition}
                    useCollapseApi={true}
                />
                <ToolbarButtons buttons={toolbarActions} />
                {
                    this.state.elementDisplayPopper ?
                        <NodePopper
                            element={this.state.elementDisplayPopper}
                            placement={actionButtonsPlacement}
                        >
                            <SdfStep1Actions
                                element={this.state.elementDisplayPopper}
                                connectClicked={this.startCreatingConnection}
                                deleteClicked={this.deleteEntities}
                                editClicked={this.editNode}
                                collapsedStateChanged={this.updateSubsystemCollapsedState}
                            />
                        </NodePopper>
                        :
                        undefined
                }
                {
                    this.state.objectEditing ?
                        <NodeEditor
                            entity={this.state.objectEditing}
                            subsystemsAvailable={this.props.system.subsystems}
                            entityUpdated={this.completeEditEntity}
                            editCancelled={() => this.setState({
                                ...this.state,
                                ...{ objectEditing: null, isNewObjectEditing: false }
                            })}
                        />
                        :
                        undefined
                }
            </React.Fragment>
        );
    }

    private startCreatingConnection() {
        if (this.state.elementDisplayPopper && this.state.elementDisplayPopper.isNode()) {
            this.setState({ ...this.state, ...{ nodeConnecting: this.state.elementDisplayPopper } })
        }
    }

    private updateSubsystemCollapsedState(isCollapsed: boolean) {
        if (this.state.elementDisplayPopper) {
            const data = this.state.elementDisplayPopper.data();
            if (isSubsystemData(data)) {
                const subsystem = data.subsystem;
                subsystem.isCollapsed = isCollapsed;
                this.updateEntity(subsystem);
            }
        }
    }

    private showNodeActions(event: EventObject) {
        // triggered twice for element in subsystem which breaks popper
        if (this.state.elementDisplayPopper) {
            return;
        }

        let isConnectionValid = false;
        const ele = event.target as Singular;
        if (ele.isNode()) {
            isConnectionValid = this.validateConnection(ele);
        }

        this.setState({
            ...this.state,
            ...{ elementDisplayPopper: event.target, isConnectionValid: isConnectionValid }
        });
    }

    private hideNodeActions() {
        this.setState({
            ...this.state,
            ...{ elementDisplayPopper: null, isConnectionValid: false }
        });
    }

    private tryCreateConnection(event: EventObject) {
        const target = event.target as Singular;
        if (target.isNode() && this.validateConnection(target) && this.state.nodeConnecting) {
            const connection = {
                id: createObjectId('connection'),
                source: this.state.nodeConnecting.data().id as string,
                target: target.data().id as string,
                label: 'ispartof',
                isOriented: true
            };
            this.modifySystemDescription(connection, (list, item) => list.concat(item));
        }
        this.setState({ ...this.state, ...{ nodeConnecting: null } })
    }

    private validateConnection(target: NodeSingular) {
        if (!this.state.nodeConnecting ||
            this.state.nodeConnecting === target ||
            this.state.nodeConnecting.edgesWith(target).length !== 0
        ) {
            return false;
        }
        const data = target.data();
        if (!isSystemObjectData(data) || data.systemObject.type !== ObjectTypes.kind) {
            return false;
        }
        return true;
    }

    private updateNodePosition(event: EventObject) {
        const node = event.target as NodeSingular;
        const position = node.position();
        const data = node.data();
        if (isSystemObjectData(data)) {
            const systemObject = data.systemObject;
            systemObject.posX = position.x;
            systemObject.posY = position.y;
            this.updateEntity(systemObject);
            if (data.parent && node.parent().length > 0) {
                // save position of parent subsystem as it changes when its children move
                const parent = this.props.system.subsystems.find(e => e.id === data.parent);
                if (parent) {
                    const parentPosition = node.parent()[0].position();
                    parent.posX = parentPosition.x;
                    parent.posY = parentPosition.y;
                    this.updateEntity(parent);
                }
            }

        } else if (isSubsystemData(data)) {
            const subsystem = data.subsystem;
            subsystem.posX = position.x;
            subsystem.posY = position.y;
            this.updateEntity(subsystem);
            // update position of children nodes
            for (var i = 0; i < node.children().length; i++) {
                const childNode = node.children()[i];
                const childData = childNode.data();
                if (isSystemObjectData(childData)) {
                    const childObject = childData.systemObject;
                    const position = childNode.position();
                    childObject.posX = position.x;
                    childObject.posY = position.y;
                    this.updateEntity(childObject);
                }
            }
        }
    }

    private editNode() {
        if (!this.state.elementDisplayPopper) {
            return;
        }
        const data = this.state.elementDisplayPopper.data();
        let objectEditing: SystemObject | Subsystem | null = null;
        if (isSystemObjectData(data)) {
            objectEditing = data.systemObject;
        } else if (isSubsystemData(data)) {
            objectEditing = data.subsystem;
        }
        this.setState({
            ...this.state,
            ...{ objectEditing: objectEditing, elementDisplayPopper: null, isNewObjectEditing: false }
        });
    }

    private updateEntity(entity: SystemObject | Subsystem) {
        this.modifySystemDescription(entity, (list, item) => list.map(e => e.id === item.id ? item : e));
    }

    private deleteEntities(entities: SystemDescriptionEntity[]) {
        for (var entity of entities) {
            this.modifySystemDescription(entity, (list, item) => list.filter(e => e.id !== item.id));
        }
    }

    private modifySystemDescription(
        entity: SystemDescriptionEntity,
        action: <T extends SystemDescriptionEntity>(list: T[], item: T) => T[]
    ) {
        const system = this.props.system;
        if (isSubsystem(entity)) {
            system.subsystems = action(system.subsystems, entity);
        } else if (isSystemObject(entity)) {
            switch (entity.type) {
                case ObjectTypes.kind:
                    system.kinds = action(system.kinds, entity);
                    break;
                case ObjectTypes.relator:
                    system.relators = action(system.relators, entity);
                    break;
                case ObjectTypes.role:
                    system.roles = action(system.roles, entity);
                    break;
                default:
                    throw new Error('Unknown entity type');
            }
        } else if (isConnection(entity)) {
            system.systemObjectConnections = action(system.systemObjectConnections, entity);
        }
        this.props.systemUpdated({ ...this.props.system, ...system });
    }

    private startCreatingObject(type: ObjectTypes) {
        if (!this.state.objectEditing) {
            const obj = {
                id: createObjectId(type.toString()),
                name: "",
                type,
                posX: 0,
                posY: 0
            };
            this.setState({ ...this.state, ...{ objectEditing: obj, isNewObjectEditing: true } });
        }
    };

    private completeEditEntity(entity: SystemObject | Subsystem) {
        const allNodes = new GraphElementsFactory().getAllNodes(this.props.system);
        const existingEntity = allNodes.find(e => e.id === entity.id);

        if (existingEntity) {
            if (isSystemObject(entity) && isSystemObject(existingEntity)) {
                let positionOverride = null;
                let parentId: string | undefined = undefined;
                if (entity.parent && (!existingEntity.parent || existingEntity.parent !== entity.parent)) {
                    const parent = this.props.system.subsystems.find(e => e.id === entity.parent);
                    if (parent) {
                        positionOverride = { x: parent.posX, y: parent.posY };
                        parentId = parent.id;
                    }
                } else if (!entity.parent && existingEntity.parent) {
                    positionOverride = defaultPosition;
                }

                if (positionOverride) {
                    const adjustedPosition = this.preventOverlap(positionOverride, allNodes, parentId);
                    entity.posX = adjustedPosition.x;
                    entity.posY = adjustedPosition.y;
                }
            }
            this.updateEntity(entity);

        } else {
            let nodePosition = defaultPosition;
            let parentId: string | undefined;
            if (isSystemObject(entity) && entity.parent) {
                const parent = this.props.system.subsystems.find(e => e.id === entity.parent);
                if (parent) {
                    nodePosition = { x: parent.posX, y: parent.posY };
                    parentId = parent.id;
                }
            }
            const adjustedPosition = this.preventOverlap(nodePosition, allNodes, parentId);
            entity.posX = adjustedPosition.x;
            entity.posY = adjustedPosition.y;

            this.modifySystemDescription(entity, (list, item) => list.concat(item));
        }
        this.setState({ ...this.state, ...{ objectEditing: null, isNewObjectEditing: false } });
    };

    private startCreatingSubsystem() {
        if (!this.state.objectEditing) {
            const subsystem = {
                id: createObjectId('subsystem'),
                name: "",
                posX: 0,
                posY: 0,
                isCollapsed: false
            };
            this.setState({ ...this.state, ...{ objectEditing: subsystem, isNewObjectEditing: true } });
        }
    };

    private preventOverlap(
        position: GraphElementPosition,
        otherNodes: (SystemObject | Subsystem)[],
        parentId?: string
    ): GraphElementPosition {
        if (otherNodes.every(e => (e.posX !== position.x && e.posY !== position.y) || e.id === parentId)) {
            return position;
        }
        return this.preventOverlap({ x: position.x + 20, y: position.y + 20 }, otherNodes);
    }
}
