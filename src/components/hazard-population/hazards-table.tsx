import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { TableContainer, Table, TableRow, TableCell, TableBody, TableHead, withStyles, createStyles, makeStyles } from '@material-ui/core';
import HazardsRow from './hazard-row';
import { RootState } from '../../store';
import { updateHazard, deleteHazard } from '../../store/system-model/actions';
import { MishapVictim } from '../../entities/system-description/role';

const mapState = (state: RootState) => ({
    hazards: state.systemModel.hazards
})

const mapDispatch = {
    hazardEdited: updateHazard,
    hazardDeleted: deleteHazard
}

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    selectedMishapVictim?: MishapVictim
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

    let hazards = props.hazards;
    const mishapVictim = props.selectedMishapVictim;
    if (mishapVictim) {
        hazards = hazards.filter(e => e.mishapVictim.id === mishapVictim.id);
    }

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
                    {hazards.length === 0 ?
                        <TableRow>
                            <TableCell colSpan={7} align='center'>
                                No hazards identified
                            </TableCell>
                        </TableRow>
                        :
                        hazards
                            .sort((a, b) => a.id - b.id)
                            .map((hazard, index) => (
                                <HazardsRow 
                                    hazard={hazard}
                                    index={index}
                                    hazardEdited={props.hazardEdited}
                                    hazardDeleted={props.hazardDeleted}
                                />
                            ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default connector(HazardsTable);
