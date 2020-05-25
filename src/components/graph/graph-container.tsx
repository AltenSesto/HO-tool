import React from 'react';
import { makeStyles } from '@material-ui/core';

interface Props {
    size?: (height: number, width: number) => void;
}

const useStyle = makeStyles(theme => ({
    root: {
        position: 'fixed',
        overflow: 'auto',
        top: theme.mixins.toolbar.minHeight,
        right: 0,
        bottom: 0,
        left: theme.appSpacing.drawerWidth
    }
}));

const GraphContainer: React.FC<Props> = (props) => {
    const classes = useStyle();

    const extractSize = (ref: HTMLDivElement | null) => {
        if (ref && props.size) {
            props.size(ref.clientHeight, ref.clientWidth);
        }
    };

    return (
        <div className={classes.root} ref={extractSize}>
            {props.children}
        </div>
    );
};

export default GraphContainer;
