import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../store';
import { deleteConnection } from '../../store/system-model/actions';
import Connection from '../../entities/system-description/connection';
import DeleteElementButton from './delete-element-button';

const mapState = (state: RootState) => ({
    hazards: state.systemModel.hazards
});

const mapDispatch = {
    connectionDeleted: deleteConnection
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    connection: Connection
}

const DeleteConnectionButton: React.FC<Props> = (props) => {

    return <DeleteElementButton click={() => props.connectionDeleted(props.connection)} />;
};

export default connector(DeleteConnectionButton);
