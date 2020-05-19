import React from 'react';
import { makeStyles, Fab } from '@material-ui/core';

interface ButtonDescription {
    icon: JSX.Element;
    text: string;
    action: () => void;
}

interface Props {
    buttons: ButtonDescription[];
}

const useStyles = makeStyles(theme => ({
    root: {
        position: 'fixed',
        bottom: 0,
        zIndex: theme.zIndex.graphAction
    },
    fab: {
        marginBottom: theme.spacing(1),
        marginLeft: theme.spacing(2),
        display: 'flex'
    }
}));

const ToolbarButtons: React.FC<Props> = (props) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            {props.buttons.map((e, index) => (
                <Fab
                    key={index}
                    className={classes.fab}
                    size='small'
                    color='primary'
                    variant='extended'
                    onClick={e.action}
                >
                    {e.icon}
                    {e.text}
                </Fab>
            ))}
        </div>
    );
};

export default ToolbarButtons;
