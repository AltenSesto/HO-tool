import React from 'react';
import { useState } from 'react';
import { TableRow, TableCell, TextField, IconButton, withStyles, createStyles } from '@material-ui/core';
import { Delete, Edit, Save } from '@material-ui/icons';
import Hazard from '../../entities/hazard-population/hazard';
import HazardId from './hazard-id';

interface Props {
    hazard: Hazard;
    index: number;
    hazardEdited: (hazard: Hazard) => void;
    hazardDeleted: (id: number) => void;
}

const StyledTableCell = withStyles(theme =>
    createStyles({
        sizeSmall: {
            padding: theme.spacing(1)
        }
    })
)(TableCell);

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
            <StyledTableCell>
                <HazardId hazard={props.hazard} />
            </StyledTableCell>
            <StyledTableCell>
                {props.hazard.mishapVictim.name}
                <br />
                ({props.hazard.mishapVictimEnvObj.name})
            </StyledTableCell>
            <StyledTableCell>{props.hazard.exposure.name}</StyledTableCell>
            <StyledTableCell>
                {props.hazard.hazardElement.name}
                <br />
                ({props.hazard.hazardElementEnvObj.name})
            </StyledTableCell>
            <StyledTableCell>
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
            </StyledTableCell>
            <StyledTableCell>
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
            </StyledTableCell>
            <StyledTableCell>
                {isEditable 
                ? <IconButton size='small' onClick={() => editHazard()}><Save /></IconButton>
                : <IconButton size='small' onClick={() => setIsEditable(true)}><Edit /></IconButton>
                }
                <IconButton
                    size='small'
                    onClick={() => props.hazardDeleted(props.index)}
                >
                    <Delete />
                </IconButton>
            </StyledTableCell>
        </TableRow>
    );
};

export default HazardsRow;