import React from 'react';
import { Hazard } from '../../entities/hazard-population/hazard';
import { TableRow, TableCell } from '@material-ui/core';

interface Props {
    hazard: Hazard;
    hazardUpdated: (hazard: Hazard) => void;
}

const HazardRow: React.FC<Props> = (props) => {
    return (
        <TableRow>
            <TableCell>{props.hazard.details.id}</TableCell>
            <TableCell>{props.hazard.details.harmTruthmaker}</TableCell>
            <TableCell>{props.hazard.details.description}</TableCell>
            <TableCell>Hazard Element Env Obj</TableCell>
        </TableRow>
        );
};

export default HazardRow;
