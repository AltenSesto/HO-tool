import React from 'react';
import { TableRow, TableCell, TableContainer, Table, TableBody, TableHead, withStyles, Theme, createStyles } from '@material-ui/core';
import { PossibleHazard } from '../../entities/hazard-population/possible-hazard';
import Hazard from '../../entities/hazard-population/hazard';
import HazardCreate from './hazard-create';
import HazardRow from './hazard-row';

interface Props {
    hazardTemplate: PossibleHazard;
    hazards: Hazard[];
    hazardCreated: (hazard: Hazard) => void;
    hazardDeleted: (hazard: Hazard) => void;
}

const OuterTableCell = withStyles((theme: Theme) =>
    createStyles({
        body: {
            backgroundColor: theme.palette.grey[100]
        }
    })
)(TableCell);

const VictimHazardsRow: React.FC<Props> = (props) => {

    const newHazardForm = (
        <TableRow key={'new_hazard'}>
            <TableCell>Add Hazard</TableCell>
            <TableCell colSpan={4}>
                <HazardCreate
                    template={props.hazardTemplate}
                    hazardCreated={props.hazardCreated}
                />
            </TableCell>
        </TableRow>
    );

    const hazardRows = props.hazards.map(hazard => (
        <HazardRow
            hazard={hazard}
            hazardUpdated={() => { }}
            hazardDeleted={props.hazardDeleted}
            key={hazard.id}
        />
    )).concat(newHazardForm);

    return (
        <React.Fragment>
            <TableRow>
                <OuterTableCell>{props.hazardTemplate.mishapVictimEnvObj.object.name}</OuterTableCell>
                <OuterTableCell>{props.hazardTemplate.exposure.object.name}</OuterTableCell>
                <OuterTableCell>{props.hazardTemplate.hazardElement.object.name}</OuterTableCell>
            </TableRow>
            <TableRow>
                <TableCell />
                <TableCell colSpan={2}>
                    <TableContainer>
                        <Table size='small'>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Hazard ID</TableCell>
                                    <TableCell>Harm TruthMaker </TableCell>
                                    <TableCell>Hazard Description</TableCell>
                                    <TableCell>Hazard Element Env Obj</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {hazardRows}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
};

export default VictimHazardsRow;
