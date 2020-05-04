import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Typography, ListItem, ListItemText, ListItemSecondaryAction, IconButton, TextField, List } from '@material-ui/core';

import { Delete, Add } from '@material-ui/icons';
import Role from '../../entities/system-description/role';
import CornerCard from '../shared/corner-card';
import { addPossibleHarm, removePossibleHarm } from '../../store/system-model/actions';

const mapDispatch = {
    harmAdded: addPossibleHarm,
    harmDeleted: removePossibleHarm
};

const connector = connect(null, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    selectedRole: Role | undefined;
};

const VictimHarms: React.FC<Props> = (props: Props) => {

    const createMishapVictim = (ev: React.FormEvent<HTMLFormElement>, role: Role) => {
        const form = ev.currentTarget;
        const harm = (form.elements.namedItem("harm") as HTMLInputElement).value;
        form.reset();
        ev.preventDefault();
        props.harmAdded(role.id, harm);
    };

    const deletePossibleHarm = (role: Role, harm: string) => {
        props.harmDeleted(role.id, harm);
    };

    const emptyContent = (
            <Typography>
                Click on a role to see or add possible harms
            </Typography>
        );

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
            <React.Fragment>
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
            </React.Fragment>
        );
    };

    return (
        <CornerCard>
            {renderContent()}
        </CornerCard>
    );
};

export default connector(VictimHarms);
