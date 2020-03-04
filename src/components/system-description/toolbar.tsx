import React, { useState } from 'react';

import AddIcon from '@material-ui/icons/Add';
import FolderIcon from '@material-ui/icons/Folder';
import { makeStyles, Backdrop } from '@material-ui/core';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@material-ui/lab';

import SystemObject from '../../entities/system-description/system-object';
import { ObjectTypes } from '../../entities/system-description/object-types';
import Subsystem from '../../entities/system-description/subsystem';
import NodeEditor from './node-editor';
import { SystemDescriptionEntity, isSystemObject, isSubsystem } from '../../entities/system-description/system-description-entity';
import { defaultPosition } from '../../entities/graph/element';

interface Props {
    entityAdded: (entity: SystemObject | Subsystem) => void;
    allEntities: SystemDescriptionEntity[];
}

const useStyles = makeStyles(theme => ({
    speedDial: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    }
}));

const Toolbar: React.FC<Props> = (props: Props) => {

    const [entityEditing, setEntityEditing] = useState<SystemObject | Subsystem | null>(null);
    const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);
    const classes = useStyles();

    const handleOpenSpeedDial = () => {
        setIsSpeedDialOpen(true);
    };

    const handleCloseSpeedDial = () => {
        setIsSpeedDialOpen(false);
    };

    const getId = (prefix: string) => {
        return `${prefix}-${new Date().getTime()}`;
    }

    const startCreatingObject = (type: ObjectTypes) => {
        if (!entityEditing) {
            const obj = { id: getId(type.toString()), name: "", type, posX: defaultPosition.x, posY: defaultPosition.y };
            setEntityEditing(obj);
        }
        handleCloseSpeedDial();
    };

    const completeCreatingEntity = (entity: SystemObject | Subsystem) => {
        setEntityEditing(null);
        if (isSystemObject(entity) && entity.parent) {
            const parent = props.allEntities.find(e => e.id === entity.parent);
            if (parent && isSubsystem(parent)) {
                entity.posX = parent.posX;
                entity.posY = parent.posY;
            }
        }
        props.entityAdded(entity);
    };

    const cancelCreatingEntity = () => {
        setEntityEditing(null);
    };

    const startCreatingSubsystem = () => {
        if (!entityEditing) {
            setEntityEditing({
                id: getId('subsystem'),
                name: "",
                posX: defaultPosition.x,
                posY: defaultPosition.y,
                isCollapsed: false
            });
        }
    };

    const actions = [
        { icon: <AddIcon />, name: 'Kind', action: () => startCreatingObject(ObjectTypes.kind) },
        { icon: <AddIcon />, name: 'Role', action: () => startCreatingObject(ObjectTypes.role) },
        { icon: <AddIcon />, name: 'Relator', action: () => startCreatingObject(ObjectTypes.relator) },
        { icon: <FolderIcon />, name: 'Subsystem', action: startCreatingSubsystem },
    ];
    
    let editor;
    if (entityEditing) {
        editor = <NodeEditor
            allEntities={props.allEntities}
            entity={entityEditing}
            entityUpdated={completeCreatingEntity}
            editCancelled={cancelCreatingEntity}>
        </NodeEditor>
    }

    return (
        <React.Fragment>
            <Backdrop open={isSpeedDialOpen} />
            <SpeedDial
                ariaLabel="Add new element"
                className={classes.speedDial}
                icon={<SpeedDialIcon />}
                onClose={handleCloseSpeedDial}
                onOpen={handleOpenSpeedDial}
                open={isSpeedDialOpen}
            >
                {actions.map(action => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        tooltipOpen
                        onClick={action.action}
                    />
                ))}
            </SpeedDial>
            {editor}
        </React.Fragment>
    );
};

export default Toolbar;
