import React from 'react';
import { TableContainer, Table, TableRow, TableCell, TableBody, TableHead, IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import Hazard from '../../entities/hazard-population/hazard';

interface Props {
    hazards: Hazard[];
    hazardDeleted: (id: string) => void;
}

const HazardsTable: React.FC<Props> = (props) => {

    return (
        <TableContainer>
            <Table size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Mishap Victim<br />(Env Obj)</TableCell>
                        <TableCell>Exposure</TableCell>
                        <TableCell>Hazard Element<br />(Env Obj)</TableCell>
                        <TableCell>Harm TruthMaker</TableCell>
                        <TableCell>Hazard Description</TableCell>
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.hazards.length === 0 ?
                        <TableRow>
                            <TableCell colSpan={7} align='center'>
                                No hazards identified
                            </TableCell>
                        </TableRow>
                        :
                        props.hazards
                            .sort((a, b) => a.id.localeCompare(b.id))
                            .map((hazard, index) => (
                                <TableRow key={index}>
                                    <TableCell>{hazard.id}</TableCell>
                                    <TableCell>
                                        {hazard.mishapVictim.name}
                                        <br />
                                        ({hazard.mishapVictimEnvObj.name})
                                    </TableCell>
                                    <TableCell>{hazard.exposure.name}</TableCell>
                                    <TableCell>
                                        {hazard.hazardElement.name}
                                        <br />
                                        ({hazard.hazardElementEnvObj.name})
                                    </TableCell>
                                    <TableCell>{hazard.harmTruthmaker}</TableCell>
                                    <TableCell>{hazard.description}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            size='small'
                                            onClick={() => props.hazardDeleted(hazard.id)}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default HazardsTable;
