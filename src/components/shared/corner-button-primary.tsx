import React from 'react';
import { makeStyles, Button } from '@material-ui/core';

interface Props {
    onClick: () => void;
    disabled?: boolean;
}

const useStyles = makeStyles(theme => ({
    button: {
        marginLeft: theme.appSpacing.standard,
        marginTop: theme.appSpacing.standard
    },
}));

const CornerButtonPrimary: React.FC<Props> = (props) => {
    const classes = useStyles();

    return (
        <Button
            className={classes.button}
            variant='contained'
            color='primary'
            onClick={props.onClick}
            disabled={props.disabled}
        >
            {props.children}
        </Button>
    );
};

export default CornerButtonPrimary;
