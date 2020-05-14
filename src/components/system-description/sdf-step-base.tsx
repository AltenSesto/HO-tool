import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import Popper from 'popper.js';
import { NodeSingular, EventObject, Singular, EdgeSingular } from 'cytoscape';

import SystemObject from '../../entities/system-description/system-object';
import Subsystem from '../../entities/system-description/subsystem';
import GraphElementsFactory from '../../entities/graph/graph-elements-factory';
import Graph from '../graph/graph';
import NodeEditor from './node-editor';
import { isSystemObject, isSubsystem } from '../../entities/system-description/system-description-entity';
import { isSystemObjectData, isSubsystemData, GraphElementPosition } from '../../entities/graph/graph-element';
import NodePopper from '../graph/node-popper';
import Connection from '../../entities/system-description/connection';
import DeleteConnectionButton from './delete-connection-button';
import { createSubsystem, updateSubsystem, createConnection, renameSystemObject, createSystemObject, updateSystemObject } from '../../store/system-model/actions';
import { getConnection } from '../../entities/graph/element-utilities';
import { RootState } from '../../store';

const mapState = (state: RootState) => ({
    system: state.systemModel
});

const mapDispatch = {
    subsystemCreated: createSubsystem,
    subsystemUpdated: updateSubsystem,
    connectionCreated: createConnection,
    systemObjectRenamed: renameSystemObject,
    systemObjectCreated: createSystemObject,
    systemObjectUpdated: updateSystemObject
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    objectEditing?: SystemObject | Subsystem | null;
    objectEditingDone?: () => void;
    nodeConnecting: NodeSingular | null;
    nodeConnectingDone: () => void;
    tryCreateConnection: (source: NodeSingular, target: NodeSingular) => Connection | null;
    toolbarButtons?: JSX.Element;
    elementDisplayPopper: Singular | null;
    elementDisplayPopperChanged: (element: Singular | null) => void;
    renderSystemObjectActions: (object: SystemObject, element: NodeSingular) => JSX.Element;
    renderSubsystemActions: (subsystem: Subsystem, element: NodeSingular) => JSX.Element;
    renderConnectionActions?: (element: EdgeSingular) => JSX.Element;
}

interface State {
    isConnectionValid: boolean;
}

export interface StepState {
    objectEditing: SystemObject | Subsystem | null;
    nodeConnecting: NodeSingular | null;
    elementDisplayPopper: Singular | null;
}

const DEFAULT_POSITION = {
    x: 100, y: 50
};

