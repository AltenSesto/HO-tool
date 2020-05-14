import React from 'react';
import { NodeSingular, EdgeSingular } from 'cytoscape';
import { IconButton } from '@material-ui/core';
import { Link } from '@material-ui/icons';

import SystemObject from '../../entities/system-description/system-object';
import Subsystem from '../../entities/system-description/subsystem';
import { createObjectId } from '../../entities/system-model';
import { ObjectTypes } from '../../entities/system-description/object-types';
import SdfStepBase, { StepState } from './sdf-step-base';
import SubsystemCollapseButton from './subsystem-collapse-button';
import DeleteConnectionButton from './delete-connection-button';
import { getConnection, getSystemObject } from '../../entities/graph/element-utilities';

export default class SdfStep4 extends React.Component<{}, StepState> {

    constructor(props: Readonly<{}>) {
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
            />
        </div>;
    }

    private renderConnectionActions(element: EdgeSingular) {
        // swap ends
        if (!this.tryCreateConnection(element.target(), element.source())) {
            return <React.Fragment></React.Fragment>;
        }

        const connection = getConnection(element);
        if (connection) {
            return <DeleteConnectionButton
                connection={connection}
                element={element}
                onClick={() => this.setState({ ...this.state, ...{ elementDisplayPopper: null } })}
            />;
        }

        return <React.Fragment></React.Fragment>;
    }

    private tryCreateConnection(source: NodeSingular, target: NodeSingular) {
        const role = getSystemObject(source);
        const kind = getSystemObject(target);
        if (role && role.type === ObjectTypes.role && kind && kind.type === ObjectTypes.kind) {
            return {
                id: createObjectId('connection'),
                source: kind.id,
                target: role.id,
                label: 'play',
                isOriented: true
            };
        }
        return null;
    }
}
