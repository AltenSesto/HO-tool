import React from 'react';
import { NodeSingular } from 'cytoscape';
import { IconButton } from '@material-ui/core';
import { Link } from '@material-ui/icons';

import SystemObject from '../../entities/system-description/system-object';
import Subsystem from '../../entities/system-description/subsystem';
import { createObjectId } from '../../entities/system-model';
import { ObjectTypes } from '../../entities/system-description/object-types';
import { isSystemObjectData } from '../../entities/graph/graph-element';
import SdfStepBase, { StepProps, StepState } from './sdf-step-base';
import SubsystemCollapseButton from './subsystem-collapse-button';

export default class SdfStep2 extends React.Component<StepProps, StepState> {

    constructor(props: StepProps) {
        super(props);

        this.tryCreateConnection = this.tryCreateConnection.bind(this);
        this.renderSystemObjectActions = this.renderSystemObjectActions.bind(this);
        this.renderSubsystemActions = this.renderSubsystemActions.bind(this);

        this.state = {
            nodeConnecting: null,
            objectEditing: null,
            elementDisplayPopper: null
        };
    }

    render() {
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
                tryCreateConnection={this.tryCreateConnection}
                renderSubsystemActions={this.renderSubsystemActions}
                renderSystemObjectActions={this.renderSystemObjectActions}
            />
        );
    }

    private renderSystemObjectActions(object: SystemObject, element: NodeSingular) {
        if (object.type !== ObjectTypes.kind) {
            return <React.Fragment></React.Fragment>;
        }

        return (<div style={{ position: 'relative', top: '-5px', left: '-5px' }}>
            <IconButton
                size='small'
                title='Connect to role'
                onClick={() => this.setState({ ...this.state, ...{ nodeConnecting: element } })}
            >
                <Link />
            </IconButton>
        </div>);
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
        if (isSystemObjectData(sourceData) && sourceData.systemObject.type === ObjectTypes.kind &&
            isSystemObjectData(targetData) && targetData.systemObject.type === ObjectTypes.role
        ) {
            return {
                id: createObjectId('connection'),
                source: sourceData.systemObject.id,
                target: targetData.systemObject.id,
                label: 'play',
                isOriented: true
            };
        }
        return null;
    }
}
