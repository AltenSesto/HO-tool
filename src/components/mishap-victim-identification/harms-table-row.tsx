import React from 'react';
import { TableRow, TableCell, Chip, TextField, IconButton, makeStyles } from '@material-ui/core';

import SystemObject from '../../entities/system-description/system-object';
import PossibleHarm from '../../entities/mishap-victim-identification/possible-harm';
import { Add } from '@material-ui/icons';

interface Props {
    role: SystemObject;
    harms: PossibleHarm[];
    harmAdded: (item: PossibleHarm) => void;
    harmDeleted: (item: PossibleHarm) => void;
}

const useStyles = makeStyles(theme => ({
    chip: {
        marginRight: theme.spacing(1),
    }
}));

const HarmsTableRow: React.FC<Props> = (props: Props) => {
    const classes = useStyles();

    const createMishapVictim = (ev: React.FormEvent<HTMLFormElement>) => {
        const form = ev.currentTarget;
        const harm = (form.elements.namedItem("harm") as HTMLInputElement).value;
        form.reset();
        ev.preventDefault();

        const mishapVictim = {
            id: `mishap-victim-${new Date().getTime()}`,
            roleId: props.role.id,
            harm: harm
        };
        props.harmAdded(mishapVictim);
    };

    return (
        <TableRow>
            <TableCell component='th' scope='row'>
                {props.role.name}
            </TableCell>
            <TableCell align='left'>
                {props.harms
                    .sort((a, b) => a.harm.localeCompare(b.harm))
                    .map(e =>
                        <Chip
                            className={classes.chip}
                            key={e.id}
                            label={e.harm}
                            variant='outlined'
                            onDelete={() => props.harmDeleted(e)}
                        />)}
            </TableCell>
            <TableCell align='right'>
                <form action='#' onSubmit={createMishapVictim}>
                    <TextField
                        required
                        autoFocus
                        margin='dense'
                        type='text'
                        name='harm'
                        placeholder='Add New'
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
