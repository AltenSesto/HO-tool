import React, { useState } from 'react';

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

  const openFile = (model: SystemModel) => setSystemModel(model);

  const saveFile = () => systemModel;

  const updateSystemDescription = (entities: SystemDescriptionEntity[]) => 
    setSystemModel({...systemModel, ...{systemDescription: entities}});

  return (
    <ErrorBoundary>
      <Meny openFile={openFile} saveFile={saveFile}></Meny>
      <SystemDescription entities={systemModel.systemDescription} entitiesChanged={updateSystemDescription}></SystemDescription>
    </ErrorBoundary>
  );
}

export default App;
