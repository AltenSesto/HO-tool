import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { TableRow, TableCell, Chip, TextField, IconButton, makeStyles } from '@material-ui/core';

import { Add } from '@material-ui/icons';
import Role from '../../entities/system-description/role';
import { addPossibleHarm, removePossibleHarm } from '../../store/system-model/actions';

const mapDispatch = {
    harmAdded: addPossibleHarm,
    harmDeleted: removePossibleHarm
};

const connector = connect(null, mapDispatch);

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
        props.harmAdded(props.role.id, harm);
    };

    const deleteHarm = (harm: string) => {
        props.harmDeleted(props.role.id, harm);
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
