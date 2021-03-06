import React from 'react';
import { NodeSingular } from 'cytoscape';
import { IconButton } from '@material-ui/core';
import { Add, Link } from '@material-ui/icons';

import SystemObject from '../../entities/system-description/system-object';
import Subsystem from '../../entities/system-description/subsystem';
import { createObjectId } from '../../entities/system-model';
import ToolbarButtons from './toolbar-buttons';
import { ObjectTypes } from '../../entities/system-description/object-types';
import { isSystemObjectData } from '../../entities/graph/graph-element';
import SdfStepBase, { StepState } from './sdf-step-base';
import DeleteSystemObjectButton from './delete-system-object-button';
import DeleteSubsystemButton from './delete-subsystem-button';
import EditNodeButton from './edit-node-button';
import SubsystemCollapseButton from './subsystem-collapse-button';
import NodeActions from '../graph/node-actions';

export default class SdfStep1 extends React.Component<{}, StepState> {

    constructor(props: Readonly<{}>) {
        super(props);

        this.tryCreateConnection = this.tryCreateConnection.bind(this);
        this.startCreatingKind = this.startCreatingKind.bind(this);
        this.startCreatingRole = this.startCreatingRole.bind(this);
        this.startCreatingSubsystem = this.startCreatingSubsystem.bind(this);
        this.renderSystemObjectActions = this.renderSystemObjectActions.bind(this);
        this.renderSubsystemActions = this.renderSubsystemActions.bind(this);

        this.state = {
            nodeConnecting: null,
            objectEditing: null,
            elementDisplayPopper: null
        };
    }

    render() {
        const toolbarButtons = <ToolbarButtons buttons={[
            {
                icon: <Add />,
                text: 'Kind',
                action: this.startCreatingKind
            },
            {
                icon: <Add />,
                text: 'Role',
                action: this.startCreatingRole
            },
            {
                icon: <Add />,
                text: 'Subsystem',
                action: this.startCreatingSubsystem
            },
        ]} />;

        return (
            <SdfStepBase
                elementDisplayPopper={this.state.elementDisplayPopper}
                elementDisplayPopperChanged={(ele) => this.setState({
                    ...this.state, ...{ elementDisplayPopper: ele }
                })}
                nodeConnecting={this.state.nodeConnecting}
                nodeConnectingDone={() => this.setState({ ...this.state, ...{ nodeConnecting: null } })}
                objectEditing={this.state.objectEditing}
                objectEditingDone={() => this.setState({ ...this.state, ...{ objectEditing: null } })}
                toolbarButtons={toolbarButtons}
                tryCreateConnection={this.tryCreateConnection}
                renderSubsystemActions={this.renderSubsystemActions}
                renderSystemObjectActions={this.renderSystemObjectActions}
            />
        );
    }

    private renderSystemObjectActions(object: SystemObject, element: NodeSingular) {
        if (object.type === ObjectTypes.kind) {
            return (
                <NodeActions placement='top'>
                    <IconButton
                        size='small'
                        title='Connect to containing kind'
                        onClick={() => this.setState({ ...this.state, ...{ nodeConnecting: element } })}
                    >
                        <Link />
                    </IconButton>
                    <EditNodeButton
                        node={object}
                        onClick={() => this.setState({
                            ...this.state, ...{ objectEditing: object, elementDisplayPopper: null }
                        })}
                    />
                    <DeleteSystemObjectButton
                        systemObject={object}
                        onClick={() => this.setState({ ...this.state, ...{ elementDisplayPopper: null } })}
                    />
                </NodeActions>
            );
        }
        if (object.type === ObjectTypes.role) {
            return (
                <NodeActions placement='top'>
                    <EditNodeButton
                        node={object}
                        onClick={() => this.setState({
                            ...this.state, ...{ objectEditing: object, elementDisplayPopper: null }
                        })}
                    />
                    <DeleteSystemObjectButton
                        systemObject={object}
                        onClick={() => this.setState({ ...this.state, ...{ elementDisplayPopper: null } })}
                    />
                </NodeActions>
            );
        }
        return <React.Fragment></React.Fragment>;
    }

    private renderSubsystemActions(subsystem: Subsystem, element: NodeSingular) {
        return (
            <NodeActions placement='bottom'>
                <SubsystemCollapseButton
                    node={element}
                    subsystem={subsystem}
                />
                <EditNodeButton
                    node={subsystem}
                    onClick={() => this.setState({
                        ...this.state, ...{ objectEditing: subsystem, elementDisplayPopper: null }
                    })}
                />
                <DeleteSubsystemButton
                    element={element}
                    subsystem={subsystem}
                    onClick={() => this.setState({ ...this.state, ...{ elementDisplayPopper: null } })}
                />
            </NodeActions>
        );
    }

    private tryCreateConnection(source: NodeSingular, target: NodeSingular) {
        const sourceData = source.data();
        const targetData = target.data();
        if (isSystemObjectData(sourceData) && isSystemObjectData(targetData) &&
            sourceData.systemObject.type === ObjectTypes.kind &&
            targetData.systemObject.type === ObjectTypes.kind
        ) {
            return {
                id: createObjectId('connection'),
                source: sourceData.systemObject.id,
                target: targetData.systemObject.id,
                label: 'ispartof',
                isOriented: true
            };
        }
        return null;
    }

    private startCreatingKind() {
        if (!this.state.objectEditing) {
            const obj = {
                id: createObjectId('kind'),
                name: "",
                type: ObjectTypes.kind,
                posX: 0,
                posY: 0
            };
            this.setState({ ...this.state, ...{ objectEditing: obj } });
        }
    };

    private startCreatingRole() {
        if (!this.state.objectEditing) {
            const obj = {
                id: createObjectId('role'),
                name: "",
                type: ObjectTypes.role,
                posX: 0,
                posY: 0,
                possibleHarms: []
            };
            this.setState({ ...this.state, ...{ objectEditing: obj } });
        }
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
            this.setState({ ...this.state, ...{ objectEditing: subsystem } });
        }
    };
}
