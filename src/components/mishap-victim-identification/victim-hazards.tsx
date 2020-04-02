import React from 'react';
import { makeStyles, Card, CardContent, Typography, ListItem, ListItemText, ListItemSecondaryAction, IconButton, TextField, List } from '@material-ui/core';

import { Delete, Add } from '@material-ui/icons';
import Role from '../../entities/system-description/role';

interface Props {
    selectedRole: Role | undefined;
    possibleHarmsUpdated: (role: Role) => void;
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

    const createMishapVictim = (ev: React.FormEvent<HTMLFormElement>, role: Role) => {
        const form = ev.currentTarget;
        const harm = (form.elements.namedItem("harm") as HTMLInputElement).value;
        form.reset();
        ev.preventDefault();

        const updatedHarms = role.possibleHarms.concat(harm);
        props.possibleHarmsUpdated({ ...role, ...{ possibleHarms: updatedHarms } });
    };

    const deletePossibleHarm = (role: Role, harm: string) => {
        const updatedHarms = role.possibleHarms.filter(e => e !== harm);
        props.possibleHarmsUpdated({ ...role, ...{ possibleHarms: updatedHarms } });
    };

    const emptyContent = (
        <CardContent>
            <Typography>
                Click on a role to see or add possible harms
            </Typography>
        </CardContent>);

    const renderHarms = (role: Role) => {
        return role.possibleHarms
            .sort((a, b) => a.localeCompare(b))
            .map((harm, index) => renderHarmItem(harm, index, role))
            .concat(renderAddItem(role));
    };

    const renderHarmItem = (item: string, index: number, role: Role) => (
        <ListItem key={index}>
            <ListItemText primary={item} />
            <ListItemSecondaryAction>
                <IconButton edge="end" title="Delete" onClick={() => deletePossibleHarm(role, item)}>
                    <Delete />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );

    const renderAddItem = (role: Role) => (
        <ListItem key="-1">
            <form action='#' onSubmit={(ev) => createMishapVictim(ev, role)}>
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
                    {renderHarms(props.selectedRole)}
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
