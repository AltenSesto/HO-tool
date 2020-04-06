import React from 'react';
import { TableRow, TableCell, IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { Hazard } from '../../entities/hazard-population/hazard';

interface Props {
    hazard: Hazard;
    hazardUpdated: (hazard: Hazard) => void;
    hazardDeleted: (hazard: Hazard) => void;
}

const HazardRow: React.FC<Props> = (props) => {
    return (
        <TableRow>
            <TableCell>{props.hazard.details.id}</TableCell>
            <TableCell>{props.hazard.details.harmTruthmaker}</TableCell>
            <TableCell>{props.hazard.details.description}</TableCell>
            <TableCell>---</TableCell>
            <TableCell>
                <IconButton
                    size='small'
                    title='Delete'
                    onClick={() => props.hazardDeleted(props.hazard)}
                >
                    <Delete />
                </IconButton>
            </TableCell>
        </TableRow>
        );
};

export default HazardRow;
