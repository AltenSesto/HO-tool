import React, { useState } from 'react';
import { List, ListItem, ListItemText, Chip, makeStyles, ListItemIcon, Divider, ListItemSecondaryAction, IconButton, Popover, Typography } from '@material-ui/core';
import { Help, HelpOutline } from '@material-ui/icons';
import FlowStep from '../../entities/meny/flow-step';
import { Flow, getStepIndex } from '../../entities/meny/flow';


const useStyles = makeStyles(theme => ({
    label: {
        paddingLeft: theme.spacing(1)
    },
    phase: {
        paddingLeft: theme.spacing(4)
    },
    step: {
        paddingLeft: theme.spacing(8)
    },
    bold: {
        fontWeight: 'bold'
    },
    typography: {
        padding: theme.spacing(2),
        maxWidth: '320px'
    }
}));

interface Props {
    currentStep: string;
    lastCompletedStep: string;
    movedForward: (step: string) => void;
    movedBack: (step: string) => void;
}

const ProgressSteps: React.FC<Props> = (props: Props) => {
    const classes = useStyles();

    const currentStepIndex = getStepIndex(props.currentStep);
    const lastCompletedStepIndex = getStepIndex(props.lastCompletedStep);

    const moveTo = (step: string) => {
        const stepIndex = getStepIndex(step);
        if (stepIndex > currentStepIndex) {
            props.movedForward(step);
        } else if (stepIndex < currentStepIndex) {
            props.movedBack(step);
        }
    };

    const [popoverAnchor, setPopoverAnchor] = useState(null);
    const [popoverContent, setPopoverContent] = useState('');
    const openPopover = (event: any, content: string | undefined) => {
        setPopoverContent(content ? content : '');
        setPopoverAnchor(event.currentTarget);
    };

    const closePopover = () => {
        setPopoverAnchor(null);
    };

    const isPopoverOpen = Boolean(popoverAnchor);
    
    const renderSteps = (steps: FlowStep[]) => (
        <List disablePadding dense>
            {steps.map(step => {
                const stepIndex = getStepIndex(step.id);
                const isCurrent = stepIndex === currentStepIndex;
                const isActive = stepIndex <= lastCompletedStepIndex + 1;

                return (
                    <ListItem className={classes.step} button key={step.id} disabled={!isActive} onClick={() => moveTo(step.id)} >
                        <ListItemIcon>
                            <Chip size="small" disabled={!isActive} label={step.id} color={isCurrent ? 'secondary' : 'primary'} />
                        </ListItemIcon>
                        <ListItemText primary={step.label} className={classes.label} />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={(ev) => openPopover(ev, step.helpText)}>
                                {isCurrent ? <Help /> : <HelpOutline />}
                            </IconButton>
                            <Popover
                                open={isPopoverOpen}
                                anchorEl={popoverAnchor}
                                onClose={closePopover}
                                anchorOrigin={{
                                    vertical: 'center',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'center',
                                    horizontal: 'left',
                                }}
                            >
                                <Typography variant='body2' className={classes.typography} dangerouslySetInnerHTML={{__html: popoverContent}}></Typography>
                            </Popover>
                        </ListItemSecondaryAction>
                    </ListItem>
                );
            })}
        </List>
    );

    const renderPhases = (phases: FlowStep[]) => (
        <List disablePadding dense>
            {phases.map(phase => {
                const steps = phase.children ? renderSteps(phase.children) : '';
                return (
                    <React.Fragment key={phase.id}>
                        <ListItem className={classes.phase} >
                            <ListItemIcon>
                                <Chip label={phase.id} size='small' variant='outlined' color='primary' />
                            </ListItemIcon>
                            <ListItemText primary={phase.label} className={classes.label} />
                        </ListItem>
                        {steps}
                    </React.Fragment>
                );
            })}
        </List>
    );

    return (
        <List dense>
            {Flow.map(stage => (
                <React.Fragment key={stage.id}>
                    <ListItem>
                        <ListItemIcon>
                            <Chip label={stage.id} variant='outlined' color='primary' />
                        </ListItemIcon>
                        <ListItemText primary={stage.label} disableTypography className={`${classes.label} ${classes.bold}`} />
                    </ListItem>
                    {renderPhases(stage.children)}
                    <Divider />
                </React.Fragment>
            ))}
        </List>
    );
};

export default ProgressSteps;
