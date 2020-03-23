import React, { useState } from 'react';
import { useBeforeunload } from 'react-beforeunload';
import 'typeface-roboto';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Toolbar, AppBar, Grid, Drawer } from '@material-ui/core';

import SystemDescription from './components/system-description/system-description';
import ErrorBoundary from './components/error-boundary';
import { SystemModel } from './entities/system-model';
import Meny from './components/meny/meny';
import { SystemDescriptionEntity, isSystemObject, isConnection, isSubsystem } from './entities/system-description/system-description-entity';
import ProgressSteps from './components/meny/progress-steps';
import { getFirstStepId, getPhase, flowSteps } from './entities/meny/flow';
import { ObjectTypes } from './entities/system-description/object-types';
import SystemObject from './entities/system-description/system-object';
import Connection from './entities/system-description/connection';
import Subsystem from './entities/system-description/subsystem';
import MishapVictimIdentification from './components/mishap-victim-identification/mishap-victim-identification';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    drawerOpen: {
        width: drawerWidth,
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
    },
    appTitle: {
        textAlign: 'center'
    },
}));


const App: React.FC = () => {

    const [systemModel, setSystemModel] = useState<SystemModel>({
        currentStep: getFirstStepId(),
        lastCompletedStep: getFirstStepId(),
        kinds: [],
        roles: [],
        relators: [],
        systemObjectConnections: [],
        subsystems: [],
        mishapVictims: [],
    });
    const [hasUnsavedChanges, setHasUnsaveChanges] = useState(false);

    useBeforeunload((ev) => {
        if (hasUnsavedChanges) {
            ev.preventDefault();
        }
    });

    const openFile = (model: SystemModel) => {
        if (!hasUnsavedChanges || window.confirm('You have usaved thanges that will be lost. Continue?')) {
            setSystemModel(model);
            setHasUnsaveChanges(false);
        }
    };

    const saveFile = () => {
        setHasUnsaveChanges(false);
        return systemModel;
    };

    const updateSystemDescription = (entities: SystemDescriptionEntity[]) => {
        setSystemModel({
            ...systemModel, ...{
                kinds: entities.filter(e => isSystemObject(e) && e.type === ObjectTypes.kind) as SystemObject[],
                roles: entities.filter(e => isSystemObject(e) && e.type === ObjectTypes.role) as SystemObject[],
                relators: entities.filter(e => isSystemObject(e) && e.type === ObjectTypes.relator) as SystemObject[],
                systemObjectConnections: entities.filter(e => isConnection(e)) as Connection[],
                subsystems: entities.filter(e => isSubsystem(e)) as Subsystem[]
            }
        });
        setHasUnsaveChanges(true);
    };

    const updateSystemModel = <T extends {}>(model: T, needsSaving: boolean = true) => {
        if (needsSaving) {
            setHasUnsaveChanges(true);
        }
        setSystemModel({...systemModel, ...model});
    };

    const classes = useStyles();

    const getMainContent = () => {
        const phase = getPhase(systemModel.currentStep);
        switch (phase) {
            case flowSteps.OHI_1:
                return <SystemDescription
                    currentStep={systemModel.currentStep}
                    entities={(systemModel.kinds as SystemDescriptionEntity[])
                        .concat(systemModel.roles)
                        .concat(systemModel.relators)
                        .concat(systemModel.systemObjectConnections)
                        .concat(systemModel.subsystems)}
                    entitiesChanged={updateSystemDescription}
                />;
            case flowSteps.OHI_2:
                return <MishapVictimIdentification
                    system={systemModel}
                    mishapVictimsUpdated={updateSystemModel}
                />;
        }
    };

    return (
        <ErrorBoundary>
            <CssBaseline />

            <div className={classes.root}>
                <AppBar
                    position="fixed"
                    className={classes.appBar}
                >
                    <Toolbar variant="dense">
                        <Grid container justify="space-evenly">
                            <Grid item xs>
                                <Meny openFile={openFile} saveFile={saveFile}></Meny>
                            </Grid>
                            <Grid item xs={6} className={classes.appTitle}>
                                <Typography variant="h6">
                                    Hazard Ontology
                            </Typography>
                            </Grid>
                            <Grid item xs>
                                &nbsp;
                        </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>

                <Drawer
                    variant="permanent"
                    className={classes.drawerOpen}
                    classes={{
                        paper: classes.drawerOpen
                    }}
                >
                    <div className={classes.toolbar}></div>

                    <ProgressSteps
                        progress={systemModel}
                        progressUpdated={updateSystemModel}
                    />
                </Drawer>

                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    {getMainContent()}
                </main>
            </div>
        </ErrorBoundary>
    );
}

export default App;
