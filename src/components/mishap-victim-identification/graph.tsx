import React from 'react';
import { Core, EventObject, Singular } from 'cytoscape';
import CytoscapeComponent from 'react-cytoscapejs';

import style from '../../entities/graph/style';
import Element from '../../entities/graph/element';
import { SystemDescriptionEntity, isSystemObject, isConnection, isSubsystem } from '../../entities/system-description/system-description-entity';
import MishapVictim from '../../entities/mishap-victim-identification/mishap-victim';
import { ObjectTypes } from '../../entities/system-description/object-types';
import VictimHazards from './victim-hazards';
import SystemObject from '../../entities/system-description/system-object';

interface Props {
    systemDescription: SystemDescriptionEntity[];
    mishapVictims: MishapVictim[];
    mishapVictimsUpdated: (items: MishapVictim[]) => void;
}

interface State {
    elements: Element[] | null;
    cy: Core | null;
    selectedRole: SystemObject | null;
    isMouseOverRole: boolean;
}

export default class Graph extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.initCytoscape = this.initCytoscape.bind(this);
        this.addEventListeners = this.addEventListeners.bind(this);
        this.mouseEntered = this.mouseEntered.bind(this);
        this.mouseLeft = this.mouseLeft.bind(this);
        this.selectRole = this.selectRole.bind(this);

        this.state = {
            elements: null,
            cy: null,
            selectedRole: null,
            isMouseOverRole: false
        };
    }

    render() {
        const cursorStyle = this.state.isMouseOverRole ? 'pointer' : 'default';
        // if cytoscape is not initialized yet it is impossible to render elements, so first init empty cytoscape 
        const elements = this.state.cy ? this.state.elements : [];
        return (
            <React.Fragment>
                <CytoscapeComponent
                    elements={elements}
                    style={{ width: 1500, height: 900, zIndex: 10, cursor: cursorStyle }}
                    stylesheet={style}
                    userZoomingEnabled={false}
                    cy={this.initCytoscape} />
                <VictimHazards
                    selectedRole={this.state.selectedRole}
                    mishapVictims={this.props.mishapVictims}
                    mishapVictimsUpdated={this.props.mishapVictimsUpdated}
                />
            </React.Fragment>
        );
    }

    private addEventListeners(event: EventObject) {
        const ele: Singular = event.target.element();
        const data = ele.data();
        if (data.object && data.object.type === ObjectTypes.role) {
            ele.on('mouseover', this.mouseEntered);
            ele.on('mouseout', this.mouseLeft);
            ele.on('click', () => this.selectRole(data.object));
        }
    }

    private mouseEntered() {
        this.setState({ ...this.state, ...{ isMouseOverRole: true } });
    }

    private mouseLeft() {
        this.setState({ ...this.state, ...{ isMouseOverRole: false } });
    }

    private selectRole(role: SystemObject) {
        this.setState({ ...this.state, ...{ selectedRole: role } });
    }

    private initCytoscape(cy: Core) {
        // this method must run only once
        if (this.state.cy) {
            return;
        }
        cy.zoom(1.1); // hack to fix blurring
        cy.on('add', this.addEventListeners);

        this.setState({ ...this.state, ...{ cy: cy } });
    }

    static getDerivedStateFromProps(props: Props, state: State): State {
        if (state.elements) {
            return state;
        }

        const elements = props.systemDescription.map(e => Graph.createElement(e));
        return { ...state, ...{ elements } };
    }

    private static createElement(entity: SystemDescriptionEntity): Element {
        if (isSystemObject(entity)) {
            const classes = [entity.type.toString()];
            if (entity.type !== ObjectTypes.role) {
                classes.push('faded');
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
