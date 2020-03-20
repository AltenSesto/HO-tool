import React from 'react';
import { Core } from 'cytoscape';
import CytoscapeComponent from 'react-cytoscapejs';

import style from '../../entities/graph/style';
import Element from '../../entities/graph/element';
import { SystemDescriptionEntity, isSystemObject, isConnection, isSubsystem } from '../../entities/system-description/system-description-entity';
import MishapVictim from '../../entities/mishap-victim-identification/mishap-victim';
import { ObjectTypes } from '../../entities/system-description/object-types';

interface Props {
    systemDescription: SystemDescriptionEntity[];
    mishapVictims: MishapVictim[];
    mishapVictimCreated: (item: MishapVictim) => void;
}

interface State {
    elements: Element[] | null;
    cy: Core | null;
    selectedVictims: MishapVictim[];
}

export default class Graph extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.initCytoscape = this.initCytoscape.bind(this);

        this.state = {
            elements: null,
            cy: null,
            selectedVictims: []
        };
    }

    render() {
        return (
            <React.Fragment>
                <CytoscapeComponent
                    elements={this.state.elements}
                    style={{ width: 1500, height: 900, zIndex: 10 }}
                    stylesheet={style}
                    userZoomingEnabled={false}
                    cy={this.initCytoscape} />
            </React.Fragment>
        );
    }

    private initCytoscape(cy: Core) {
        // this method must run only once
        if (this.state.cy) {
            return;
        }
        cy.zoom(1.1); // hack to fix blurring

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
