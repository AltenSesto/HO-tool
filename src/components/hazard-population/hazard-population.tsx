import React, { useState } from 'react';
import { NodeSingular } from 'cytoscape';

import VictimHazards from './victim-hazards';
import GraphView from './graph-view';
import TableView from './table-view';
import { getSystemObject } from '../../entities/graph/element-utilities';
import CornerFab from '../shared/corner-fab';
import { TableChart, BubbleChart } from '@material-ui/icons';

const HazardPopulation: React.FC = () => {

    const [isSummarySelected, setIsSummarySelected] = useState(false);
    const [selectedVictim, setSelectedVictim] = useState<NodeSingular | null>(null);

    if (selectedVictim) {
        const mishapVictim = getSystemObject(selectedVictim);
        if (!mishapVictim) {
            throw new Error('Selected node does not represent a mishap victim');
        }
        return <VictimHazards
            node={selectedVictim}
            close={() => setSelectedVictim(null)}
        />;
    }

    if (isSummarySelected) {
        return (
            <React.Fragment>
                <TableView />
                <CornerFab separated={true} onClick={() => setIsSummarySelected(false)}>
                    <BubbleChart />
                    Graph View
                </CornerFab>
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <GraphView victimSelected={setSelectedVictim} />
            <CornerFab onClick={() => setIsSummarySelected(true)}>
                <TableChart />
                Table View
            </CornerFab>
        </React.Fragment>
    );
};

export default HazardPopulation;
