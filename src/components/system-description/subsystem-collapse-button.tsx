import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { NodeSingular } from 'cytoscape';
import Subsystem from '../../entities/system-description/subsystem';
import { IconButton } from '@material-ui/core';
import { ExpandMore, ExpandLess } from '@material-ui/icons';
import { getCollapseApi } from '../../entities/graph/collapse-api';
import { updateSubsystem } from '../../store/system-model/actions';

const mapDispatch = {
    subsystemUpdated: updateSubsystem,
};

const connector = connect(null, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    node: NodeSingular;
    subsystem: Subsystem;
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

        props.subsystemUpdated({ ...props.subsystem, ...{ isCollapsed: newStateCollapsed } });
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

export default connector(SubsystemCollapseButton);