class SdfStepBase extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.showNodeActions = this.showNodeActions.bind(this);
        this.hideNodeActions = this.hideNodeActions.bind(this);
        this.tryCreateConnection = this.tryCreateConnection.bind(this);
        this.completeEditEntity = this.completeEditEntity.bind(this);
        this.updateNodePosition = this.updateNodePosition.bind(this);
        this.validateConnection = this.validateConnection.bind(this);
        this.preventOverlap = this.preventOverlap.bind(this);
        this.cancelEditEntity = this.cancelEditEntity.bind(this);
        this.renderConnectionActions = this.renderConnectionActions.bind(this);

        this.state = {
            isConnectionValid: false
        };
    }

    render() {
        const elementsFactory = new GraphElementsFactory();
        const elements = elementsFactory.mapSystemDescription(this.props.system);

        let actionButtonsPlacement: Popper.Placement = 'top';
        if (this.props.elementDisplayPopper && this.props.elementDisplayPopper.isNode()) {
            if (isSystemObjectData(this.props.elementDisplayPopper.data())) {
                actionButtonsPlacement = 'top-start';
            } else {
                actionButtonsPlacement = 'bottom-start';
            }
        }

        let cursorStyle = 'default';
        if (this.props.nodeConnecting) {
            if (this.state.isConnectionValid) {
                cursorStyle = 'pointer';
            } else {
                cursorStyle = 'not-allowed';
            }
        }

        let elementActions = <React.Fragment></React.Fragment>;
        const actionElement = this.props.elementDisplayPopper;
        if (actionElement) {
            if (actionElement.isEdge()) {
                if (this.props.renderConnectionActions) {
                    elementActions = this.props.renderConnectionActions(actionElement);
                } else {
                    elementActions = this.renderConnectionActions(actionElement);
                }
            } else if (actionElement.isNode()) {
                const data = actionElement.data();
                if (isSystemObjectData(data)) {
                    elementActions = this.props.renderSystemObjectActions(data.systemObject, actionElement);
                } else if (isSubsystemData(data)) {
                    elementActions = this.props.renderSubsystemActions(data.subsystem, actionElement);
                }
            }
        }

        return (
            <React.Fragment>
                <Graph
                    elements={elements}
                    cursorStyle={cursorStyle}
                    graphClicked={this.props.nodeConnectingDone}
                    nodeClicked={this.tryCreateConnection}
                    mouseEnteredNode={this.showNodeActions}
                    mouseLeftNode={this.hideNodeActions}
                    nodeMoved={this.updateNodePosition}
                    useCollapseApi={true}
                />
                {this.props.toolbarButtons}
                {
                    this.props.elementDisplayPopper ?
                        <NodePopper
                            element={this.props.elementDisplayPopper}
                            placement={actionButtonsPlacement}
                        >
                            {elementActions}
                        </NodePopper>
                        :
                        undefined
                }
                {
                    this.props.objectEditing ?
                        <NodeEditor
                            entity={this.props.objectEditing}
                            subsystemsAvailable={this.props.system.subsystems}
                            entityUpdated={this.completeEditEntity}
                            editCancelled={this.cancelEditEntity}
                        />
                        :
                        undefined
                }
            </React.Fragment>
        );
    }

    private renderConnectionActions(element: EdgeSingular) {
        if (!this.props.tryCreateConnection(element.source(), element.target())) {
            return <React.Fragment></React.Fragment>;
        }

        const connection = getConnection(element);
        if (connection) {
            return <DeleteConnectionButton
                connection={connection}
                element={element}
                onClick={() => this.props.elementDisplayPopperChanged(null)}
            />;
        }

        return <React.Fragment></React.Fragment>;
    }

    private showNodeActions(event: EventObject) {
        // triggered twice for element in subsystem which breaks popper
        if (this.props.elementDisplayPopper) {
            return;
        }

        let isConnectionValid = false;
        const ele = event.target as Singular;
        if (ele.isNode()) {
            isConnectionValid = !!this.validateConnection(ele);
        }

        this.setState({ ...this.state, ...{ isConnectionValid: isConnectionValid } });
        this.props.elementDisplayPopperChanged(event.target);
    }

    private hideNodeActions() {
        this.setState({ ...this.state, ...{ isConnectionValid: false } });
        this.props.elementDisplayPopperChanged(null);
    }

    private tryCreateConnection(event: EventObject) {
        const target = event.target as Singular;
        if (target.isNode()) {
            const connection = this.validateConnection(target);
            if (connection) {
                this.props.connectionCreated(connection);
            }
        }
        this.props.nodeConnectingDone();
    }

    private validateConnection(target: NodeSingular) {
        if (!this.props.nodeConnecting ||
            this.props.nodeConnecting === target ||
            this.props.nodeConnecting.edgesWith(target).length !== 0
        ) {
            return null;
        }
        return this.props.tryCreateConnection(this.props.nodeConnecting, target);
    }

    private updateNodePosition(event: EventObject) {
        const node = event.target as NodeSingular;
        const position = node.position();
        const data = node.data();
        if (isSystemObjectData(data)) {
            const systemObject = data.systemObject;
            this.props.systemObjectUpdated(
                { ...systemObject, ...{ posX: position.x, posY: position.y } });
            if (data.parent && node.parent().length > 0) {
                // save position of parent subsystem as it changes when its children move
                const parent = this.props.system.subsystems.find(e => e.id === data.parent);
                if (parent) {
                    const parentPosition = node.parent()[0].position();
                    this.props.subsystemUpdated(
                        { ...parent, ...{ posX: parentPosition.x, posY: parentPosition.y } });
                }
            }

        } else if (isSubsystemData(data)) {
            const subsystem = data.subsystem;
            this.props.subsystemUpdated({ ...subsystem, ...{ posX: position.x, posY: position.y } });
            // update position of children nodes
            for (var i = 0; i < node.children().length; i++) {
                const childNode = node.children()[i];
                const childData = childNode.data();
                if (isSystemObjectData(childData)) {
                    const childObject = childData.systemObject;
                    const position = childNode.position();
                    this.props.systemObjectUpdated(
                        { ...childObject, ...{ posX: position.x, posY: position.y } });
                }
            }
        }
    }

    private cancelEditEntity() {
        this.props.objectEditingDone && this.props.objectEditingDone();
    }

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
                    positionOverride = DEFAULT_POSITION;
                }

                if (positionOverride) {
                    const adjustedPosition = this.preventOverlap(positionOverride, allNodes, parentId);
                    entity.posX = adjustedPosition.x;
                    entity.posY = adjustedPosition.y;
                }

                if (entity.name !== existingEntity.name) {
                    this.props.systemObjectRenamed(entity);
                }
            }

            if (isSubsystem(entity)) {
                this.props.subsystemUpdated(entity);
            } else {
                this.props.systemObjectUpdated(entity);
            }

        } else {
            let nodePosition = DEFAULT_POSITION;
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

            if (isSubsystem(entity)) {
                this.props.subsystemCreated(entity);
            } else {
                this.props.systemObjectCreated(entity);
            }
        }

        this.props.objectEditingDone && this.props.objectEditingDone();
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

export default connector(SdfStepBase)
