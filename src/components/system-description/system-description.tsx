import React, { useState } from 'react';
import Toolbar from './toolbar';
import SystemObject from '../../entities/system-description/system-object';
import Graph from './graph';
import Connection from '../../entities/system-description/connection';

const SystemDescription: React.FC = () => {
    const [objects, setObjects] = useState<SystemObject[]>([]);
    const [connections, setConnections] = useState<Connection[]>([]);

    const addObject = (obj: SystemObject) => {
        setObjects(objects.concat(obj));
    };

    const deleteObject = (id: string) => {
        setObjects(objects.filter(e => e.id !== id));
    }

    const updateObject = (updatedObj: SystemObject) => {
        setObjects(objects.map(e => e.id === updatedObj.id ? updatedObj : e));
    };

    return (
        <React.Fragment>
            <Toolbar objectAdded={addObject}></Toolbar>
            <Graph objects={objects} objectDeleted={deleteObject} objectUpdated={updateObject}></Graph>
        </React.Fragment>
    );
};

export default SystemDescription;
