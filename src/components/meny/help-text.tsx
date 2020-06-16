import React, { useState, useEffect } from 'react';
import { IconButton, Popover, Typography, makeStyles } from '@material-ui/core';
import { Help, HelpOutline } from '@material-ui/icons';

interface Props {
    open: boolean;
    highlighted?: boolean;
    htmlContent: string;
}

const useStyles = makeStyles(theme => ({
    typography: {
        padding: theme.appSpacing.standard,
        maxWidth: '320px'
    }
}));

const HelpText: React.FC<Props> = (props: Props) => {
    const classes = useStyles();

    const [popoverAnchor, setPopoverAnchor] = useState<Element | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => {
        setIsOpen(false);
    };

    // can be opened both from parent component and from itself
    useEffect(() => {
        setIsOpen(props.open);
    }, [props.open]);

    return (
        <React.Fragment>
            <IconButton ref={(ref) => setPopoverAnchor(ref)} edge="end" onClick={() => setIsOpen(true)}>
                {props.highlighted ? <Help /> : <HelpOutline />}
            </IconButton>
            <Popover
                open={isOpen}
                anchorEl={popoverAnchor}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'left',
                }}
            >
                <Typography variant='body2' className={classes.typography} dangerouslySetInnerHTML={{ __html: props.htmlContent }}></Typography>
            </Popover>
        </React.Fragment>
    );
};

export default HelpText;
