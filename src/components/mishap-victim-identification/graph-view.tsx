import React from 'react';
import { EventObject, Singular } from 'cytoscape';

import VictimHazards from './victim-hazards';
import Graph from '../graph/graph';
import GraphElementsFactoryMishapVictims from '../../entities/graph/graph-elements-factory-mishap-victims';
import { isSystemObjectData } from '../../entities/graph/graph-element';
import { SystemDescription } from '../../entities/system-model';
import Role, { isRole } from '../../entities/system-description/role';

interface Props {
    systemDescription: SystemDescription;
    possibleHarmsUpdated: (role: Role) => void;
}

interface State {
    selectedRole: Role | null;
    isMouseOverRole: boolean;
}

export default class GraphView extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.getRoleFromEvent = this.getRoleFromEvent.bind(this);
        this.mouseEntered = this.mouseEntered.bind(this);
        this.mouseLeft = this.mouseLeft.bind(this);
        this.selectRole = this.selectRole.bind(this);
        this.clearRoleSelection = this.clearRoleSelection.bind(this);

        this.state = {
            selectedRole: null,
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
                <VictimHazards
                    selectedRole={this.state.selectedRole}
                    possibleHarmsUpdated={this.props.possibleHarmsUpdated}
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
            this.setState({ ...this.state, ...{ selectedRole: role } });
        }
    }

    private clearRoleSelection(event: EventObject) {
        if (!event.isDefaultPrevented()) {
            this.setState({ ...this.state, ...{ selectedRole: null } });
        }
    }
}
