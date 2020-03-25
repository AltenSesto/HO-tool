import React, { useState } from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, makeStyles } from '@material-ui/core';

import SystemObject from '../../entities/system-description/system-object';
import PossibleHarm from '../../entities/mishap-victim-identification/possible-harm';
import HarmsTableRow from './harms-table-row';
import SelectRoleTableRow from './select-role-table-row';

interface Props {
    roles: SystemObject[];
    possibleHarms: PossibleHarm[];
    possibleHarmsUpdated: (items: PossibleHarm[]) => void;
}

const useStyles = makeStyles(theme => ({
    buttonAdd: {
        marginLeft: theme.spacing(2),
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2) + 40
    }
}));

const TableView: React.FC<Props> = (props: Props) => {
    const classes = useStyles();

    const [newlyAdded, setNewlyAdded] = useState<SystemObject[]>([]);
    const [isSelectingRole, setIsSelectingRole] = useState(false);

    const addHarm = (item: PossibleHarm) =>
        props.possibleHarmsUpdated(props.possibleHarms.concat(item));
    const deleteHarm = (item: PossibleHarm) =>
        props.possibleHarmsUpdated(props.possibleHarms.filter(e => e !== item));

    const addNewRole = (role: SystemObject) => {
        setNewlyAdded(newlyAdded.concat(role));
        setIsSelectingRole(false);
    };

    const existingMishapVictims = props.roles
        .filter(e => newlyAdded.indexOf(e) < 0)
        .map(r => ({ role: r, harms: props.possibleHarms.filter(h => h.roleId === r.id) }))
        .filter(e => e.harms.length > 0)
        .sort((a, b) => a.role.name.localeCompare(b.role.name));
    const newlyAddedMishapVictims = newlyAdded
        .map(r => ({ role: r, harms: props.possibleHarms.filter(h => h.roleId === r.id) }));
    const mishapVictims = existingMishapVictims.concat(newlyAddedMishapVictims);

    let rolesToSelect: SystemObject[] = [];
    if (isSelectingRole) {
        rolesToSelect = props.roles.filter(r =>
            !existingMishapVictims.some(e => e.role.id === r.id) &&
            !newlyAddedMishapVictims.some(e => e.role.id === r.id));
    }

    return (
        <React.Fragment>
            <TableContainer>
                <Table size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell>Mishap Victims</TableCell>
                            <TableCell align='left'>Possible Harms</TableCell>
                            <TableCell align='right'>&nbsp;</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {!isSelectingRole && mishapVictims.length === 0 ?
                            <TableRow>
                                <TableCell align='center' colSpan={3}>
                                    No mishap victims identified
                                </TableCell>
                            </TableRow>
                            :
                            mishapVictims.map(e => (
                                <HarmsTableRow
                                    key={e.role.id}
                                    role={e.role}
                                    harms={e.harms}
                                    harmAdded={addHarm}
                                    harmDeleted={deleteHarm}
                                />
                            ))}
                        {isSelectingRole ?
                            <SelectRoleTableRow roles={rolesToSelect} roleSelected={addNewRole} />
                            :
                            undefined}
                    </TableBody>
                </Table>
            </TableContainer>
            <Button
                className={classes.buttonAdd}
                variant='contained'
                color='primary'
                onClick={() => { !isSelectingRole && setIsSelectingRole(true) }}
            >
                Add new mishap victim
            </Button>
        </React.Fragment>
    );
};

export default TableView;
