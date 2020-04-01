import React from 'react';
import { NodeSingular, Singular, EdgeSingular } from 'cytoscape';
import { IconButton } from '@material-ui/core';
import { Add, Edit, Link } from '@material-ui/icons';

import SystemObject from '../../entities/system-description/system-object';
import Subsystem from '../../entities/system-description/subsystem';
import { SystemDescription, createObjectId } from '../../entities/system-model';
import ToolbarButtons from './toolbar-buttons';
import { ObjectTypes } from '../../entities/system-description/object-types';
import { isSystemObjectData, isSubsystemData } from '../../entities/graph/graph-element';
import SdfStepBase from './sdf-step-base';
import DeleteElementButton from './delete-element-button';
import SubsystemCollapseButton from './subsystem-collapse-button';

interface Props {
    system: SystemDescription;
    systemUpdated: (system: SystemDescription) => void;
}

interface State {
    objectEditing: SystemObject | Subsystem | null;
    nodeConnecting: NodeSingular | null;
    elementDisplayPopper: Singular | null;
}

export default class SdfStep1 extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.tryCreateConnection = this.tryCreateConnection.bind(this);
        this.startCreatingObject = this.startCreatingObject.bind(this);
        this.startCreatingSubsystem = this.startCreatingSubsystem.bind(this);
        this.editNode = this.editNode.bind(this);
        this.startCreatingConnection = this.startCreatingConnection.bind(this);
        this.renderSystemObjectActions = this.renderSystemObjectActions.bind(this);
        this.renderConnectionActions = this.renderConnectionActions.bind(this);
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
        ]} />;

        let nodeActions = <React.Fragment></React.Fragment>;
        const actionElement = this.state.elementDisplayPopper;
        if (actionElement) {
            if (actionElement.isEdge()) {
                nodeActions = this.renderConnectionActions(actionElement);
            } else if (actionElement.isNode()) {
                const data = actionElement.data();
                if (isSystemObjectData(data)) {
                    nodeActions = this.renderSystemObjectActions(data.systemObject, actionElement);
                } else if (isSubsystemData(data)) {
                    nodeActions = this.renderSubsystemActions(data.subsystem, actionElement);
                }
            }
        }

        return (
            <SdfStepBase
                system={this.props.system}
                systemUpdated={this.props.systemUpdated}
                elementActions={nodeActions}
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
            />
        );
    }

    private renderSystemObjectActions(object: SystemObject, element: NodeSingular) {
        return (<div style={{ position: 'relative', top: '-5px', left: '-5px' }}>
            {object.type === ObjectTypes.kind ?
                <IconButton
                    size='small'
                    title='Connect to containing kind'
                    onClick={() => this.setState({ ...this.state, ...{ nodeConnecting: element } })}
                >
                    <Link />
                </IconButton>
                :
                undefined
            }
            <IconButton
                size='small'
                title='Edit'
                onClick={() => this.setState({
                    ...this.state, ...{ objectEditing: object, elementDisplayPopper: null }
                })}
            >
                <Edit />
            </IconButton>
            <DeleteElementButton
                element={element}
                system={this.props.system}
                systemUpdated={this.props.systemUpdated}
            />
        </div>);
    }

    private renderSubsystemActions(subsystem: Subsystem, element: NodeSingular) {
        return <div style={{ position: 'relative', top: '5px', left: '-5px' }}>
            <SubsystemCollapseButton
                node={element}
                subsystem={subsystem}
                system={this.props.system}
                systemUpdated={this.props.systemUpdated}
            />
            <IconButton
                size='small'
                title='Edit'
                onClick={() => this.setState({
                    ...this.state, ...{ objectEditing: subsystem, elementDisplayPopper: null }
                })}
            >
                <Edit />
            </IconButton>
            <DeleteElementButton
                element={element}
                system={this.props.system}
                systemUpdated={this.props.systemUpdated}
            />
        </div>;
    }

    private renderConnectionActions(element: EdgeSingular) {
        const ends = element.connectedNodes().map(e => {
            const data = e.data();
            if (isSystemObjectData(data)) {
                return data.systemObject;
            }
            return null;
        });
        if (!ends.every(e => !!e && e.type === ObjectTypes.kind)) {
            return <React.Fragment></React.Fragment>;
        }

        return <DeleteElementButton
            element={element}
            system={this.props.system}
            systemUpdated={this.props.systemUpdated}
        />;
    }

    private startCreatingConnection() {
        if (this.state.elementDisplayPopper && this.state.elementDisplayPopper.isNode()) {
            this.setState({ ...this.state, ...{ nodeConnecting: this.state.elementDisplayPopper } })
        }
    }

    private tryCreateConnection(source: NodeSingular, target: NodeSingular) {
        const targetData = target.data();
        if (isSystemObjectData(targetData) && targetData.systemObject.type === ObjectTypes.kind) {
            return {
                id: createObjectId('connection'),
                source: source.data().id as string,
                target: targetData.id,
                label: 'ispartof',
                isOriented: true
            };
        }
        return null;
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
            ...{ objectEditing: objectEditing, elementDisplayPopper: null }
        });
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
