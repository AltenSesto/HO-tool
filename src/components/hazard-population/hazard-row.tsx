import React from 'react';
import { useState } from 'react';
import { TableRow, TextField, IconButton } from '@material-ui/core';
import { Delete, Edit, Save } from '@material-ui/icons';
import Hazard from '../../entities/hazard-population/hazard';
import HazardId from './hazard-id';
import TableCellSmall from '../shared/table-cell-small';

interface Props {
    hazard: Hazard;
    index: number;
    hazardEdited: (hazard: Hazard) => void;
    hazardDeleted: (hazard: Hazard) => void;
}

const HazardsRow: React.FC<Props> = (props) => {

    const [isEditable, setIsEditable] = useState(false);
    const [harmTruthmaker, setHarmTruthmaker] = useState(props.hazard.harmTruthmaker);
    const [description, setDescription] = useState(props.hazard.description);

    const editHazard = () => {
        if(harmTruthmaker !== props.hazard.harmTruthmaker ||
            description !== props.hazard.description) {
                const hazard = {
                    ...props.hazard,
                    harmTruthmaker: harmTruthmaker,
                    description: description
                };
        
                props.hazardEdited(hazard);
        }
        
        setIsEditable(false);
    };

    return ( 
        <TableRow key={props.index}>
            <TableCellSmall>
                <HazardId hazard={props.hazard} />
            </TableCellSmall>
            <TableCellSmall>
                {props.hazard.mishapVictim.name}
                <br />
                ({props.hazard.mishapVictimEnvObj.name})
            </TableCellSmall>
            <TableCellSmall>{props.hazard.exposure.name}</TableCellSmall>
            <TableCellSmall>
                {props.hazard.hazardElement.name}
                <br />
                ({props.hazard.hazardElementEnvObj.name})
            </TableCellSmall>
            <TableCellSmall>
                {isEditable
                ? <TextField
                required
                autoFocus
                defaultValue={props.hazard.harmTruthmaker}
                margin='none'
                type='text'
                onChange={(ev) => setHarmTruthmaker(ev.target.value)}
                autoComplete='off'
                />
                : props.hazard.harmTruthmaker}
            </TableCellSmall>
            <TableCellSmall>
                {isEditable
                ? <TextField
                required
                defaultValue={props.hazard.description}
                margin='none'
                fullWidth
                type='text'
                onChange={(ev) => setDescription(ev.target.value)}
                autoComplete='off'
                />
                : props.hazard.description}
            </TableCellSmall>
            <TableCellSmall>
                {isEditable 
                ? <IconButton size='small' onClick={() => editHazard()}><Save /></IconButton>
                : <IconButton size='small' onClick={() => setIsEditable(true)}><Edit /></IconButton>
                }
                <IconButton
                    size='small'
                    onClick={() => props.hazardDeleted(props.hazard)}
                >
                    <Delete />
                </IconButton>
            </TableCellSmall>
        </TableRow>
    );
};

export default HazardsRow;