import React from 'react';
import { List, ListItem, ListItemText, Chip, makeStyles, ListItemIcon, Divider } from '@material-ui/core';

const stages = [
    {
        id: 'OHI', name: 'Identify Hazards', steps: [
            { id: 'OHI1', name: 'Modelling' },
            { id: 'OHI2', name: 'Identify Victims' },
            { id: 'OHI3', name: 'Identify Hazards' },
        ]
    },
    {
        id: 'OCH', name: 'Identify Causes', steps: [
            { id: 'OCH1', name: 'Categorize' },
            { id: 'OCH2', name: 'Expand' },
            { id: 'OCH3', name: 'Identify Causes' },
        ]
    },
    {
        id: 'SARE', name: 'Safety Requirements', steps: [
            { id: 'SARE1', name: 'Evaluate Severity' },
            { id: 'SARE2', name: 'Evaluate Probability' },
            { id: 'SARE3', name: 'Safety Requirements' },
        ]
    },
    { id: '4', name: 'Control Mitigation', steps: [] }
];

const useStyles = makeStyles(theme => ({
    label: {
        paddingLeft: theme.spacing(1)
    },
}));

const ProgressSteps: React.FC = () => {
    const classes = useStyles();

    return (
        <List dense>
            {stages.map(stage => (
                <React.Fragment key={stage.id}>
                    <ListItem>
                        <ListItemIcon>
                            <Chip label={stage.id} variant="outlined" color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={stage.name} className={classes.label} />
                    </ListItem>
                    <List disablePadding dense>
                        {stage.steps.map(step => {
                            const isCurrent = step.id === 'OHI1';
                            const isNext = step.id === 'OHI2';
                            const isActive = isCurrent || isNext;
                            return (
                                <ListItem button key={step.id} disabled={!isActive} >
                                    <ListItemIcon>
                                        <Chip size="small" disabled={!isActive} label={step.id} color={isCurrent ? 'secondary' : 'primary'} />
                                    </ListItemIcon>
                                    <ListItemText primary={step.name} className={classes.label} />
                                </ListItem>
                            );
                        })}
                    </List>
                    <Divider />
                </React.Fragment>
            ))}
        </List>
    );
};

export default ProgressSteps;
