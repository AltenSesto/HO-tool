import React, { useState } from 'react';
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

const Toolbar: React.FC<Props> = (props: Props) => {

    const [entityEditing, setEntityEditing] = useState<SystemObject | Subsystem | null>(null);

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
        <div>
            <button type="button" onClick={() => startCreatingObject(ObjectTypes.kind)}>Add kind</button>
            <button type="button" onClick={() => startCreatingObject(ObjectTypes.role)}>Add role</button>
            <button type="button" onClick={() => startCreatingObject(ObjectTypes.relator)}>Add relator</button>
            <button type="button" onClick={startCreatingSubsystem}>Add subsystem</button>
            {editor}
        </div>
    );
};

export default Toolbar;
