import React, { useState, useRef } from 'react';
import { NodeSingular, Core } from 'cytoscape';

import VictimHazards from './victim-hazards';
import GraphView from './graph-view';
import TableView from './table-view';
import { getSystemObject } from '../../entities/graph/element-utilities';
import CornerFab from '../shared/corner-fab';
import { TableChart, BubbleChart } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core';

const useStyle = makeStyles((theme) => ({
    fabSpace: {
        height: theme.appSpacing.fabOverlap
    }
}));

const HazardPopulation: React.FC = () => {
    const classes = useStyle();

    const [isSummarySelected, setIsSummarySelected] = useState(false);
    const [selectedVictim, setSelectedVictim] = useState<NodeSingular | null>(null);

    const cyRef = useRef<Core>();

    const findNode = (id: string) => {
        if (!cyRef.current) {
            return null;
        }
        const ele = cyRef.current.$(`#${id}`);
        if (ele.isNode()) {
            return ele;
        }
        return null;
    }

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
                <TableView getNode={findNode} />
                <div className={classes.fabSpace} />
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
                victimSelected={setSelectedVictim}
                cyInitialized={cy => cyRef.current = cy}
            />
            <CornerFab onClick={() => setIsSummarySelected(true)}>
                <TableChart />
                Table View
            </CornerFab>
        </React.Fragment>
    );
};

export default HazardPopulation;
