import React, { useState } from 'react';
import { Typography, IconButton, TextField, makeStyles } from '@material-ui/core';
import { Edit, Done, Clear } from '@material-ui/icons';

interface Props {
    name: string;
    nameUpdated: (name: string) => void;
}

const useStyle = makeStyles(theme => ({
    input: {
        color: theme.palette.common.white,
        paddingRight: theme.spacing(1)
    }
}));

const ProjectName: React.FC<Props> = (props) => {
    const classes = useStyle();

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(props.name);

    const cancelEdit = () => {
        setName(props.name);
        setIsEditing(false);
    };

    const confirmEdit = (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        setIsEditing(false);
        props.nameUpdated(name);
    };

    if (isEditing) {
        return (
            <form onReset={cancelEdit} onSubmit={confirmEdit} >
                <TextField
                    className={classes.input}
                    type='text'
                    required
                    autoFocus
                    onChange={(ev) => setName(ev.target.value)}
                    value={name}
                />
                <IconButton type='submit' size='small' title='Ok'>
                    <Done />
                </IconButton>
                <IconButton type='reset' size='small' title='Cancel'>
                    <Clear />
                </IconButton>
            </form>
        );
    }

    return (
        <Typography variant="h6">
            {name}
            <IconButton
                size='small'
                onClick={() => setIsEditing(true)}
                title='Edit name'
            >
                <Edit />
            </IconButton>
        </Typography>
    );
};

export default ProjectName;
