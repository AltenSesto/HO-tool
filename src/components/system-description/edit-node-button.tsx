import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../store';
import SystemObject from '../../entities/system-description/system-object';
import { showConfirmationDialog } from '../../store/modal-dialog/actions';
import { getIsSystemObjectInHazard } from '../../entities/hazard-population/hazard';
import { IconButton } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import Subsystem from '../../entities/system-description/subsystem';
import { isSubsystem } from '../../entities/system-description/system-description-entity';

const mapState = (state: RootState) => ({
    hazards: state.systemModel.hazards
});

const mapDispatch = {
    confirm: showConfirmationDialog
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    node: SystemObject | Subsystem;
    onClick: () => void;
}

const EditNodeButton: React.FC<Props> = (props) => {

    const handleClick = () => {
        if (isSubsystem(props.node)) {
            props.onClick();
        } else {
            const isObjectInHazard = getIsSystemObjectInHazard(props.node);
            if (props.hazards.some(isObjectInHazard)) {
                props.confirm(
                    'This object takes part in one or more hazards. If you edit it those hazards will be affected. Continue?',
                    props.onClick);
            } else {
                props.onClick();
            }
        }
    };

    return (
        <IconButton
            size='small'
            title='Edit'
            onClick={handleClick}
        >
            <Edit />
        </IconButton>
    );
};

export default connector(EditNodeButton);
