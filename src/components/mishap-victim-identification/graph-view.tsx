import React from 'react';
import { EventObject, Singular } from 'cytoscape';

import Element from '../../entities/graph/element';
import { SystemDescriptionEntity, isSystemObject, isConnection, isSubsystem } from '../../entities/system-description/system-description-entity';
import PossibleHarm from '../../entities/mishap-victim-identification/possible-harm';
import { ObjectTypes } from '../../entities/system-description/object-types';
import VictimHazards from './victim-hazards';
import SystemObject from '../../entities/system-description/system-object';
import Graph from './graph';

interface Props {
    systemDescription: SystemDescriptionEntity[];
    possibleHarms: PossibleHarm[];
    possibleHarmsUpdated: (items: PossibleHarm[]) => void;
}

interface State {
    selectedRole: SystemObject | null;
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
        this.createElement = this.createElement.bind(this);

        this.state = {
            selectedRole: null,
            isMouseOverRole: false
        };
    }

    render() {
        const elements = this.props.systemDescription.map(this.createElement);
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
                    possibleHarms={this.props.possibleHarms}
                    possibleHarmsUpdated={this.props.possibleHarmsUpdated}
                />
            </React.Fragment>
        );
    }

    private getRoleFromEvent(event: EventObject): SystemObject | undefined {
        const ele: Singular = event.target.element();
        const data = ele.data();
        if (data.object && data.object.type === ObjectTypes.role) {
            return data.object;
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

    private createElement(entity: SystemDescriptionEntity): Element {
        if (isSystemObject(entity)) {
            let classes;
            if (entity.type !== ObjectTypes.role) {
                classes = [entity.type.toString(), 'faded'];
            } else if (this.props.possibleHarms.some(e => e.roleId === entity.id)) {
                classes = ['mishap-victim'];
            } else {
                classes = [ObjectTypes.role.toString()];
            }

            return {
                group: 'nodes',
                data: {
                    id: entity.id,
                    label: `<<${entity.type.toString()}>>\n${entity.name}`,
                    object: entity,
                    parent: entity.parent
                },
                position: {
                    x: entity.posX, y: entity.posY
                },
                classes: classes,
                grabbable: false
            };
        }
        if (isConnection(entity)) {
            const classes = ['faded'];
            if (entity.isOriented) {
                classes.push('arrow-edge');
            }
            return {
                group: "edges",
                data: entity,
                pannable: true,
                classes: classes
            }
        }
        if (isSubsystem(entity)) {
            return {
                group: 'nodes',
                data: {
                    id: entity.id,
                    label: entity.name,
                    subsystem: entity
                },
                position: {
                    x: entity.posX, y: entity.posY
                },
                classes: ['subsystem']
            };
        }
        throw new Error(`Unknown entity type. ${entity}`);
    }
}
