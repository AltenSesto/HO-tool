import React, { useState } from 'react';
import { SystemDescription } from '../../entities/system-model';
import GraphElementsFactoryMishapVictims from '../../entities/graph/graph-elements-factory-mishap-victims';
import Graph from '../graph/graph';
import { EventObject, NodeSingular } from 'cytoscape';
import { isMishapVictim } from '../../entities/system-description/role';
import CornerCard from '../shared/corner-card';
import { Typography } from '@material-ui/core';
import { getRole } from '../../entities/graph/element-utilities';
import VictimHazards from './victim-hazards';

interface Props {
    system: SystemDescription;
    systemUpdated: (system: SystemDescription) => void;
}

const HazardPopulation: React.FC<Props> = (props) => {

    const [isVictimPointed, setIsVictimPointed] = useState(false);
    const [selectedVictim, setSelectedVictim] = useState<NodeSingular | null>(null);

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
            setSelectedVictim(event.target);
        }
    };

    if (selectedVictim) {
        return <VictimHazards
            node={selectedVictim}
            close={() => setSelectedVictim(null)}
        />;
    }

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
            <CornerCard>
                <Typography>
                    Click on a mishap victim to populate hazards
                </Typography>
            </CornerCard>
        </React.Fragment>
    );
};

export default HazardPopulation;
