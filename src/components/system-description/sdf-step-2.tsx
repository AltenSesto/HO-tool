import React from 'react';
import { NodeSingular, Singular, EdgeSingular } from 'cytoscape';
import { IconButton } from '@material-ui/core';
import { Link } from '@material-ui/icons';

import SystemObject from '../../entities/system-description/system-object';
import Subsystem from '../../entities/system-description/subsystem';
import { SystemDescription, createObjectId } from '../../entities/system-model';
import { ObjectTypes } from '../../entities/system-description/object-types';
import { isSystemObjectData } from '../../entities/graph/graph-element';
import SdfStepBase from './sdf-step-base';
import DeleteElementButton from './delete-element-button';

interface Props {
    system: SystemDescription;
    systemUpdated: (system: SystemDescription) => void;
}

interface State {
    objectEditing: SystemObject | Subsystem | null;
    nodeConnecting: NodeSingular | null;
    elementDisplayPopper: Singular | null;
}

export default class SdfStep2 extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.tryCreateConnection = this.tryCreateConnection.bind(this);
        this.renderConnectionActions = this.renderConnectionActions.bind(this);
        this.renderSystemObjectActions = this.renderSystemObjectActions.bind(this);

        this.state = {
            nodeConnecting: null,
            objectEditing: null,
            elementDisplayPopper: null
        };
    }

    render() {

        let nodeActions = <React.Fragment></React.Fragment>;
        const actionElement = this.state.elementDisplayPopper;
        if (actionElement) {
            if (actionElement.isEdge()) {
                nodeActions = this.renderConnectionActions(actionElement);
            } else if (actionElement.isNode()) {
                const data = actionElement.data();
                if (isSystemObjectData(data)) {
                    nodeActions = this.renderSystemObjectActions(data.systemObject, actionElement);
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
                tryCreateConnection={this.tryCreateConnection}
            />
        );
    }

    private renderConnectionActions(element: EdgeSingular) {
        if (!this.tryCreateConnection(element.source(), element.target())) {
            return <React.Fragment></React.Fragment>;
        }

        return <DeleteElementButton
            element={element}
            system={this.props.system}
            systemUpdated={this.props.systemUpdated}
        />;
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

    private tryCreateConnection(source: NodeSingular, target: NodeSingular) {
        const sourceData = source.data();
        const targetData = target.data();
        if (isSystemObjectData(sourceData) && sourceData.systemObject.type === ObjectTypes.kind &&
            isSystemObjectData(targetData) && targetData.systemObject.type === ObjectTypes.role
        ) {
            return {
                id: createObjectId('connection'),
                source: source.data().id as string,
                target: targetData.id,
                label: 'play',
                isOriented: true
            };
        }
        return null;
    }
}
