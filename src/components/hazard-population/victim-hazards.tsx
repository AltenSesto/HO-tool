import React from 'react';
import { TableCell, TableHead, TableRow, Table, TableContainer, TableBody, makeStyles, Typography } from '@material-ui/core';
import { NodeSingular, EdgeSingular, SingularElementReturnValue } from 'cytoscape';

import Role, { isMishapVictim, MishapVictim } from '../../entities/system-description/role';
import { getConnection, getRole, getSystemObject } from '../../entities/graph/element-utilities';
import { PossibleHazard } from '../../entities/hazard-population/possible-hazard';
import VictimHazardsRow from './victim-hazards-row';
import Connection from '../../entities/system-description/connection';
import { Hazard } from '../../entities/hazard-population/hazard';
import CornerButtonPrimary from '../shared/corner-button-primary';

interface Props {
    node: NodeSingular;
    roles: Role[];
    connections: Connection[];
    systemUpdated: (system: { roles: Role[], systemObjectConnections: Connection[] }) => void;
    close: () => void;
}

const useStyles = makeStyles(theme => ({
    header: {
        marginLeft: theme.spacing(2)
    }
}));

const VictimHazards: React.FC<Props> = (props) => {
    const classes = useStyles();
    const mishapVictim = getRole(props.node);
    if (!mishapVictim || !isMishapVictim(mishapVictim)) {
        throw new Error('Enity passed is not a mishap victim');
    }

    const tagConnections = (hazardId: string, connectionIds: string[]) => {
        const updatedConnections = props.connections
            .map(e => {
                if (connectionIds.every(id => id !== e.id)) {
                    return e;
                }
                return { ...e, ...{ hazardIds: e.hazardIds.concat(hazardId) } }
            });
        return updatedConnections;
    };

    const unTagConnections = (hazardId: string, connectionIds: string[]) => {
        const updatedConnections = props.connections
            .map(e => {
                if (connectionIds.every(id => id !== e.id)) {
                    return e;
                }
                return { ...e, ...{ hazardIds: e.hazardIds.filter(e => e !== hazardId) } }
            });
        return updatedConnections;
    };

    const addHazard = (hazard: Hazard) => {
        const updatdeRoles = props.roles
            .map(e => {
                if (e.id !== mishapVictim.id) {
                    return e;
                }
                return { ...e, ...{ hazards: e.hazards.concat(hazard.details) } };
            });
        const updatedConnections = tagConnections(
            hazard.details.id,
            [hazard.exposure.connection.id,
            hazard.hazardElement.connection.id,
            hazard.mishapVictimEnvObj.connection.id
            ]);
        props.systemUpdated({ roles: updatdeRoles, systemObjectConnections: updatedConnections });
    };

    const deleteHazard = (hazard: Hazard) => {
        const updatdeRoles = props.roles
            .map(e => {
                if (e.id !== mishapVictim.id) {
                    return e;
                }
                return { ...e, ...{ hazards: e.hazards.filter(e => e.id !== hazard.details.id) } };
            });
        const updatedConnections = unTagConnections(
            hazard.details.id,
            [hazard.exposure.connection.id,
            hazard.hazardElement.connection.id,
            hazard.mishapVictimEnvObj.connection.id
            ]);
        props.systemUpdated({ roles: updatdeRoles, systemObjectConnections: updatedConnections });
    };

    const findPossibleHazards = (mishapVictim: MishapVictim) => {
        let result: PossibleHazard[] = [];
        const victimKinds = props.node.incomers();
        const relators = props.node.outgoers();
        const hazardRoles = relators.incomers();
        for (var i = 0; i < victimKinds.length; i++) {
            const mishapVictimEnvObj = getEntityPair(victimKinds[i], true);
            if (!mishapVictimEnvObj) {
                continue;
            }
            for (var j = 0; j < relators.length; j++) {
                const exposure = getEntityPair(relators[j], false);
                if (!exposure) {
                    continue;
                }
                for (var k = 0; k < hazardRoles.length; k++) {
                    const hazardElement = getEntityPair(hazardRoles[k], true);
                    if (!hazardElement) {
                        continue;
                    }
                    result.push({
                        mishapVictim, mishapVictimEnvObj, exposure, hazardElement
                    });
                }
            }
        }
        return result;
    };


    const getEntityPair = (
        ele: SingularElementReturnValue | (NodeSingular & EdgeSingular),
        takeSource: boolean
    ) => {
        if (ele.isEdge()) {
            const node = takeSource ? ele.source() : ele.target();
            const object = getSystemObject(node);
            const connection = getConnection(ele);
            if (object && connection) {
                return { object, connection };
            }
        }
        return null;
    }

    const possibleHazards = findPossibleHazards(mishapVictim);
    const actualMishapVictim = props.roles.find(e => e.id === mishapVictim.id);
    if (!actualMishapVictim) {
        throw new Error('Mishap victim not found among the roles');
    }

    return (
        <React.Fragment>
            <Typography variant="h5" className={classes.header}>
                Mishap Victim - {mishapVictim.name}
            </Typography>
            <Typography variant="h6" color="textSecondary" className={classes.header}>
                Possible Harms
                </Typography>
            <Typography variant="body2" className={classes.header}>
                {mishapVictim.possibleHarms.join(', ')}
            </Typography>
            <Typography variant="h6" color="textSecondary" className={classes.header} gutterBottom>
                Hazards
            </Typography>
            <TableContainer>
                <Table size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell>Environmental Object</TableCell>
                            <TableCell>Exposure</TableCell>
                            <TableCell>Hazard Element</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {possibleHazards.length === 0 ?
                            <TableRow>
                                <TableCell align='center' colSpan={3}>
                                    No possible hazards identified
                                </TableCell>
                            </TableRow>
                            :
                            possibleHazards.map((hazard, index) => (
                                <VictimHazardsRow
                                    key={index}
                                    hazardTemplate={hazard}
                                    hazardDetails={actualMishapVictim.hazards}
                                    hazardCreated={addHazard}
                                    hazardDeleted={deleteHazard}
                                />
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <CornerButtonPrimary onClick={props.close} >
                Back
            </CornerButtonPrimary>
        </React.Fragment>
    );
};

export default VictimHazards;
