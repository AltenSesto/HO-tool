import React, { useState } from 'react';
import { NodeSingular } from 'cytoscape';

import { SystemModel } from '../../entities/system-model';
import VictimHazards from './victim-hazards';
import GraphView from './graph-view';
import Summary from './summary';
import Hazard from '../../entities/hazard-population/hazard';

interface Props {
    system: SystemModel;
    systemUpdated: (system: SystemModel) => void;
}

const HazardPopulation: React.FC<Props> = (props) => {

    const [isSummarySelected, setIsSummarySelected] = useState(false);
    const [selectedVictim, setSelectedVictim] = useState<NodeSingular | null>(null);

    const addHazard = (hazard: Hazard) => props.systemUpdated({
        ...props.system,
        ...{
            hazards: props.system.hazards.concat(hazard),
            nextHazardId: props.system.nextHazardId + 1
        }
    });

    const removeHazard = (id: string) => props.systemUpdated({
        ...props.system,
        ...{ hazards: props.system.hazards.filter(e => e.id !== id) }
    });

    if (selectedVictim) {
        return <VictimHazards
            node={selectedVictim}
            hazards={props.system.hazards}
            nextHazardId={props.system.nextHazardId}
            hazardCreated={addHazard}
            hazardDeleted={removeHazard}
            close={() => setSelectedVictim(null)}
        />;
    }

    if (isSummarySelected) {
        return <Summary back={() => setIsSummarySelected(false)} />;
    }

    return <GraphView
        system={props.system}
        victimSelected={setSelectedVictim}
        summaryClicked={() => setIsSummarySelected(true)}
    />;
};

export default HazardPopulation;
