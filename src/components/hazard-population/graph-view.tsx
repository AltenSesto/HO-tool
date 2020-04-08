import React, { useState } from 'react';
import { EventObject, NodeSingular } from 'cytoscape';
import { TableChart } from '@material-ui/icons';
import { Typography } from '@material-ui/core';

import { SystemDescription } from '../../entities/system-model';
import GraphElementsFactoryMishapVictims from '../../entities/graph/graph-elements-factory-mishap-victims';
import Graph from '../graph/graph';
import { isMishapVictim } from '../../entities/system-description/role';
import CornerCard from '../shared/corner-card';
import { getRole } from '../../entities/graph/element-utilities';
import CornerFab from '../shared/corner-fab';

interface Props {
    system: SystemDescription;
    victimSelected: (node: NodeSingular) => void;
    summaryClicked: () => void;
}

const GraphView: React.FC<Props> = (props) => {

    const [isVictimPointed, setIsVictimPointed] = useState(false);

    const getMishapVictimFromEvent = (event: EventObject) => {
        const ele: NodeSingular = event.target.element();
        const role = getRole(ele);
        if (role && isMishapVictim(role)) {
            return role;
        }
    }

    const checkVictimPointed = (event: EventObject) => {
        setIsVictimPointed(!!getMishapVictimFromEvent(event));
    }

    const selectVictim = (event: EventObject) => {
        const mishapVictim = getMishapVictimFromEvent(event);
        if (mishapVictim) {
            props.victimSelected(event.target);
        }
    };

    const elementsFactory = new GraphElementsFactoryMishapVictims();
    const elements = elementsFactory.mapSystemDescription(props.system);

    return (
        <React.Fragment>
            <Graph
                elements={elements}
                cursorStyle={isVictimPointed ? 'pointer' : 'default'}
                graphClicked={() => { }}
                mouseEnteredNode={checkVictimPointed}
                mouseLeftNode={checkVictimPointed}
                nodeClicked={selectVictim}
            />
            <CornerFab onClick={props.summaryClicked}>
                <TableChart />
                Summary
            </CornerFab>
            <CornerCard>
                <Typography>
                    Click on a mishap victim to populate hazards
                </Typography>
                <Typography variant='caption'>
                    Mishap victims are marked yellow
                </Typography>
            </CornerCard>
        </React.Fragment>
    );
};

export default GraphView;
