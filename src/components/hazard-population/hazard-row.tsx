import React from 'react';
import { TableRow, TableCell, IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import Hazard from '../../entities/hazard-population/hazard';

interface Props {
    hazard: Hazard;
    hazardUpdated: (hazard: Hazard) => void;
    hazardDeleted: (hazard: Hazard) => void;
}

const HazardRow: React.FC<Props> = (props) => {
    return (
        <TableRow>
            <TableCell>{props.hazard.id}</TableCell>
            <TableCell>{props.hazard.harmTruthmaker}</TableCell>
            <TableCell>{props.hazard.description}</TableCell>
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
