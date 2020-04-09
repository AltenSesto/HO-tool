import React, { useState } from 'react';
import { TextField, IconButton, makeStyles, TableRow, TableCell, TableContainer, Table, TableHead, TableBody } from '@material-ui/core';
import { Add } from '@material-ui/icons';

import { PossibleHazard } from '../../entities/hazard-population/possible-hazard';
import Hazard from '../../entities/hazard-population/hazard';
import { createObjectId } from '../../entities/system-model';

interface Props {
    possibleHazards: PossibleHazard[];
    hazardCreated: (item: Hazard) => void;
}

const useStyle = makeStyles((theme) => ({
    divide: {
        paddingRight: theme.spacing(2)
    },
    selectable: {
        cursor: 'pointer'
    }
}));

const HazardCreate: React.FC<Props> = (props) => {
    const classes = useStyle();

    const [template, setTemplate] = useState<PossibleHazard | null>(null);

    const createHazard = (ev: React.FormEvent<HTMLFormElement>) => {
        if (!template) {
            return;
        }

        const form = ev.currentTarget;
        const harmTruthmaker = (form.elements.namedItem('truthmaker') as HTMLInputElement).value;
        const description = (form.elements.namedItem('description') as HTMLInputElement).value;
        form.reset();
        ev.preventDefault();

        const hazard = {
            id: createObjectId('hazard'),
            harmTruthmaker,
            description,
            mishapVictim: template.mishapVictim.id,
            mishapVictimEnvObjConn: template.mishapVictimEnvObj.connection.id,
            exposureConn: template.exposure.connection.id,
            hazardElementConn: template.hazardElement.connection.id,
            hazardElementEnvObjConn: ''
        };
        props.hazardCreated(hazard);
    };

    const renderDetailsForm = (possibleHazard: PossibleHazard) => {
        if (template !== possibleHazard) {
            return <React.Fragment></React.Fragment>;
        }

        return (
            <TableRow>
                <TableCell>
                    <form action='#' onSubmit={createHazard}>
                        <TextField
                            className={classes.divide}
                            required
                            autoFocus
                            margin='dense'
                            type='text'
                            name='truthmaker'
                            label='Harm Truthmaker'
                            autoComplete='off'
                            multiline
                            rowsMax={4}
                        />
                        <TextField
                            required
                            margin='dense'
                            type='text'
                            name='description'
                            label='Hazard Description'
                            autoComplete='off'
                            multiline
                            rowsMax={4}
                        />
                        <IconButton type='submit' edge='end' title='Create'>
                            <Add />
                        </IconButton>
                    </form>
                </TableCell>
            </TableRow>
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
                                <TableRow
                                    onClick={() => setTemplate(hazard)}
                                    className={classes.selectable}
                                >
                                    <TableCell>
                                        {hazard.mishapVictim.name} ({hazard.mishapVictimEnvObj.object.name})
                                        </TableCell>
                                    <TableCell>
                                        {hazard.exposure.object.name}
                                    </TableCell>
                                    <TableCell>
                                        {hazard.hazardElement.object.name}
                                    </TableCell>
                                </TableRow>
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
