import React, { useState } from 'react';
import { TableRow, TableCell, TableContainer, Table, TableHead, TableBody, withStyles, createStyles, Theme } from '@material-ui/core';

import { PossibleHazard } from '../../entities/hazard-population/possible-hazard';
import Hazard from '../../entities/hazard-population/hazard';
import HazardCreateDetails from './hazard-create-details';

interface Props {
    possibleHazards: PossibleHazard[];
    nextHazardId: number;
    hazardCreated: (item: Hazard) => void;
}

const StyledTableRow = withStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: theme.palette.grey[200],
            cursor: 'pointer'
        }
    })
)(TableRow);

const HazardCreate: React.FC<Props> = (props) => {

    const [template, setTemplate] = useState<PossibleHazard | null>(null);

    const renderDetailsForm = (possibleHazard: PossibleHazard) => {
        if (template !== possibleHazard) {
            return <React.Fragment></React.Fragment>;
        }

        return (
            <HazardCreateDetails
                template={template}
                nextHazardId={props.nextHazardId}
                hazardCreated={props.hazardCreated}
            />
        );
    }

    return (
        <TableContainer>
            <Table size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell>Mishap Victim (Env Obj)</TableCell>
                        <TableCell>Exposure</TableCell>
                        <TableCell>Hazard Element</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.possibleHazards.length === 0 ?
                        <TableRow>
                            <TableCell colSpan={3} align='center'>
                                No possible hazards found
                            </TableCell>
                        </TableRow>
                        :
                        props.possibleHazards.map((hazard, index) => (
                            <React.Fragment key={index}>
                                <StyledTableRow onClick={() => setTemplate(hazard)} >
                                    <TableCell>
                                        {hazard.mishapVictim.name} ({hazard.mishapVictimEnvObj.object.name})
                                        </TableCell>
                                    <TableCell>
                                        {hazard.exposure.object.name}
                                    </TableCell>
                                    <TableCell>
                                        {hazard.hazardElement.object.name}
                                    </TableCell>
                                </StyledTableRow>
                                {renderDetailsForm(hazard)}
                            </React.Fragment>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default HazardCreate;
