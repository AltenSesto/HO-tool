import React from 'react';
import { TextField, IconButton, makeStyles } from '@material-ui/core';
import { Add } from '@material-ui/icons';

import { PossibleHazard } from '../../entities/hazard-population/possible-hazard';
import { Hazard } from '../../entities/hazard-population/hazard';
import { createObjectId } from '../../entities/system-model';

interface Props {
    template: PossibleHazard;
    hazardCreated: (item: Hazard) => void;
}

const useStyle = makeStyles((theme) => ({
    divide: {
        paddingRight: theme.spacing(2)
    }
}));

const HazardCreate: React.FC<Props> = (props) => {
    const classes = useStyle();

    const createHazard = (ev: React.FormEvent<HTMLFormElement>) => {
        const form = ev.currentTarget;
        const harmTruthmaker = (form.elements.namedItem('truthmaker') as HTMLInputElement).value;
        const description = (form.elements.namedItem('description') as HTMLInputElement).value;
        form.reset();
        ev.preventDefault();

        const hazardDetails = {
            id: createObjectId('hazard'), harmTruthmaker, description
        };
        props.hazardCreated({ ...props.template, ...{ details: hazardDetails } });
    };

    return (
        <form action='#' onSubmit={createHazard}>
            <TextField
                className={classes.divide}
                required
                autoFocus
                margin='dense'
                type='text'
                name='truthmaker'
                placeholder='Harm Truthmaker'
                autoComplete='off'
            />
            <TextField
                required
                margin='dense'
                type='text'
                name='description'
                placeholder='Hazard Description'
                autoComplete='off'
            />
            <IconButton type='submit' edge='end' title='Add'>
                <Add />
            </IconButton>
        </form>
    );
};

export default HazardCreate;
