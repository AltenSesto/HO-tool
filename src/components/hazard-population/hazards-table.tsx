import React from 'react';
import { TableContainer, Table, TableRow, TableCell, TableBody, TableHead, IconButton, withStyles, createStyles, makeStyles } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import Hazard from '../../entities/hazard-population/hazard';

interface Props {
    hazards: Hazard[];
    hazardDeleted: (id: number) => void;
}

const StyledTableCell = withStyles(theme =>
    createStyles({
        sizeSmall: {
            padding: theme.spacing(1)
        }
    })
)(TableCell);

const useStyles = makeStyles(() => ({
    id: {
        width: '7%'
    },
    mishapVictim: {
        width: '15%'
    },
    exposure: {
        width: '10%'
    },
    hazardElement: {
        width: '15%'
    },
    harmTruthmaker: {
        width: '15%'
    },
    actions: {
        width: '10%'
    }
}));

const HazardsTable: React.FC<Props> = (props) => {
    const classes = useStyles();

    return (
        <TableContainer>
            <Table size='small'>
                <TableHead>
                    <TableRow>
                        <StyledTableCell className={classes.id}>
                            ID
                        </StyledTableCell>
                        <StyledTableCell className={classes.mishapVictim}>
                            Mishap Victim<br />(Env Obj)
                        </StyledTableCell>
                        <StyledTableCell className={classes.exposure}>
                            Exposure
                        </StyledTableCell>
                        <StyledTableCell className={classes.hazardElement}>
                            Hazard Element<br />(Env Obj)
                        </StyledTableCell>
                        <StyledTableCell className={classes.harmTruthmaker}>
                            Harm TruthMaker
                        </StyledTableCell>
                        <StyledTableCell>
                            Hazard Description
                        </StyledTableCell>
                        <StyledTableCell className={classes.actions} />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.hazards.length === 0 ?
                        <TableRow>
                            <TableCell colSpan={7} align='center'>
                                No hazards identified
                            </TableCell>
                        </TableRow>
                        :
                        props.hazards
                            .sort((a, b) => a.id - b.id)
                            .map((hazard, index) => (
                                <TableRow key={index}>
                                    <StyledTableCell>H{hazard.id}</StyledTableCell>
                                    <StyledTableCell>
                                        {hazard.mishapVictim.name}
                                        <br />
                                        ({hazard.mishapVictimEnvObj.name})
                                    </StyledTableCell>
                                    <StyledTableCell>{hazard.exposure.name}</StyledTableCell>
                                    <StyledTableCell>
                                        {hazard.hazardElement.name}
                                        <br />
                                        ({hazard.hazardElementEnvObj.name})
                                    </StyledTableCell>
                                    <StyledTableCell>{hazard.harmTruthmaker}</StyledTableCell>
                                    <StyledTableCell>{hazard.description}</StyledTableCell>
                                    <StyledTableCell>
                                        <IconButton
                                            size='small'
                                            onClick={() => props.hazardDeleted(hazard.id)}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </StyledTableCell>
                                </TableRow>
                            ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default HazardsTable;
