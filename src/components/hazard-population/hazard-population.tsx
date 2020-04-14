import React, { useState } from 'react';
import { NodeSingular } from 'cytoscape';

import { SystemModel } from '../../entities/system-model';
import VictimHazards from './victim-hazards';
import GraphView from './graph-view';
import TableView from './table-view';
import Hazard from '../../entities/hazard-population/hazard';
import { getSystemObject } from '../../entities/graph/element-utilities';
import CornerFab from '../shared/corner-fab';
import { TableChart, BubbleChart } from '@material-ui/icons';

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
        const mishapVictim = getSystemObject(selectedVictim);
        if (!mishapVictim) {
            throw new Error('Selected node does not represent a mishap victim');
        }
        return <VictimHazards
            node={selectedVictim}
            hazards={props.system.hazards.filter(e => e.mishapVictim.id === mishapVictim.id)}
            nextHazardId={props.system.nextHazardId}
            hazardCreated={addHazard}
            hazardDeleted={removeHazard}
            close={() => setSelectedVictim(null)}
        />;
    }

    if (isSummarySelected) {
        return (
            <React.Fragment>
                <TableView
                    hazards={props.system.hazards}
                />
                <CornerFab onClick={() => setIsSummarySelected(false)}>
                    <BubbleChart />
                    Graph View
                </CornerFab>
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <GraphView
                system={props.system}
                victimSelected={setSelectedVictim}
            />
            <CornerFab onClick={() => setIsSummarySelected(true)}>
                <TableChart />
                Table View
            </CornerFab>
        </React.Fragment>
    );
};

export default HazardPopulation;
