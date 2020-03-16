import React from 'react';
import { List, ListItem, ListItemText, Chip, makeStyles, ListItemIcon, Divider, ListItemSecondaryAction } from '@material-ui/core';
import { FlowStep, FlowStepId } from '../../entities/meny/flow-step';
import { flow } from '../../entities/meny/flow';
import HelpText from './help-text';


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
    }
}));

interface Props {
    currentStep: FlowStepId;
    lastCompletedStep: FlowStepId;
    movedForward: (step: FlowStepId) => void;
    movedBack: (step: FlowStepId) => void;
}

const ProgressSteps: React.FC<Props> = (props: Props) => {
    const classes = useStyles();

    const moveTo = (step: FlowStepId) => {
        if (step.order > props.currentStep.order) {
            props.movedForward(step);
        } else if (step.order < props.currentStep.order) {
            props.movedBack(step);
        }
    };

    const renderSteps = (steps: FlowStep[]) => (
        <List disablePadding dense>
            {steps.map(step => {
                const isCurrent = step.id.order === props.currentStep.order;
                const isActive = step.id.order <= props.lastCompletedStep.order + 1;
                const helpText = step.helpText ? step.helpText : '';
                const helpOpenedOnFirstVisit = step.id === props.currentStep && step.id === props.lastCompletedStep;

                return (
                    <ListItem
                        className={classes.step}
                        button
                        key={step.id.name}
                        disabled={!isActive}
                        onClick={() => moveTo(step.id)}
                    >
                        <ListItemIcon>
                            <Chip
                                size="small"
                                disabled={!isActive}
                                label={step.id.name}
                                color={isCurrent ? 'secondary' : 'primary'}
                            />
                        </ListItemIcon>
                        <ListItemText primary={step.label} className={classes.label} />
                        <ListItemSecondaryAction>
                            <HelpText
                                open={helpOpenedOnFirstVisit}
                                highlighted={isCurrent}
                                htmlContent={helpText}
                            />
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
                    <React.Fragment key={phase.id.name}>
                        <ListItem className={classes.phase} >
                            <ListItemIcon>
                                <Chip
                                    label={phase.id.name}
                                    size='small'
                                    variant='outlined'
                                    color='primary'
                                />
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
            {flow.map(stage => (
                <React.Fragment key={stage.id.name}>
                    <ListItem>
                        <ListItemIcon>
                            <Chip label={stage.id.name} variant='outlined' color='primary' />
                        </ListItemIcon>
                        <ListItemText
                            primary={stage.label}
                            disableTypography
                            className={`${classes.label} ${classes.bold}`}
                        />
                    </ListItem>
                    {renderPhases(stage.children)}
                    <Divider />
                </React.Fragment>
            ))}
        </List>
    );
};

export default ProgressSteps;
