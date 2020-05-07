import React from 'react';
import { NodeSingular } from 'cytoscape';
import { IconButton } from '@material-ui/core';
import { Add, Edit, Link } from '@material-ui/icons';

import SystemObject from '../../entities/system-description/system-object';
import Subsystem from '../../entities/system-description/subsystem';
import { createObjectId } from '../../entities/system-model';
import ToolbarButtons from './toolbar-buttons';
import { ObjectTypes } from '../../entities/system-description/object-types';
import { isSystemObjectData } from '../../entities/graph/graph-element';
import SdfStepBase, { StepProps, StepState } from './sdf-step-base';
import DeleteElementButton from './delete-element-button';
import SubsystemCollapseButton from './subsystem-collapse-button';

export default class SdfStep3 extends React.Component<StepProps, StepState> {

    constructor(props: StepProps) {
        super(props);

        this.tryCreateConnection = this.tryCreateConnection.bind(this);
        this.startCreatingRelator = this.startCreatingRelator.bind(this);
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
                text: 'Relator',
                action: this.startCreatingRelator
            }]} />;

        return (
            <SdfStepBase
                system={this.props.system}
                systemUpdated={this.props.systemUpdated}
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
        if (object.type === ObjectTypes.relator) {
            return (<div style={{ position: 'relative', top: '-5px', left: '-5px' }}>
                <IconButton
                    size='small'
                    title='Connect to role'
                    onClick={() => this.setState({ ...this.state, ...{ nodeConnecting: element } })}
                >
                    <Link />
                </IconButton>
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
        if (object.type === ObjectTypes.role) {
            return (<div style={{ position: 'relative', top: '-5px', left: '-5px' }}>
                <IconButton
                    size='small'
                    title='Connect to relator'
                    onClick={() => this.setState({ ...this.state, ...{ nodeConnecting: element } })}
                >
                    <Link />
                </IconButton>
            </div>);
        }
        return <React.Fragment></React.Fragment>;
    }

    private renderSubsystemActions(subsystem: Subsystem, element: NodeSingular) {
        return <div style={{ position: 'relative', top: '5px', left: '-5px' }}>
            <SubsystemCollapseButton
                node={element}
                subsystem={subsystem}
            />
        </div>;
    }

    private tryCreateConnection(source: NodeSingular, target: NodeSingular) {
        const sourceData = source.data();
        const targetData = target.data();
        if (isSystemObjectData(sourceData) && isSystemObjectData(targetData)) {
            // connection goes from role to relator, this is important for hazard population
            if (sourceData.systemObject.type === ObjectTypes.role &&
                targetData.systemObject.type === ObjectTypes.relator
            ) {
                return {
                    id: createObjectId('connection'),
                    source: sourceData.systemObject.id,
                    target: targetData.systemObject.id,
                    label: '',
                    isOriented: false
                };
            }
            // swap ends if ends are wrong
            if (sourceData.systemObject.type === ObjectTypes.relator &&
                targetData.systemObject.type === ObjectTypes.role) {
                return {
                    id: createObjectId('connection'),
                    source: targetData.systemObject.id,
                    target: sourceData.systemObject.id,
                    label: '',
                    isOriented: false
                };
            }
        }
        return null;
    }

    private startCreatingRelator() {
        if (!this.state.objectEditing) {
            const obj = {
                id: createObjectId(ObjectTypes.relator.toString()),
                name: "",
                type: ObjectTypes.relator,
                posX: 0,
                posY: 0
            };
            this.setState({ ...this.state, ...{ objectEditing: obj } });
        }
    };
}
