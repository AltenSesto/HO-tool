import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { NodeSingular } from 'cytoscape';
import { deleteSystemObject, deleteSubsystem } from '../../store/system-model/actions';
import { getSystemObject } from '../../entities/graph/element-utilities';
import DeleteElementButton from './delete-element-button';
import { showConfirmationDialog } from '../../store/modal-dialog/actions';
import Subsystem from '../../entities/system-description/subsystem';
import SystemObject from '../../entities/system-description/system-object';
import { RootState } from '../../store';
import { getIsSystemObjectInHazard } from '../../entities/hazard-population/hazard';

const mapState = (state: RootState) => ({
    hazards: state.systemModel.hazards
});

const mapDispatch = {
    subsystemDeleted: deleteSubsystem,
    systemObjectDeleted: deleteSystemObject,
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

    const deleteSubsystemWithChildren = (children: (SystemObject | undefined)[]) => {
        children.forEach(e => e && props.systemObjectDeleted(e));
        props.subsystemDeleted(props.subsystem);
    };

    const checkHazardsAndDelete = () => {
        const children = props.element.children().map(e => getSystemObject(e));
        const hasHazardsAssociated = children.some(e => {
            if (!e) {
                return false;
            }
            const isObjectInHazard = getIsSystemObjectInHazard(e);
            return props.hazards.some(isObjectInHazard);
        });

        if (!hasHazardsAssociated) {
            deleteSubsystemWithChildren(children);
        } else {
            props.confirm(
                'Some of the subsystem\'s child objects take part in one ore more hazards. If you delete the subsystem those hazards will be removed as well. Continue?',
                () => deleteSubsystemWithChildren(children)
            );
        }
    };

    const deleteSubsystem = () => {
        props.onClick();
        if (props.element.isChildless()) {
            props.subsystemDeleted(props.subsystem);
        } else {
            props.confirm(
                'All the objects in the subsystem will be removed as well. Continue?',
                checkHazardsAndDelete
            );
        }
    };

    return <DeleteElementButton click={deleteSubsystem} />;
};

export default connector(DeleteSubsystemButton);
