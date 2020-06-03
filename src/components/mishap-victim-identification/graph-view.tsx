import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { EventObject, Singular } from 'cytoscape';

import VictimHarms from './victim-harms';
import Graph from '../graph/graph';
import GraphElementsFactoryMishapVictims from '../../entities/graph/graph-elements-factory-mishap-victims';
import { isSystemObjectData } from '../../entities/graph/graph-element';
import Role, { isRole } from '../../entities/system-description/role';
import { RootState } from '../../store';

const mapState = (state: RootState) => ({
    systemDescription: state.systemModel
})

const connector = connect(mapState);

type Props = ConnectedProps<typeof connector>

interface State {
    selectedRoleId: string;
    isMouseOverRole: boolean;
}

class GraphView extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.getRoleFromEvent = this.getRoleFromEvent.bind(this);
        this.mouseEntered = this.mouseEntered.bind(this);
        this.mouseLeft = this.mouseLeft.bind(this);
        this.selectRole = this.selectRole.bind(this);
        this.clearRoleSelection = this.clearRoleSelection.bind(this);

        this.state = {
            selectedRoleId: '',
            isMouseOverRole: false
        };
    }

    render() {
        const elementsFactory = new GraphElementsFactoryMishapVictims();
        const elements = elementsFactory.mapSystemDescription(this.props.systemDescription);

        return (
            <React.Fragment>
                <Graph
                    elements={elements}
                    cursorStyle={this.state.isMouseOverRole ? 'pointer' : 'default'}
                    graphClicked={this.clearRoleSelection}
                    mouseEnteredNode={this.mouseEntered}
                    mouseLeftNode={this.mouseLeft}
                    nodeClicked={this.selectRole}
                />
                <VictimHarms
                    selectedRole={this.props.systemDescription.roles
                        .find(e => e.id === this.state.selectedRoleId)}
                />
            </React.Fragment>
        );
    }

    private getRoleFromEvent(event: EventObject): Role | undefined {
        const ele: Singular = event.target.element();
        const data = ele.data();
        if (isSystemObjectData(data) && isRole(data.systemObject)) {
            return data.systemObject;
        }
    }

    private mouseEntered(event: EventObject) {
        if (this.getRoleFromEvent(event)) {
            this.setState({ ...this.state, ...{ isMouseOverRole: true } });
        }
    }

    private mouseLeft(event: EventObject) {
        if (this.getRoleFromEvent(event)) {
            this.setState({ ...this.state, ...{ isMouseOverRole: false } });
        }
    }

    private selectRole(event: EventObject) {
        const role = this.getRoleFromEvent(event);
        if (role) {
            event.preventDefault();
            this.setState({ ...this.state, ...{ selectedRoleId: role.id } });
        }
    }

    private clearRoleSelection(event: EventObject) {
        if (!event.isDefaultPrevented()) {
            this.setState({ ...this.state, ...{ selectedRoleId: '' } });
        }
    }
}

export default connector(GraphView);
