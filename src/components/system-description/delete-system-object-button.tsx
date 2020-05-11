import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { NodeSingular } from 'cytoscape';
import { RootState } from '../../store';
import { deleteSystemObject, deleteConnection } from '../../store/system-model/actions';
import SystemObject from '../../entities/system-description/system-object';
import { getConnection } from '../../entities/graph/element-utilities';
import DeleteElementButton from './delete-element-button';

const mapState = (state: RootState) => ({
    hazards: state.systemModel.hazards
});

const mapDispatch = {
    systemObjectDeleted: deleteSystemObject,
    connectionDeleted: deleteConnection
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    systemObject: SystemObject,
    element: NodeSingular
}

const DeleteSystemObjectButton: React.FC<Props> = (props) => {

    const deleteObjectWithConnections = () => {
        const connections = props.element.connectedEdges();
        for (var i = 0; i < connections.length; i++) {
            const connection = getConnection(connections[i]);
            if (connection) {
                props.connectionDeleted(connection);
            }
        }
        props.systemObjectDeleted(props.systemObject);
    };

    return <DeleteElementButton click={deleteObjectWithConnections} />;
};

export default connector(DeleteSystemObjectButton);
