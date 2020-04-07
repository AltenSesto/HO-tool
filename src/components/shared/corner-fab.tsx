import React from 'react';
import { makeStyles, Fab } from '@material-ui/core';

interface Props {
    onClick: () => void;
}

const useStyles = makeStyles(theme => ({
    fab: {
        position: 'fixed',
        marginBottom: theme.spacing(2),
        marginLeft: theme.spacing(2),
        bottom: 0,
        zIndex: 110,
    }
}));

const CornerFab: React.FC<Props> = (props) => {
    const classes = useStyles();

    return (
        <Fab variant='extended'
            className={classes.fab}
            size='medium'
            onClick={props.onClick}
        >
            {props.children}
        </Fab>
    );
};

export default CornerFab;
