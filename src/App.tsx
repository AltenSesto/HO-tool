import React, { useState } from 'react';
import { useBeforeunload } from 'react-beforeunload';
import 'typeface-roboto';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import { Toolbar, AppBar, Grid, Drawer } from '@material-ui/core';
import { connect, ConnectedProps } from 'react-redux'

import ErrorBoundary from './components/error-boundary';
import { SystemModel } from './entities/system-model';
import Meny from './components/meny/meny';
import ProgressSteps from './components/meny/progress-steps';
import { flowSteps } from './entities/meny/flow';
import MishapVictimIdentification from './components/mishap-victim-identification/mishap-victim-identification';
import SdfStep1 from './components/system-description/sdf-step-1';
import SdfStep2 from './components/system-description/sdf-step-2';
import SdfStep3 from './components/system-description/sdf-step-3';
import SdfStep4 from './components/system-description/sdf-step-4';
import HazardPopulation from './components/hazard-population/hazard-population';
import ProjectName from './components/project-name';
import { RootState } from './store';
import { loadModel, resetModel } from './store/system-model/actions';

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

const mapState = (state: RootState) => ({
    systemModel: state.systemModel
})

const mapDispatch = {
    setSystemModel: (model: SystemModel) => loadModel(model),
    resetSystemModel: () => resetModel()
}

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>

const App: React.FC<PropsFromRedux> = (props) => {

    const { systemModel, setSystemModel, resetSystemModel } = props;

    const [hasUnsavedChanges, setHasUnsaveChanges] = useState(false);

    useBeforeunload((ev) => {
        if (hasUnsavedChanges) {
            ev.preventDefault();
        }
    });

    const openFile = (model: SystemModel) => {
        resetSystemModel(); // reset state first to prevent collisions with opened model
        setSystemModel(model);
        setHasUnsaveChanges(false);
    };

    const saveFile = () => {
        setHasUnsaveChanges(false);
        return systemModel;
    };

    const updateSystemModel = <T extends {}>(model: T, needsSaving: boolean = true) => {
        if (needsSaving) {
            setHasUnsaveChanges(true);
        }
        setSystemModel({ ...systemModel, ...model });
    };

    const classes = useStyles();

    const getMainContent = () => {
        switch (systemModel.currentStep) {
            case flowSteps.SDF_1:
                return <SdfStep1
                    system={systemModel}
                    systemUpdated={updateSystemModel}
                />
            case flowSteps.SDF_2:
                return <SdfStep2
                    system={systemModel}
                    systemUpdated={updateSystemModel}
                />
            case flowSteps.SDF_3:
                return <SdfStep3
                    system={systemModel}
                    systemUpdated={updateSystemModel}
                />
            case flowSteps.SDF_4:
                return <SdfStep4
                    system={systemModel}
                    systemUpdated={updateSystemModel}
                />
            case flowSteps.OHI_2:
                return <MishapVictimIdentification
                    system={systemModel}
                    possibleHarmsUpdated={updateSystemModel}
                />;
            case flowSteps.OHI_3:
                return <HazardPopulation
                    system={systemModel}
                    systemUpdated={updateSystemModel}
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
                                <Meny
                                    openFile={openFile}
                                    saveFile={saveFile}
                                    hasUnsavedChanges={hasUnsavedChanges}
                                />
                            </Grid>
                            <Grid item xs={6} className={classes.appTitle}>
                                <ProjectName
                                    name={systemModel.projectName}
                                    nameUpdated={(projectName) => updateSystemModel({ projectName })}
                                />
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

export default connector(App);
