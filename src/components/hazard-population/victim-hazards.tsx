import React from 'react';
import { TableCell, TableHead, TableRow, Table, TableContainer, TableBody, makeStyles, Button, Typography } from '@material-ui/core';
import { NodeSingular, EdgeSingular, SingularElementReturnValue } from 'cytoscape';
import { isMishapVictim, MishapVictim } from '../../entities/system-description/role';
import { getConnection, getRole, getSystemObject } from '../../entities/graph/element-utilities';
import { PossibleHazard } from '../../entities/hazard-population/possible-hazard';

interface Props {
    node: NodeSingular;
    close: () => void;
}

const useStyles = makeStyles(theme => ({
    buttonBack: {
        marginLeft: theme.spacing(2),
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2) + 40
    },
    header: {
        marginLeft: theme.spacing(2)
    }
}));

const VictimHazards: React.FC<Props> = (props) => {
    const classes = useStyles();

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
                    if (!hazardElement || hazardElement.object.id === mishapVictim.id) {
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

    const mishapVictim = getRole(props.node);
    if (!mishapVictim || !isMishapVictim(mishapVictim)) {
        throw new Error('Enity passed is not a mishap victim');
    }
    const hazards = findPossibleHazards(mishapVictim);

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
                        {hazards.length === 0 ?
                            <TableRow>
                                <TableCell align='center' colSpan={3}>
                                    No possible hazards identified
                                </TableCell>
                            </TableRow>
                            :
                            hazards.map(hazard => (
                                <TableRow>
                                    <TableCell>{hazard.mishapVictimEnvObj.object.name}</TableCell>
                                    <TableCell>{hazard.exposure.object.name}</TableCell>
                                    <TableCell>{hazard.hazardElement.object.name}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <Button
                className={classes.buttonBack}
                variant='contained'
                color='primary'
                onClick={props.close}
            >
                Back
            </Button>
        </React.Fragment>
    );
};

export default VictimHazards;
