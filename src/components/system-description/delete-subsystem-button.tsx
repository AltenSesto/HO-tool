import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { NodeSingular } from 'cytoscape';
import { RootState } from '../../store';
import { deleteSystemObject, deleteConnection, deleteSubsystem } from '../../store/system-model/actions';
import SystemObject from '../../entities/system-description/system-object';
import { getConnection, getSystemObject } from '../../entities/graph/element-utilities';
import DeleteElementButton from './delete-element-button';
import { showConfirmationDialog } from '../../store/modal-dialog/actions';
import Subsystem from '../../entities/system-description/subsystem';

const mapState = (state: RootState) => ({
    hazards: state.systemModel.hazards
});

const mapDispatch = {
    subsystemDeleted: deleteSubsystem,
    systemObjectDeleted: deleteSystemObject,
    connectionDeleted: deleteConnection,
    confirm: showConfirmationDialog
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    subsystem: Subsystem,
    element: NodeSingular,
    onClick: () => void
}

const DeleteSubsystemButton: React.FC<Props> = (props) => {
    const deleteObjectWithConnections = (systemObject: SystemObject, element: NodeSingular) => {
        const connections = element.connectedEdges();
        for (var i = 0; i < connections.length; i++) {
            const connection = getConnection(connections[i]);
            if (connection) {
                props.connectionDeleted(connection);
            }
        }
        props.systemObjectDeleted(systemObject);
    };

    const deleteSubsystemWithChildren = () => {
        const children = props.element.children();
        for (var i = 0; i < children.length; i++) {
            const childElement = children[i];
            const systemObject = getSystemObject(childElement);
            if (systemObject) {
                deleteObjectWithConnections(systemObject, childElement);
            }
        }
        props.subsystemDeleted(props.subsystem);
    };

    const deleteSubsystem = () => {
        props.onClick();
        if (props.element.isChildless()) {
            props.subsystemDeleted(props.subsystem);
        } else {
            props.confirm(
                'All the objects in the subsystem will be removed as well. Continue?',
                deleteSubsystemWithChildren
            );
        }
    };

    return <DeleteElementButton click={deleteSubsystem} />;
};

export default connector(DeleteSubsystemButton);
