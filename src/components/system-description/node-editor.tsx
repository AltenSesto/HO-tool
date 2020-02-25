import React, { useState } from 'react';
import { SystemDescriptionEntity, isSubsystem, isSystemObject } from '../../entities/system-description/system-description-entity';
import Subsystem from '../../entities/system-description/subsystem';
import SystemObject from '../../entities/system-description/system-object';

type EditableEntity = SystemObject | Subsystem;

interface Props {
    entity: EditableEntity;
    allEntities: SystemDescriptionEntity[];
    entityUpdated: (entity: EditableEntity) => void;
    editCancelled: () => void;
}

const NodeEditor: React.FC<Props> = (props: Props) => {

    const [entity, setEntity] = useState(props.entity);

    const defaultParent = "";

    let parentEditor;
    if (isSystemObject(entity)) {
        const subsystems = props.allEntities
            .filter(e => isSubsystem(e))
            .map(e => e as Subsystem)
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((e, index) => <option key={index} value={e.id}>{e.name}</option>);
        let entityParent = defaultParent;
        if (entity.parent) {
            entityParent = entity.parent;
        }
        const updateParent = (ev: React.ChangeEvent<HTMLSelectElement>) => {
            let parent: string | undefined;
            if (ev.target.value !== defaultParent) {
                parent = ev.target.value;
            }
            setEntity({...entity, ...{parent: parent}});
        };
        parentEditor = (
            <React.Fragment>
                Subsystem:
                <select name="subsystem" disabled={subsystems.length === 0} defaultValue={entityParent} onChange={updateParent}>
                    <option key={-1} value={defaultParent}>(none)</option>
                    {subsystems}
                </select>
            </React.Fragment>
        );
    }

    const updateName = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setEntity({...entity, ...{name: ev.target.value}});
    };

    const submitEntity = (ev: React.FormEvent) => {
        props.entityUpdated(entity);
        ev.preventDefault();
    };

    return (
        <form onSubmit={submitEntity} onReset={() => props.editCancelled()}>
            Name:
                <input type="text" name="name" defaultValue={entity.name} onChange={updateName} required />
                {parentEditor}
            <input type="submit" value="OK" />
            <input type="reset" value="Cancel" />
        </form>
    );
};

export default NodeEditor;
