import React, { useState } from 'react';
import { NodeSingular } from 'cytoscape';

import { SystemDescription } from '../../entities/system-model';
import VictimHazards from './victim-hazards';
import GraphView from './graph-view';
import Summary from './summary';

interface Props {
    system: SystemDescription;
    systemUpdated: (system: SystemDescription) => void;
}

const HazardPopulation: React.FC<Props> = (props) => {

    const [isSummarySelected, setIsSummarySelected] = useState(false);
    const [selectedVictim, setSelectedVictim] = useState<NodeSingular | null>(null);

    if (selectedVictim) {
        return <VictimHazards
            node={selectedVictim}
            roles={props.system.roles}
            connections={props.system.systemObjectConnections}
            systemUpdated={(up) => props.systemUpdated({ ...props.system, ...up })}
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
