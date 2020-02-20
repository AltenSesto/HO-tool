import React, { memo } from 'react';
import SystemObject from '../../entities/system-description/system-object';
import { ObjectTypes } from '../../entities/system-description/object-types';

interface Props {
    objectAdded: (o: SystemObject) => void;
}

const Toolbar: React.FC<Props> = memo((props: Props) => {

    const getName = () => {
        const name = prompt('Enter name');
        if (!name || !name.trim()) {
            return null;
        }
        return name;
    }

    const getId = (prefix: string) => {
        return `${prefix}-${new Date().getTime()}`;
    }

    const createObject = (type: ObjectTypes) => {
        const name = getName();
        if (name === null) {
            return;
        };
        const obj = { id: getId(type.toString()), name, type, posX: 100, posY: 100 };
        props.objectAdded(obj);
    };

    return (
        <div>
            <button type="button" onClick={() => createObject(ObjectTypes.kind)}>Add kind</button>
            <button type="button" onClick={() => createObject(ObjectTypes.role)}>Add role</button>
            <button type="button" onClick={() => createObject(ObjectTypes.relator)}>Add relator</button>
        </div>
    );
});

export default Toolbar;
