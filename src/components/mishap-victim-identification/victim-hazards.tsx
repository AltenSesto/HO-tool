import React from 'react';
import { makeStyles, Card, CardContent, Typography, ListItem, ListItemText, ListItemSecondaryAction, IconButton, TextField, List } from '@material-ui/core';

import SystemObject from '../../entities/system-description/system-object';
import PossibleHarm from '../../entities/mishap-victim-identification/possible-harm';
import { Delete, Add } from '@material-ui/icons';

interface Props {
    selectedRole: SystemObject | null;
    possibleHarms: PossibleHarm[];
    possibleHarmsUpdated: (items: PossibleHarm[]) => void;
};

const useStyles = makeStyles(theme => ({
    root: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(1),
        zIndex: 110,
        minWidth: 200,
    }
}));

const VictimHazards: React.FC<Props> = (props: Props) => {
    const classes = useStyles();

    const createMishapVictim = (ev: React.FormEvent<HTMLFormElement>) => {
        const form = ev.currentTarget;
        const harm = (form.elements.namedItem("harm") as HTMLInputElement).value;
        form.reset();
        ev.preventDefault();

        if (props.selectedRole) {
            const mishapVictim = {
                id: `mishap-victim-${new Date().getTime()}`,
                roleId: props.selectedRole.id,
                harm: harm
            };
            props.possibleHarmsUpdated(props.possibleHarms.concat(mishapVictim));
        }
    };

    const deletePossibleHarm = (item: PossibleHarm) => {
        props.possibleHarmsUpdated(props.possibleHarms.filter(e => e !== item));
    };

    const emptyContent = (
        <CardContent>
            <Typography>
                Click on a role to see or add possible harms
            </Typography>
        </CardContent>);

    const renderHarms = () => {
        return props.possibleHarms
            .filter(e => props.selectedRole && e.roleId === props.selectedRole.id)
            .sort((a, b) => a.harm.localeCompare(b.harm))
            .map(e => renderHarmItem(e))
            .concat(renderAddItem());
    };

    const renderHarmItem = (item: PossibleHarm) => (
        <ListItem key={item.id}>
            <ListItemText primary={item.harm} />
            <ListItemSecondaryAction>
                <IconButton edge="end" title="Delete" onClick={() => deletePossibleHarm(item)}>
                    <Delete />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );

    const renderAddItem = () => (
        <ListItem key="-1">
            <form action='#' onSubmit={createMishapVictim}>
                <TextField
                    required
                    autoFocus
                    margin="dense"
                    type="text"
                    name="harm"
                    fullWidth
                    placeholder="Add New"
                    autoComplete="off"
                />
                <ListItemSecondaryAction>
                    <IconButton type="submit" edge="end" title="Add">
                        <Add />
                    </IconButton>
                </ListItemSecondaryAction>
            </form>
        </ListItem>
    );

    const renderContent = () => {
        if (!props.selectedRole) {
            return emptyContent;
        }
        return (
            <CardContent>
                <Typography variant="body2" color="textSecondary">
                    Mishap Victim
                </Typography>
                <Typography variant="h6" gutterBottom>
                    {props.selectedRole.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Possible Harms
                </Typography>
                <List dense>
                    {renderHarms()}
                </List>
            </CardContent>
        );
    };

    return (
        <Card className={classes.root}>
            {renderContent()}
        </Card>
    );
};

export default VictimHazards;
