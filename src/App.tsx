import React, { useState } from 'react';
import { useBeforeunload } from 'react-beforeunload';

import 'typeface-roboto';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Toolbar, AppBar, Grid } from '@material-ui/core';

import SystemDescription from './components/system-description/system-description';
import ErrorBoundary from './components/error-boundary';
import { SystemModel } from './entities/system-model';
import Meny from './components/meny/meny';
import { SystemDescriptionEntity, isConnectionToCollapsed } from './entities/system-description/system-description-entity';
import ProgressSteps from './components/meny/progress-steps';

const App: React.FC = () => {

	const [systemModel, setSystemModel] = useState<SystemModel>({
		systemDescription: []
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
		return { ...systemModel, ...{ systemDescription: patchCollapsedConnections(systemModel.systemDescription) } }
	};

	const patchCollapsedConnections = (systemDescription: SystemDescriptionEntity[]) => {
		// needed as cytoscape.js-expand-collapse modifies the model so that it brings circular references
		return systemDescription.map(e => {
			if (isConnectionToCollapsed(e)) {
				return {
					id: e.id,
					source: e.originalEnds.source.data().id,
					target: e.originalEnds.target.data().id
				};
			}
			return e;
		});
	}

	const updateSystemDescription = (entities: SystemDescriptionEntity[]) => {
		setSystemModel({ ...systemModel, ...{ systemDescription: entities } });
		setHasUnsaveChanges(true);
	};

	const useStyles = makeStyles(() => ({
		appTitle: {
			textAlign: 'center'
		}
	}));
	const classes = useStyles();

	return (
		<ErrorBoundary>
			<CssBaseline />

			<AppBar position="static">
				<Toolbar variant="dense">
					<Grid container>
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
				<ProgressSteps></ProgressSteps>
			</AppBar>

			<SystemDescription entities={systemModel.systemDescription} entitiesChanged={updateSystemDescription}></SystemDescription>
		</ErrorBoundary>
	);
}

export default App;
