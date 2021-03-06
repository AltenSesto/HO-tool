import React from 'react';
import { TableRow, TableCell, FormControl, InputLabel, Select, MenuItem, makeStyles } from '@material-ui/core';
import Role from '../../entities/system-description/role';

interface Props {
    roles: Role[];
    roleSelected: (role: Role) => void;
}

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    }
}));

const SelectRoleTableRow: React.FC<Props> = (props: Props) => {
    const classes = useStyles();

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const roleId = event.target.value as string;
        props.roleSelected(props.roles.find(e => e.id === roleId) as Role);
    };

    return (
        <TableRow>
            <TableCell>
                <FormControl className={classes.formControl}>
                    <InputLabel id='label-select-role'>Select role</InputLabel>
                    <Select
                        labelId='label-select-role'
                        onChange={handleChange}
                        value=''
                    >
                        {
                            props.roles
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map(e => <MenuItem key={e.id} value={e.id}>{e.name}</MenuItem>)
                        }
                    </Select>
                </FormControl>
            </TableCell>
            <TableCell colSpan={2}>
            </TableCell>
        </TableRow>
    );
};

export default SelectRoleTableRow;
