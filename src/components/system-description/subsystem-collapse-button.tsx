import React from 'react';
import { NodeSingular } from 'cytoscape';
import Subsystem from '../../entities/system-description/subsystem';
import { IconButton } from '@material-ui/core';
import { ExpandMore, ExpandLess } from '@material-ui/icons';
import { getCollapseApi } from '../../entities/graph/collapse-api';
import { SystemDescription } from '../../entities/system-model';

interface Props {
    node: NodeSingular;
    subsystem: Subsystem;
    system: SystemDescription;
    systemUpdated: (system: SystemDescription) => void;
}

const SubsystemCollapseButton: React.FC<Props> = (props) => {

    const toggleCollapsedState = () => {
        const cy = props.node.cy();
        const collapseApi = getCollapseApi(cy);
        const newStateCollapsed = !props.subsystem.isCollapsed;
        if (newStateCollapsed) {
            collapseApi.collapse(props.node);
        } else {
            collapseApi.expand(props.node);
        }
        // collapsing tool messes up everything
        cy.json(cy.json()); // force redraw
        cy.zoom(1.1); // restore position
        cy.pan({ x: 0, y: 0 });

        const updatedSubsystems = props.system.subsystems
            .map(e => e.id !== props.subsystem.id ? e : { ...props.subsystem, ...{ isCollapsed: newStateCollapsed } });
        props.systemUpdated({ ...props.system, ...{ subsystems: updatedSubsystems } });
    };

    return (
        <IconButton
            title={props.subsystem.isCollapsed ? 'Expand' : 'Collapse'}
            onClick={toggleCollapsedState}
            size='small'
        >
            {props.subsystem.isCollapsed ? <ExpandMore /> : <ExpandLess />}
        </IconButton>
    );
};

export default SubsystemCollapseButton;
