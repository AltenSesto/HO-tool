import React from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';

import SystemObject from '../../entities/system-description/system-object';
import PossibleHarm from '../../entities/mishap-victim-identification/possible-harm';
import HarmsTableRow from './harms-table-row';

interface Props {
    roles: SystemObject[];
    possibleHarms: PossibleHarm[];
    possibleHarmsUpdated: (items: PossibleHarm[]) => void;
}

const TableView: React.FC<Props> = (props: Props) => {
    const addHarm = (item: PossibleHarm) =>
        props.possibleHarmsUpdated(props.possibleHarms.concat(item));
    const deleteHarm = (item: PossibleHarm) =>
        props.possibleHarmsUpdated(props.possibleHarms.filter(e => e !== item));

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
                                harms={props.possibleHarms.filter(e => e.roleId === role.id)}
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
