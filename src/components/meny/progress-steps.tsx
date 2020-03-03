import React from 'react';
import Stepper from '@material-ui/core/Stepper';
import { Step, StepLabel, Tabs, Tab, Grid } from '@material-ui/core';

const stages = [
    { id: 'OHI', name: 'Identify Hazards' },
    { id: 'OCH', name: 'Identify Causes' },
    { id: 'SARE', name: 'Safety Requirements' },
    { id: '4', name: 'Control Mitigation' }
];


const ProgressSteps: React.FC = () => {

    return (
        <Grid container>
            <Grid item xs={12}>
                <Stepper activeStep={0}>
                    {stages.map((stage) => {
                        return (
                            <Step key={stage.id}>
                                <StepLabel >
                                    {stage.name}
                                </StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
            </Grid>
            <Grid item xs={12}>
                <Tabs value={0}>
                    <Tab label="System Description Formalization" />
                    <Tab label="Mishap Victim Identification" />
                    <Tab label="Hazard Population" />
                </Tabs>
            </Grid>
        </Grid>
    );
};

export default ProgressSteps;
