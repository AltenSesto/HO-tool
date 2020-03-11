import React from 'react';
import { List, ListItem, ListItemText, Chip, makeStyles, ListItemIcon, Divider } from '@material-ui/core';
import FlowStep from '../../entities/meny/flow-step';
import { Flow } from '../../entities/meny/flow';


const useStyles = makeStyles(theme => ({
    label: {
        paddingLeft: theme.spacing(1)
    },
    phase: {
        paddingLeft: theme.spacing(4),
    },
    step: {
        paddingLeft: theme.spacing(8),
    },
    bold: {
        fontWeight: 'bold'
    }
}));

const ProgressSteps: React.FC = () => {
    const classes = useStyles();

    const renderSteps = (steps: FlowStep[]) => (
        <List disablePadding dense>
            {steps.map(step => {
                const isCurrent = step.id === 'SDF-1';
                const isNext = step.id === 'SDF-2';
                const isActive = isCurrent || isNext;

                return (
                    <ListItem className={classes.step} button key={step.id} disabled={!isActive} >
                        <ListItemIcon>
                            <Chip size="small" disabled={!isActive} label={step.id} color={isCurrent ? 'secondary' : 'primary'} />
                        </ListItemIcon>
                        <ListItemText primary={step.label} className={classes.label} />
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
