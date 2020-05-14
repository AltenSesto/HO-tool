import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { deleteSystemObject } from '../../store/system-model/actions';
import SystemObject from '../../entities/system-description/system-object';
import DeleteElementButton from './delete-element-button';
import { showConfirmationDialog } from '../../store/modal-dialog/actions';
import { RootState } from '../../store';
import { getIsSystemObjectInHazard } from '../../entities/hazard-population/hazard';

const mapState = (state: RootState) => ({
    hazards: state.systemModel.hazards
});

const mapDispatch = {
    systemObjectDeleted: deleteSystemObject,
    confirm: showConfirmationDialog
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    systemObject: SystemObject,
    onClick: () => void
}

const DeleteSystemObjectButton: React.FC<Props> = (props) => {

    const deleteObject = () => {
        props.onClick();
        const isObjectInHazard = getIsSystemObjectInHazard(props.systemObject);
        if (props.hazards.some(isObjectInHazard)) {
            props.confirm(
                'This object takes part in one or more hazards. If you delete it those hazards will be deleted as well. Continue?',
                () => props.systemObjectDeleted(props.systemObject));
        } else {
            props.systemObjectDeleted(props.systemObject);
        }
    };

    return <DeleteElementButton click={deleteObject} />;
};

export default connector(DeleteSystemObjectButton);
