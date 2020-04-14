import React, { useState } from 'react';
import { MenuItem, TableRow, TableCell, FormControl, Select, InputLabel, TextField, IconButton, makeStyles } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { PossibleHazard } from '../../entities/hazard-population/possible-hazard';
import Hazard from '../../entities/hazard-population/hazard';

interface Props {
    template: PossibleHazard;
    nextHazardId: number;
    hazardCreated: (hazard: Hazard) => void;
}

const useStyle = makeStyles((theme) => ({
    divide: {
        paddingRight: theme.spacing(2)
    },
    select: {
        width: '220px'
    }
}));

const HazardCreateDetails: React.FC<Props> = (props) => {
    const classes = useStyle();

    let hazardElementEnvObj = '';
    if (props.template.hazardElementEnvObjs.length === 1) {
        hazardElementEnvObj = props.template.hazardElementEnvObjs[0].object.id;
    }
    const [envObj, setEnvObj] = useState(hazardElementEnvObj);
    const [harmTruthmaker, setHarmTruthmaker] = useState('');
    const [description, setDescription] = useState('');

    const createHazard = (ev: React.FormEvent<HTMLFormElement>) => {
        const form = ev.currentTarget;
        form.reset();
        ev.preventDefault();
        const hazardElementEnvObj = props.template.hazardElementEnvObjs
            .find(e => e.object.id === envObj);
        if (!hazardElementEnvObj) {
            return;
        }

        const hazard = {
            id: `H${props.nextHazardId}`,
            harmTruthmaker,
            description,
            mishapVictim: {
                id: props.template.mishapVictim.id,
                name: props.template.mishapVictim.name
            },
            mishapVictimEnvObj: {
                id: props.template.mishapVictimEnvObj.object.id,
                name: props.template.mishapVictimEnvObj.object.name
            },
            exposure: {
                id: props.template.exposure.object.id,
                name: props.template.exposure.object.name
            },
            hazardElement: {
                id: props.template.hazardElement.object.id,
                name: props.template.hazardElement.object.name
            },
            hazardElementEnvObj: {
                id: hazardElementEnvObj.object.id,
                name: hazardElementEnvObj.object.name
            }
        };
        props.hazardCreated(hazard);
    };

    let selectOptions = props.template.hazardElementEnvObjs
        .sort((a, b) => a.object.name.localeCompare(b.object.name))
        .map((item, index) => (
            <MenuItem key={index} value={item.object.id}>
                {item.object.name}
            </MenuItem>));
    if (props.template.hazardElementEnvObjs.length === 0) {
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
                            onChange={(ev) => setHarmTruthmaker(ev.target.value)}
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
                            onChange={(ev) => setDescription(ev.target.value)}
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
                            value={hazardElementEnvObj}
                            onChange={(ev) => setEnvObj(ev.target.value as string)}
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
};

export default HazardCreateDetails;
