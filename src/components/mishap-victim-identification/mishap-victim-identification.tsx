import React, { useState } from 'react';
import GraphView from './graph-view';
import { TableChart, BubbleChart } from '@material-ui/icons';
import TableView from './table-view';
import CornerFab from '../shared/corner-fab';

const MishapVictimIdentification: React.FC = () => {
    const [isGraphView, setIsGraphView] = useState(true);

    if (isGraphView) {
        return (
            <React.Fragment>
                <CornerFab onClick={() => setIsGraphView(false)} >
                    <TableChart />
                    Table View
                </CornerFab>
                <GraphView />
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <CornerFab onClick={() => setIsGraphView(true)} >
                <BubbleChart />
                Graph View
            </CornerFab>
            <TableView />
        </React.Fragment>
    );
}

export default MishapVictimIdentification;
