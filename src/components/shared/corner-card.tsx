import React from 'react';
import { Card, makeStyles, CardContent } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        position: 'fixed',
        bottom: theme.appSpacing.standard,
        right: theme.appSpacing.standard,
        zIndex: theme.zIndex.graphHelp,
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
