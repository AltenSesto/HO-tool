import React from 'react';
import { NodeSingular } from 'cytoscape';
import Subsystem from '../../entities/system-description/subsystem';
import { IconButton } from '@material-ui/core';
import { ExpandMore, ExpandLess } from '@material-ui/icons';
import { getCollapseApi } from '../../entities/graph/collapse-api';

interface Props {
    node: NodeSingular;
    subsystem: Subsystem;
    collapsedStateChanged: (isCollapsed: boolean) => void;
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
        cy.zoom(1.1); // collapsing tool messes up graph positioning
        cy.pan({x: 0, y: 0});
        props.collapsedStateChanged(newStateCollapsed);
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
