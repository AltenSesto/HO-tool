import React from 'react';
import { TableContainer, Table, TableRow, TableCell, TableBody, TableHead, IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { PossibleHazard } from '../../entities/hazard-population/possible-hazard';
import Hazard from '../../entities/hazard-population/hazard';

interface Props {
    possibleHazards: PossibleHazard[];
    actualHazards: Hazard[];
    hazardDeleted: (id: string) => void;
}

const HazardsTable: React.FC<Props> = (props) => {
    const hazards = props.possibleHazards
        .map(possibleHazard => props.actualHazards
            .filter(e =>
                e.exposureConn === possibleHazard.exposure.connection.id &&
                e.hazardElementConn === possibleHazard.hazardElement.connection.id &&
                e.mishapVictimEnvObjConn === possibleHazard.mishapVictimEnvObj.connection.id)
            .map(hazard => {
                const hazardElEnvObj = possibleHazard.hazardElementEnvObjs
                    .find(e => e.connection.id === hazard.hazardElementEnvObjConn);
                return {
                    id: hazard.id,
                    mishapVictim: possibleHazard.mishapVictim.name,
                    mishapVictimEnvObj: possibleHazard.mishapVictimEnvObj.object.name,
                    exposure: possibleHazard.exposure.object.name,
                    hazardElement: possibleHazard.hazardElement.object.name,
                    hazardElementEventObj: hazardElEnvObj ? hazardElEnvObj.object.name : '-',
                    harmTruthmaker: hazard.harmTruthmaker,
                    description: hazard.description
                }
            }))
        .flat()
        .sort((a, b) => a.id.localeCompare(b.id));

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
                    {hazards.length === 0 ?
                        <TableRow>
                            <TableCell colSpan={7} align='center'>
                                No hazards identified
                            </TableCell>
                        </TableRow>
                        :
                        hazards.map((hazard, index) => (
                            <TableRow key={index}>
                                <TableCell>{hazard.id}</TableCell>
                                <TableCell>
                                    {hazard.mishapVictim}
                                    <br />
                                    ({hazard.mishapVictimEnvObj})
                                </TableCell>
                                <TableCell>{hazard.exposure}</TableCell>
                                <TableCell>
                                    {hazard.hazardElement}
                                    <br />
                                    ({hazard.hazardElementEventObj})
                                 </TableCell>
                                <TableCell>{hazard.harmTruthmaker}</TableCell>
                                <TableCell>{hazard.description}</TableCell>
                                <TableCell>
                                    <IconButton size='small' onClick={() => props.hazardDeleted(hazard.id)}>
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
