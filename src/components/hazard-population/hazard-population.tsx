import React from 'react';
import { SystemDescription } from '../../entities/system-model';
import GraphElementsFactoryMishapVictims from '../../entities/graph/graph-elements-factory-mishap-victims';
import Graph from '../graph/graph';

interface Props {
    system: SystemDescription;
    systemUpdated: (system: SystemDescription) => void;
}

const HazardPopulation: React.FC<Props> = (props) => {

    const elementsFactory = new GraphElementsFactoryMishapVictims();
    const elements = elementsFactory.mapSystemDescription(props.system);

    return (
        <React.Fragment>
            <Graph
                elements={elements}
                cursorStyle={'default'}
                graphClicked={() => { }}
                mouseEnteredNode={() => { }}
                mouseLeftNode={() => { }}
                nodeClicked={() => { }}
            />
        </React.Fragment>
    );
};

export default HazardPopulation;
