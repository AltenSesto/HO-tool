import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { List, ListItem, ListItemText, Chip, makeStyles, ListItemIcon, Divider, ListItemSecondaryAction } from '@material-ui/core';
import { FlowStep, FlowStepId } from '../../entities/meny/flow-step';
import { flow, OUT_OF_FLOW } from '../../entities/meny/flow';
import HelpText from './help-text';
import { RootState } from '../../store';
import { updateFlowStep } from '../../store/system-model/actions';

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

const mapState = (state: RootState) => ({
    currentStep: state.systemModel.currentStep,
    lastCompletedStep: state.systemModel.lastCompletedStep
})

const mapDispatch = {
    setCurentStep: (step: FlowStepId) => updateFlowStep(step)
}

const connector = connect(mapState, mapDispatch);

type Props = ConnectedProps<typeof connector>

const ProgressSteps: React.FC<Props> = (props: Props) => {
    const classes = useStyles();

    const renderSteps = (steps: FlowStep[], paddingClass: string) => (
        <List disablePadding dense>
            {steps.map((step: FlowStep) => {
                const isInFlow = step.id.order !== OUT_OF_FLOW;
                const isCurrent = isInFlow && step.id.order === props.currentStep.order;
                const isEnabled = !isInFlow || step.id.order <= props.lastCompletedStep.order + 1;
                const helpOpenedOnFirstVisit = step.id === props.currentStep &&
                    step.id === props.lastCompletedStep;

                return (
                    <React.Fragment key={step.id.name}>
                        <ListItem
                            className={paddingClass}
                            button
                            disabled={!isEnabled}
                            onClick={() => isInFlow && props.setCurentStep(step.id)}
                        >
                            <ListItemIcon>
                                <Chip
                                    size="small"
                                    disabled={!isEnabled}
                                    label={step.id.name}
                                    color={isCurrent ? 'secondary' : 'primary'}
                                    variant={isInFlow ? 'default' : 'outlined'}
                                />
                            </ListItemIcon>
                            <ListItemText primary={step.label} className={classes.label} />
                            {step.helpText ? (
                                <ListItemSecondaryAction>
                                    <HelpText
                                        open={helpOpenedOnFirstVisit}
                                        highlighted={isCurrent}
                                        htmlContent={step.helpText}
                                    />
                                </ListItemSecondaryAction>)
                                : ''
                            }
                        </ListItem>
                        {step.children ? renderSteps(step.children, classes.step) : ''}
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
                    {renderSteps(stage.children, classes.phase)}
                    <Divider />
                </React.Fragment>
            ))}
        </List>
    );
};

export default connector(ProgressSteps);
