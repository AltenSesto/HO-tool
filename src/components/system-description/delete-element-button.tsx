import React from 'react';
import { NodeSingular, EdgeSingular } from 'cytoscape';
import { IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';

import { SystemDescription } from '../../entities/system-model';
import Connection from '../../entities/system-description/connection';
import SystemObject from '../../entities/system-description/system-object';
import { ObjectTypes } from '../../entities/system-description/object-types';
import Subsystem from '../../entities/system-description/subsystem';
import { isSystemObjectData, isSubsystemData, isConnectionData } from '../../entities/graph/graph-element';

interface Props {
    element: NodeSingular | EdgeSingular;
    system: SystemDescription;
    systemUpdated: (system: SystemDescription) => void;
}

const DeleteElementButton: React.FC<Props> = (props) => {

    const removeConnection = (connection: Connection, system: SystemDescription) => {
        const updatedConnections = system.systemObjectConnections
            .filter(e => e.id !== connection.id);
        const updatedHazards = system.hazards.filter(e =>
                e.mishapVictim.id !== connection.target &&
                e.exposure.id !== connection.target &&
                e.hazardElement.id !== connection.target &&
                e.hazardElementEnvObj.id !== connection.target &&
                e.mishapVictimEnvObj.id !== connection.target);
        return { ...system, ...{ systemObjectConnections: updatedConnections, hazards: updatedHazards } };
    };

    const removeSubsystem = (subsystem: Subsystem, system: SystemDescription) => {
        return {
            ...system, ...{ subsystems: system.subsystems.filter(e => e.id !== subsystem.id) }
        };
    };

    const removeObject = (object: SystemObject, system: SystemDescription) => {
        switch (object.type) {
            case ObjectTypes.kind:
                return {
                    ...system, ...{ kinds: system.kinds.filter(e => e.id !== object.id) }
                };
            case ObjectTypes.relator:
                return {
                    ...system, ...{ relators: system.relators.filter(e => e.id !== object.id) }
                };
            case ObjectTypes.role:
                return {
                    ...system, ...{ roles: system.roles.filter(e => e.id !== object.id) }
                };
            default:
                throw new Error('Unknown entity type');
        }
    };

    const removeObjectWithEdges = (object: SystemObject, ele: NodeSingular, system: SystemDescription) => {
        let updatedSystem = removeObject(object, system);
        updatedSystem = ele.connectedEdges()
            .reduce((carry, edge) => {
                const data = edge.data();
                if (isConnectionData(data)) {
                    return removeConnection(data.connection, carry);
                }
                return carry;
            } , updatedSystem);
        return updatedSystem;
    }

    const removeSubsystemWithChildren = (subsystem: Subsystem, ele: NodeSingular, system: SystemDescription) => {
        let updatedSystem = removeSubsystem(subsystem, system);
        updatedSystem = ele.children()
            .reduce((carry, node) => {
                const data = node.data();
                if (isSystemObjectData(data)) {
                    return removeObjectWithEdges(data.systemObject, node, carry);
                }
                return carry;
            }, updatedSystem);
        return updatedSystem;
    }

    const deleteElement = () => {
        let updatedSystem = props.system;
        const data = props.element.data();
        if (isConnectionData(data)) {
            updatedSystem = removeConnection(data.connection, updatedSystem);
        } else if (isSystemObjectData(data) && props.element.isNode()) {
            updatedSystem = removeObjectWithEdges(data.systemObject, props.element, updatedSystem);
        } else if (isSubsystemData(data) && props.element.isNode()) {
            if (!props.element.isChildless() &&
                !window.confirm('All the objects in the subsystem will be removed as well. Continue?')
            ) {
                return;
            }
            updatedSystem = removeSubsystemWithChildren(data.subsystem, props.element, updatedSystem);
        }
        props.systemUpdated(updatedSystem);
    }

    return (
        <IconButton
            size='small'
            title="Delete"
            onClick={deleteElement}
        >
            <Delete />
        </IconButton>
    );
};

export default DeleteElementButton;
