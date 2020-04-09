import React, { useState } from 'react';
import { TextField, IconButton, makeStyles, TableRow, TableCell, TableContainer, Table, TableHead, TableBody, Select, MenuItem, InputLabel, FormControl } from '@material-ui/core';
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
    },
    select: {
        width: '220px'
    }
}));

const HazardCreate: React.FC<Props> = (props) => {
    const classes = useStyle();

    const [template, setTemplate] = useState<PossibleHazard | null>(null);

    const createHazard = (ev: React.FormEvent<HTMLFormElement>) => {
        const form = ev.currentTarget;
        form.reset();
        ev.preventDefault();
        if (!template) {
            return;
        }

        const harmTruthmaker = (form.elements.namedItem('truthmaker') as HTMLInputElement).value;
        const description = (form.elements.namedItem('description') as HTMLInputElement).value;
        const hazardElementEnvObj = (form.elements.namedItem('env-obj') as HTMLSelectElement).value;
        if (!hazardElementEnvObj) {
            return;
        }

        const hazard = {
            id: createObjectId('hazard'),
            harmTruthmaker,
            description,
            mishapVictim: template.mishapVictim.id,
            mishapVictimEnvObjConn: template.mishapVictimEnvObj.connection.id,
            exposureConn: template.exposure.connection.id,
            hazardElementConn: template.hazardElement.connection.id,
            hazardElementEnvObjConn: hazardElementEnvObj
        };
        props.hazardCreated(hazard);
    };

    const renderDetailsForm = (possibleHazard: PossibleHazard) => {
        if (template !== possibleHazard) {
            return <React.Fragment></React.Fragment>;
        }

        let hazardElementEnvObj = '';
        if (template.hazardElementEnvObjs.length === 1) {
            hazardElementEnvObj = template.hazardElementEnvObjs[0].connection.id;
        }
        let selectOptions = template.hazardElementEnvObjs
            .sort((a, b) => a.object.name.localeCompare(b.object.name))
            .map((item, index) => (
                <MenuItem key={index} value={item.connection.id}>
                    {item.object.name}
                </MenuItem>));
        if (template.hazardElementEnvObjs.length === 0) {
            selectOptions = [(<MenuItem key={-1} value='' disabled>Nothing found</MenuItem>)];
        }

        return (
            <TableRow>
                <TableCell colSpan={3}>
                    <form action='#' onSubmit={createHazard}>
                        <FormControl className={classes.divide}>
                            <TextField
                                required
                                autoFocus
                                margin='none'
                                type='text'
                                name='truthmaker'
                                label='Harm Truthmaker'
                                autoComplete='off'
                                multiline
                                rowsMax={4}
                            />
                        </FormControl>
                        <FormControl className={classes.divide}>
                            <TextField
                                required
                                margin='none'
                                type='text'
                                name='description'
                                label='Hazard Description'
                                autoComplete='off'
                                multiline
                                rowsMax={4}
                            />
                        </FormControl>
                        <FormControl className={classes.select}>
                            <InputLabel id='label-select-env-obj'>
                                Hazard Evement Env Obj
                            </InputLabel>
                            <Select
                                required
                                margin='none'
                                labelId='label-select-env-obj'
                                defaultValue={hazardElementEnvObj}
                                name='env-obj'
                            >
                                {selectOptions}
                            </Select>
                        </FormControl>
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
