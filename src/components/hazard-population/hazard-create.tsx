import React, { useState, useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { TableRow, TableCell, TableContainer, Table, TableHead, TableBody, withStyles, createStyles, Theme, Grid, Typography, makeStyles } from '@material-ui/core';
import { NodeSingular, EdgeSingular, SingularElementReturnValue } from 'cytoscape';

import { PossibleHazard, ConnectionToObject } from '../../entities/hazard-population/possible-hazard';
import HazardCreateDetails from './hazard-create-details';
import { getRole, getSystemObject, getConnection } from '../../entities/graph/element-utilities';
import { isMishapVictim, MishapVictim } from '../../entities/system-description/role';
import { RootState } from '../../store';
import { createHazard } from '../../store/system-model/actions';

const mapState = (state: RootState) => ({
    nextHazardId: state.systemModel.nextHazardId
})

const mapDispatch = {
    hazardCreated: createHazard,
}

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    node: NodeSingular
}

const StyledTableRow = withStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: theme.palette.grey[200],
            cursor: 'pointer'
        }
    })
)(TableRow);

const useStyles = makeStyles(theme => ({
    header: {
        marginLeft: theme.spacing(2)
    }
}));


const HazardCreate: React.FC<Props> = (props) => {

    const classes = useStyles();

    const [template, setTemplate] = useState<PossibleHazard | null>(null);
    const [possibleHazards, setPossibleHazards] = useState<PossibleHazard[]>([]);

    useEffect(() => {
        const mishapVictim = getRole(props.node);
        if (!mishapVictim || !isMishapVictim(mishapVictim)) {
            throw new Error('Entity passed is not a mishap victim');
        }

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

        setPossibleHazards(findPossibleHazards(mishapVictim));
    }, [props.node]);

    const renderDetailsForm = (possibleHazard: PossibleHazard) => {
        if (template !== possibleHazard) {
            return <React.Fragment></React.Fragment>;
        }

        return (
            <HazardCreateDetails
                template={template}
                nextHazardId={props.nextHazardId}
                hazardCreated={props.hazardCreated}
            />
        );
    }

    return (
        <React.Fragment>
            <Grid container>
                <Grid item xs={12}>
                    <Typography variant='caption' className={classes.header}>
                        Select a table row to add
                    </Typography>
                </Grid>
            </Grid>
            <TableContainer>
                <Table size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell>Mishap Victim (Env Obj)</TableCell>
                            <TableCell>Exposure</TableCell>
                            <TableCell>Hazard Element</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {possibleHazards.length === 0 ?
                            <TableRow>
                                <TableCell colSpan={3} align='center'>
                                    No possible hazards found
                            </TableCell>
                            </TableRow>
                            :
                            possibleHazards.map((hazard, index) => (
                                <React.Fragment key={index}>
                                    <StyledTableRow onClick={() => setTemplate(hazard)} >
                                        <TableCell>
                                            {hazard.mishapVictim.name} ({hazard.mishapVictimEnvObj.object.name})
                                        </TableCell>
                                        <TableCell>
                                            {hazard.exposure.object.name}
                                        </TableCell>
                                        <TableCell>
                                            {hazard.hazardElement.object.name}
                                        </TableCell>
                                    </StyledTableRow>
                                    {renderDetailsForm(hazard)}
                                </React.Fragment>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </React.Fragment>
    );
};

export default connector(HazardCreate);
