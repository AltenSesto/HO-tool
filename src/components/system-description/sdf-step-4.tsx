import React from 'react';
import { NodeSingular, EdgeSingular } from 'cytoscape';
import { IconButton } from '@material-ui/core';
import { Link } from '@material-ui/icons';

import SystemObject from '../../entities/system-description/system-object';
import Subsystem from '../../entities/system-description/subsystem';
import { createObjectId } from '../../entities/system-model';
import { ObjectTypes } from '../../entities/system-description/object-types';
import { isSystemObjectData } from '../../entities/graph/graph-element';
import SdfStepBase, { StepProps, StepState } from './sdf-step-base';
import SubsystemCollapseButton from './subsystem-collapse-button';
import DeleteElementButton from './delete-element-button';

export default class SdfStep4 extends React.Component<StepProps, StepState> {

    constructor(props: StepProps) {
        super(props);

        this.tryCreateConnection = this.tryCreateConnection.bind(this);
        this.renderSystemObjectActions = this.renderSystemObjectActions.bind(this);
        this.renderSubsystemActions = this.renderSubsystemActions.bind(this);
        this.renderConnectionActions = this.renderConnectionActions.bind(this);

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
                renderConnectionActions={this.renderConnectionActions}
            />
        );
    }

    private renderSystemObjectActions(object: SystemObject, element: NodeSingular) {
        if (object.type !== ObjectTypes.role) {
            return <React.Fragment></React.Fragment>;
        }

        return (<div style={{ position: 'relative', top: '-5px', left: '-5px' }}>
            <IconButton
                size='small'
                title='Connect to kind'
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
                system={this.props.system}
                systemUpdated={this.props.systemUpdated}
            />
        </div>;
    }

    private renderConnectionActions(element: EdgeSingular) {
        // swap ends
        if (!this.tryCreateConnection(element.target(), element.source())) {
            return <React.Fragment></React.Fragment>;
        }

        return <DeleteElementButton
            element={element}
            system={this.props.system}
            systemUpdated={this.props.systemUpdated}
        />;
    }

    private tryCreateConnection(source: NodeSingular, target: NodeSingular) {
        const roleData = source.data();
        const kindData = target.data();
        if (isSystemObjectData(roleData) && roleData.systemObject.type === ObjectTypes.role &&
            isSystemObjectData(kindData) && kindData.systemObject.type === ObjectTypes.kind
        ) {
            return {
                id: createObjectId('connection'),
                source: kindData.systemObject.id,
                target: roleData.systemObject.id,
                label: 'play',
                isOriented: true,
                hazardIds: []
            };
        }
        return null;
    }
}
