import React from 'react';
import { makeStyles, Fab } from '@material-ui/core';

interface Props {
    separated?: boolean;
    onClick: () => void;
}

const useStyles = makeStyles(theme => ({
    fab: {
        position: 'fixed',
        marginBottom: theme.spacing(2),
        marginLeft: theme.spacing(2),
        bottom: 0,
        zIndex: theme.zIndex.graphAction,
    },
    fabSpace: {
        height: theme.spacing(3) + 40
    }
}));

const CornerFab: React.FC<Props> = (props) => {
    const classes = useStyles();

    return (
        <React.Fragment>
            {
                props.separated ? 
                    <div className={classes.fabSpace} />
                    :
                    undefined
            }
            <Fab variant='extended'
                className={classes.fab}
                size='medium'
                onClick={props.onClick}>
                props.children
            </Fab>
        </React.Fragment>
    );
};

export default CornerFab;
