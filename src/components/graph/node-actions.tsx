import React from 'react';
import { makeStyles } from '@material-ui/core';

interface Props {
    placement: 'top' | 'bottom';
}

const useStyles = makeStyles(() => ({
    base: {
        position: 'relative',
        left: '-5px'
    },
    top: {
        top: '-5px'
    },
    bottom: {
        top: '5px'
    }
}));

const NodeActions: React.FC<Props> = (props) => {
    const classes = useStyles();

    return (
        <div className={`${classes.base} ${classes[props.placement]}`}>
            {props.children}
        </div>
    );
};

export default NodeActions;
