import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Action, Dispatch } from 'redux';
import { TableRow, TableCell, Chip, TextField, IconButton, makeStyles } from '@material-ui/core';

import { Add } from '@material-ui/icons';
import Role, { MishapVictim } from '../../entities/system-description/role';
import { addPossibleHarm, removePossibleHarm } from '../../store/system-model/actions';
import { RootState } from '../../store';
import Hazard from '../../entities/hazard-population/hazard';

const mapState = (state: RootState) => ({
    hazards: state.systemModel.hazards
});

const mapDispatch = (dispatch: Dispatch<Action>) => ({
    harmAdded: (mishapVictim: MishapVictim, harm: string) =>
        dispatch(addPossibleHarm(mishapVictim, harm)),
    harmDeleted: (mishapVictim: MishapVictim, harm: string, hazards: Hazard[]) =>
        removePossibleHarm(mishapVictim, harm, hazards, dispatch)
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    role: Role;
}

const useStyles = makeStyles(theme => ({
    chip: {
        marginRight: theme.spacing(1),
    }
}));

const HarmsTableRow: React.FC<Props> = (props: Props) => {
    const classes = useStyles();

    const addHarm = (ev: React.FormEvent<HTMLFormElement>) => {
        const form = ev.currentTarget;
        const harm = (form.elements.namedItem("harm") as HTMLInputElement).value;
        form.reset();
        ev.preventDefault();
        props.harmAdded(props.role, harm);
    };

    const deleteHarm = (harm: string) => {
        props.harmDeleted(props.role, harm, props.hazards);
    };

    return (
        <TableRow>
            <TableCell component='th' scope='row'>
                {props.role.name}
            </TableCell>
            <TableCell align='left'>
                {props.role.possibleHarms
                    .sort((a, b) => a.localeCompare(b))
                    .map((harm, index) =>
                        <Chip
                            className={classes.chip}
                            key={index}
                            label={harm}
                            variant='outlined'
                            onDelete={() => deleteHarm(harm)}
                        />)}
            </TableCell>
            <TableCell align='right'>
                <form action='#' onSubmit={addHarm}>
                    <TextField
                        required
                        autoFocus
                        margin='dense'
                        type='text'
                        name='harm'
                        placeholder='Add Harm'
                        autoComplete='off'
                    />
                    <IconButton size='small' type='submit' edge='end' title='Add'>
                        <Add />
                    </IconButton>
                </form>
            </TableCell>
        </TableRow>
    );
};

export default connector(HarmsTableRow);
