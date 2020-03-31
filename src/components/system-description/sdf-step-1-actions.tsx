import React from 'react';
import { Singular, NodeSingular } from 'cytoscape';
import { IconButton, makeStyles } from '@material-ui/core';
import { Edit, Delete, Link } from '@material-ui/icons';

import { SystemDescriptionEntity } from '../../entities/system-description/system-description-entity';
import { isSystemObjectData, isSubsystemData } from '../../entities/graph/graph-element';
import { ObjectTypes } from '../../entities/system-description/object-types';
import Connection from '../../entities/system-description/connection';
import SubsystemCollapseButton from './subsystem-collapse-button';

interface Props {
    element: Singular;
    editClicked: () => void;
    connectClicked: () => void;
    deleteClicked: (entities: SystemDescriptionEntity[]) => void;
    collapsedStateChanged: (isCollapsed: boolean) => void;
};

const useStyle = makeStyles(() => ({
    subsystem: {
        position: 'relative',
        top: '5px',
        left: '-5px'
    },
    systemObject: {
        position: 'relative',
        top: '-5px',
        left: '-5px'
    },
}));

const SdfStep1Actions: React.FC<Props> = (props) => {
    const classes = useStyle();

    const getObjectWithConnection = (ele: NodeSingular) => {
        return [ele.data().systemObject as SystemDescriptionEntity]
            .concat(ele.connectedEdges().map(e => e.data().connection as Connection));
    };

    const deleteObjectWithEdges = (ele: NodeSingular) => {
        props.deleteClicked(getObjectWithConnection(ele));
    };

    const deleteSubsystemWithChildren = (ele: NodeSingular) => {
        let toDelete = [ele.data().subsystem];
        const children = ele.children();
        if (children.length > 0 &&
            !window.confirm('All the objects in the subsystem will be removed as well. Continue?')
        ) {
            return;
        }
        toDelete = children.reduce((acc, node) => acc.concat(getObjectWithConnection(node)), toDelete);
        props.deleteClicked(toDelete);
    };


    const element = props.element;
    if (element.isNode()) {
        var data = props.element.data();
        if (isSystemObjectData(data)) {
            const object = data.systemObject;

            return (
                <div className={classes.systemObject}>
                    {object.type === ObjectTypes.kind ?
                        <IconButton
                            size='small'
                            title="Connect to containing kind"
                            onClick={props.connectClicked}
                        >
                            <Link />
                        </IconButton>
                        :
                        undefined
                    }
                    <IconButton size='small' title="Edit" onClick={props.editClicked}>
                        <Edit />
                    </IconButton>
                    <IconButton
                        size='small'
                        title="Delete"
                        onClick={() => deleteObjectWithEdges(element)}
                    >
                        <Delete />
                    </IconButton>
                </div>
            );
        }

        if (isSubsystemData(data)) {
            return (
                <div className={classes.subsystem}>
                    <SubsystemCollapseButton
                        node={element}
                        subsystem={data.subsystem}
                        collapsedStateChanged={props.collapsedStateChanged}
                    />
                    <IconButton size='small' title="Edit" onClick={props.editClicked}>
                        <Edit />
                    </IconButton>
                    <IconButton
                        size='small'
                        title="Delete"
                        onClick={() => deleteSubsystemWithChildren(element)}
                    >
                        <Delete />
                    </IconButton>
                </div>
            );
        }
    }

    if (element.isEdge()) {
        const ends = element.connectedNodes().map(e => {
            const data = e.data();
            if (isSystemObjectData(data)) {
                return data.systemObject;
            }
            return null;
        });
        if (!ends.every(e => !!e && e.type === ObjectTypes.kind)) {
            return <React.Fragment></React.Fragment>;
        }

        const connection = element.data().connection as Connection;
        return (
            <IconButton
                size='small'
                title="Delete"
                onClick={() => props.deleteClicked([connection])}
            >
                <Delete />
            </IconButton>);
    }

    throw new Error('Unknown element');
};

export default SdfStep1Actions;
