import React, { useState } from 'react';

import { useBeforeunload } from 'react-beforeunload';

import SystemDescription from './components/system-description/system-description';
import ErrorBoundary from './components/error-boundary';
import { SystemModel } from './entities/system-model';
import Meny from './components/meny/meny';
import { SystemDescriptionEntity } from './entities/system-description/system-description-entity';

const App: React.FC = () => {
  // Routing goes here

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
    return systemModel
  };

  const updateSystemDescription = (entities: SystemDescriptionEntity[]) => {
    setSystemModel({ ...systemModel, ...{ systemDescription: entities } });
    setHasUnsaveChanges(true);
  };

  return (
    <ErrorBoundary>
      <Meny openFile={openFile} saveFile={saveFile}></Meny>
      <SystemDescription entities={systemModel.systemDescription} entitiesChanged={updateSystemDescription}></SystemDescription>
    </ErrorBoundary>
  );
}

export default App;
