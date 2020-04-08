import React, { useState } from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';

import HarmsTableRow from './harms-table-row';
import SelectRoleTableRow from './select-role-table-row';
import Role, { isMishapVictim } from '../../entities/system-description/role';
import CornerButtonPrimary from '../shared/corner-button-primary';

interface Props {
    roles: Role[];
    possibleHarmsUpdated: (role: Role) => void;
}

const TableView: React.FC<Props> = (props: Props) => {

    const [newlyAdded, setNewlyAdded] = useState<string[]>([]);
    const [isSelectingRole, setIsSelectingRole] = useState(false);

    const addNewRole = (role: Role) => {
        setNewlyAdded(newlyAdded.concat(role.id));
        setIsSelectingRole(false);
    };

    const existingMishapVictims = props.roles
        .filter(e => isMishapVictim(e) && !newlyAdded.some(n => n === e.id))
        .sort((a, b) => a.name.localeCompare(b.name));
    // sorting - existing alphabeticaly, newly added in order of adding
    const newlyAddedMishapVictims = props.roles.filter(e => newlyAdded.some(n => n === e.id));
    const mishapVictims = existingMishapVictims.concat(newlyAddedMishapVictims);

    const rolesToSelect = props.roles.filter(r => !mishapVictims.some(e => e.id === r.id));

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
                                    key={e.id}
                                    role={e}
                                    harmsUpdated={props.possibleHarmsUpdated}
                                />
                            ))}
                        {isSelectingRole ?
                            <SelectRoleTableRow roles={rolesToSelect} roleSelected={addNewRole} />
                            :
                            undefined}
                    </TableBody>
                </Table>
            </TableContainer>
            <CornerButtonPrimary
                onClick={() => { !isSelectingRole && setIsSelectingRole(true) }}
                disabled={rolesToSelect.length === 0}
            >
                {rolesToSelect.length === 0 ?
                    'All mishap victims have been identified' :
                    'Add new mishap victim'}
            </CornerButtonPrimary>
        </React.Fragment>
    );
};

export default TableView;
