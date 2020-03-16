import React, { useState } from 'react';

import AddIcon from '@material-ui/icons/Add';
import { makeStyles, Fab } from '@material-ui/core';

import SystemObject from '../../entities/system-description/system-object';
import { ObjectTypes } from '../../entities/system-description/object-types';
import Subsystem from '../../entities/system-description/subsystem';
import NodeEditor from './node-editor';
import { SystemDescriptionEntity, isSystemObject, isSubsystem } from '../../entities/system-description/system-description-entity';
import { defaultPosition } from '../../entities/graph/element';
import { FlowStepId } from '../../entities/meny/flow-step';
import { flowSteps } from '../../entities/meny/flow';

interface Props {
    entityAdded: (entity: SystemObject | Subsystem) => void;
    allEntities: SystemDescriptionEntity[];
    currentStep: FlowStepId;
}

const useStyles = makeStyles(theme => ({
    root: {
        position: 'fixed',
        bottom: 0,
        zIndex: 110
    },
    fab: {
        marginBottom: theme.spacing(1),
        marginLeft: theme.spacing(2),
        display: 'flex'
    }
}));

const Toolbar: React.FC<Props> = (props: Props) => {

    const [entityEditing, setEntityEditing] = useState<SystemObject | Subsystem | null>(null);
    const classes = useStyles();

    const getId = (prefix: string) => {
        return `${prefix}-${new Date().getTime()}`;
    }

    const startCreatingObject = (type: ObjectTypes) => {
        if (!entityEditing) {
            const obj = { id: getId(type.toString()), name: "", type, posX: defaultPosition.x, posY: defaultPosition.y };
            setEntityEditing(obj);
        }
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
        {
            icon: <AddIcon />,
            name: 'Kind',
            action: () => startCreatingObject(ObjectTypes.kind),
            showOnSteps: [flowSteps.SDF_1]
        },
        {
            icon: <AddIcon />,
            name: 'Role',
            action: () => startCreatingObject(ObjectTypes.role),
            showOnSteps: [flowSteps.SDF_1]
        },
        {
            icon: <AddIcon />,
            name: 'Relator',
            action: () => startCreatingObject(ObjectTypes.relator),
            showOnSteps: [flowSteps.SDF_3]
        },
        {
            icon: <AddIcon />,
            name: 'Subsystem',
            action: startCreatingSubsystem,
            showOnSteps: [flowSteps.SDF_1]
        },
    ].filter(a => a.showOnSteps.some(s => s === props.currentStep));

    if (actions.length === 0) {
        return null;
    }

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
        <div className={classes.root}>
            {actions.map(action => (
                <Fab key={action.name} className={classes.fab} size='small' color='primary' variant='extended' onClick={action.action}>
                    {action.icon}
                    {action.name}
                </Fab>
            ))}
            {editor}
        </div>
    );
};

export default Toolbar;
