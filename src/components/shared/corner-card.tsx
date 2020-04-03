import React from 'react';
import { Card, makeStyles, CardContent } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(1),
        zIndex: 110,
        minWidth: 200,
    }
}));

const CornerCard: React.FC = (props) => {
    const classes = useStyles();
    return (
        <Card className={classes.root}>
            <CardContent>
                {props.children}
            </CardContent>
        </Card>
    );
}

export default CornerCard;
