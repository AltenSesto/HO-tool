import React from 'react';
import { useBeforeunload } from 'react-beforeunload';
import 'typeface-roboto';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import { Toolbar, AppBar, Grid, Drawer } from '@material-ui/core';
import { connect, ConnectedProps } from 'react-redux'

import ErrorBoundary from './components/error-boundary';
import Meny from './components/meny/meny';
import ProgressSteps from './components/meny/progress-steps';
import ProjectName from './components/project-name';
import { RootState } from './store';
import ConfirmationDialog from './components/confirmation-dialog';
import { FlowStepId } from './entities/meny/flow-step-id';

import MishapVictimIdentification from './components/mishap-victim-identification/mishap-victim-identification';
import SdfStep1 from './components/system-description/sdf-step-1';
import SdfStep2 from './components/system-description/sdf-step-2';
import SdfStep3 from './components/system-description/sdf-step-3';
import SdfStep4 from './components/system-description/sdf-step-4';
import HazardPopulation from './components/hazard-population/hazard-population';
import OchStep1 from './components/causes-identification/och-step-1/och-step-1';
import OchStep2 from './components/causes-identification/och-step-2/och-step-2';

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
    currentStep: state.systemModel.currentStep,
    hasUnsavedChanges: state.unsavedChanges
})

const connector = connect(mapState);

type Props = ConnectedProps<typeof connector>

const App: React.FC<Props> = (props) => {

    useBeforeunload((ev) => {
        if (props.hasUnsavedChanges) {
            ev.preventDefault();
        }
    });

    const classes = useStyles();

    const getMainContent = () => {
        switch (props.currentStep) {
            case FlowStepId.SDF_1:
                return <SdfStep1 />
            case FlowStepId.SDF_2:
                return <SdfStep2 />
            case FlowStepId.SDF_3:
                return <SdfStep3 />
            case FlowStepId.SDF_4:
                return <SdfStep4 />
            case FlowStepId.OHI_2:
                return <MishapVictimIdentification />;
            case FlowStepId.OHI_3:
                return <HazardPopulation />;
            case FlowStepId.OCH_1:
                return <OchStep1 />;
            case FlowStepId.OCH_2:
                return <OchStep2 />
            default:
                throw new Error(`Unknown step id ${props.currentStep}`);
        }
    };

    return (
        <ErrorBoundary>
            <CssBaseline />
            <ConfirmationDialog />

            <div className={classes.root}>
                <AppBar
                    position="fixed"
                    className={classes.appBar}
                >
                    <Toolbar variant="dense">
                        <Grid container justify="space-evenly">
                            <Grid item xs>
                                <Meny />
                            </Grid>
                            <Grid item xs={6} className={classes.appTitle}>
                                <ProjectName />
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

                    <ProgressSteps />
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
