import React from 'react';
import { TableRow, TableCell, Chip, TextField, IconButton, makeStyles } from '@material-ui/core';

import { Add } from '@material-ui/icons';
import Role from '../../entities/system-description/role';

interface Props {
    role: Role;
    harmsUpdated: (role: Role) => void;
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

        const updatedHarms = props.role.possibleHarms.concat(harm);
        props.harmsUpdated({ ...props.role, ...{ possibleHarms: updatedHarms } });
    };

    const deleteHarm = (harm: string) => {
        const updatedHarms = props.role.possibleHarms.filter(e => e !== harm);
        props.harmsUpdated({ ...props.role, ...{ possibleHarms: updatedHarms } });
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

export default HarmsTableRow;
