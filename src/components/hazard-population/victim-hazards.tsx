import React from 'react';
import { TableCell, TableHead, TableRow, Table, TableContainer, TableBody, makeStyles, Typography } from '@material-ui/core';
import { NodeSingular, EdgeSingular, SingularElementReturnValue } from 'cytoscape';

import { isMishapVictim, MishapVictim } from '../../entities/system-description/role';
import { getConnection, getRole, getSystemObject } from '../../entities/graph/element-utilities';
import { PossibleHazard, ConnectionToObject } from '../../entities/hazard-population/possible-hazard';
import VictimHazardsRow from './victim-hazards-row';
import Hazard from '../../entities/hazard-population/hazard';
import CornerButtonPrimary from '../shared/corner-button-primary';

interface Props {
    node: NodeSingular;
    hazards: Hazard[];
    hazardsUpdated: (items: Hazard[]) => void;
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

    const addHazard = (hazard: Hazard) => {
        props.hazardsUpdated(props.hazards.concat(hazard));
    };

    const deleteHazard = (hazard: Hazard) => {
        props.hazardsUpdated(props.hazards.filter(e => e.id !== hazard.id));
    };

    const findPossibleHazards = (mishapVictim: MishapVictim) => {
        let result: PossibleHazard[] = [];
        const victimKinds = props.node.incomers();
        const relators = props.node.outgoers();
        const hazardRoles = relators.incomers();

        const hazardElementsEnvObjs: ConnectionToObject[] = [];
        const hazardKinds = hazardRoles.incomers();
        for (let i = 0; i < hazardKinds.length; i++) {
            const envObj = getEntityPair(hazardKinds[i], true);
            if (envObj) {
                hazardElementsEnvObjs.push(envObj);
            }
        }

        for (let i = 0; i < victimKinds.length; i++) {
            const mishapVictimEnvObj = getEntityPair(victimKinds[i], true);
            if (!mishapVictimEnvObj) {
                continue;
            }
            for (let j = 0; j < relators.length; j++) {
                const exposure = getEntityPair(relators[j], false);
                if (!exposure) {
                    continue;
                }
                for (let k = 0; k < hazardRoles.length; k++) {
                    const hazardElement = getEntityPair(hazardRoles[k], true);
                    if (!hazardElement) {
                        continue;
                    }
                    result.push({
                        mishapVictim,
                        mishapVictimEnvObj,
                        exposure,
                        hazardElement,
                        hazardElementEnvObjs: hazardElementsEnvObjs
                            .filter(e => e.connection.target === hazardElement.object.id)
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
                            possibleHazards.map((hazard, index) => {
                                const actualHazards = props.hazards.filter(e =>
                                    e.exposureConn === hazard.exposure.connection.id &&
                                    e.hazardElementConn === hazard.hazardElement.connection.id &&
                                    e.mishapVictimEnvObjConn === hazard.mishapVictimEnvObj.connection.id);
                                return <VictimHazardsRow
                                    key={index}
                                    hazardTemplate={hazard}
                                    hazards={actualHazards}
                                    hazardCreated={addHazard}
                                    hazardDeleted={deleteHazard}
                                />
                            })
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
