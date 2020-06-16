import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { TableContainer, Table, TableRow, TableCell, TableBody, TableHead, makeStyles } from '@material-ui/core';
import HazardsRow from './hazard-row';
import { RootState } from '../../store';
import { updateHazard, deleteHazard } from '../../store/system-model/actions';
import { MishapVictim } from '../../entities/system-description/role';
import TableCellSmall from '../shared/table-cell-small';

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
                        <TableCellSmall className={classes.id}>
                            ID
                        </TableCellSmall>
                        <TableCellSmall className={classes.mishapVictim}>
                            Mishap Victim<br />(Env Obj)
                        </TableCellSmall>
                        <TableCellSmall className={classes.exposure}>
                            Exposure
                        </TableCellSmall>
                        <TableCellSmall className={classes.hazardElement}>
                            Hazard Element<br />(Env Obj)
                        </TableCellSmall>
                        <TableCellSmall className={classes.harmTruthmaker}>
                            Harm TruthMaker
                        </TableCellSmall>
                        <TableCellSmall>
                            Hazard Description
                        </TableCellSmall>
                        <TableCellSmall className={classes.actions} />
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
                                    key={index}
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
