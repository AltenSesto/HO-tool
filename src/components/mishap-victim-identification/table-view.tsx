import React from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';

import SystemObject from '../../entities/system-description/system-object';
import MishapVictim from '../../entities/mishap-victim-identification/mishap-victim';
import HarmsTableRow from './harms-table-row';

interface Props {
    roles: SystemObject[];
    mishapVictims: MishapVictim[];
    mishapVictimsUpdated: (items: MishapVictim[]) => void;
}

const TableView: React.FC<Props> = (props: Props) => {
    const addHarm = (item: MishapVictim) =>
        props.mishapVictimsUpdated(props.mishapVictims.concat(item));
    const deleteHarm = (item: MishapVictim) =>
        props.mishapVictimsUpdated(props.mishapVictims.filter(e => e !== item));

    return (
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
                    {props.roles
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(role => (
                            <HarmsTableRow
                                key={role.id}
                                role={role}
                                harms={props.mishapVictims.filter(e => e.roleId === role.id)}
                                harmAdded={addHarm}
                                harmDeleted={deleteHarm}
                            />
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TableView;
