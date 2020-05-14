import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { EdgeSingular } from 'cytoscape';
import { deleteConnection } from '../../store/system-model/actions';
import Connection from '../../entities/system-description/connection';
import DeleteElementButton from './delete-element-button';
import { getSystemObject } from '../../entities/graph/element-utilities';
import { showConfirmationDialog } from '../../store/modal-dialog/actions';
import { RootState } from '../../store';
import { getIsSystemObjectInHazard } from '../../entities/hazard-population/hazard';

const mapState = (state: RootState) => ({
    hazards: state.systemModel.hazards
});

const mapDispatch = {
    connectionDeleted: deleteConnection,
    confirm: showConfirmationDialog
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    connection: Connection,
    element: EdgeSingular,
    onClick: () => void
}

const DeleteConnectionButton: React.FC<Props> = (props) => {

    const deleteConnection = () => {
        props.onClick();
        const target = getSystemObject(props.element.target());
        if (target) {
            const isTargetInHazard = getIsSystemObjectInHazard(target);
            if (props.hazards.some(isTargetInHazard)) {
                props.confirm(
                    'This connection takes part in one or more hazards. If you delete it those hazards will be deleted as well. Continue?',
                    () => props.connectionDeleted(props.connection, target)
                );
            } else {
                props.connectionDeleted(props.connection, target)
            }
        }
    };

    return <DeleteElementButton click={deleteConnection} />;
};

export default connector(DeleteConnectionButton);
