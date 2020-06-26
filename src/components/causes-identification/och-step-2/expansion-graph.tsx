import React, { useRef, useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../../store';
import CornerFab from '../../shared/corner-fab';
import Hazard from '../../../entities/hazard-population/hazard';
import { HeadlessGraph } from '../../../entities/graph/headless-graph';
import { SystemDescriptionEntity } from '../../../entities/system-description/system-description-entity';
import { getSystemObject, getConnection } from '../../../entities/graph/element-utilities';
import Graph from '../../graph/graph';
import GraphElementsFactory from '../../../entities/graph/graph-elements-factory';


const mapState = (state: RootState) => ({
    systemModel: state.systemModel
});

const mapDispatch = {
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    selectedHazard: Hazard;
    onClose: () => void;
}

const ExpansionGraph: React.FC<Props> = (props) => {

    const headlessGraph = useRef<HeadlessGraph>();
    const [expansionMembers, setExpansionMembers] = useState<SystemDescriptionEntity[]>([]);

    useEffect(() => {
        headlessGraph.current = new HeadlessGraph(props.systemModel);

        const hazardNodesSelector = `#${props.selectedHazard.exposure.id},` +
            `#${props.selectedHazard.hazardElement.id},` + 
            `#${props.selectedHazard.hazardElementEnvObj.id},` + 
            `#${props.selectedHazard.mishapVictim.id},` + 
            `#${props.selectedHazard.mishapVictimEnvObj.id}`;
        const hazardNodes = headlessGraph.current.cy.nodes(hazardNodesSelector);
        const hazardEdges = hazardNodes.edgesWith(hazardNodes);

        const hazardSystemObjects = hazardNodes.map(getSystemObject) as SystemDescriptionEntity[];
        const hazardConnections = hazardEdges.map(getConnection) as SystemDescriptionEntity[];

        setExpansionMembers(hazardSystemObjects.concat(hazardConnections));

    }, [props.systemModel, props.selectedHazard]);

    const elements = new GraphElementsFactory().mapSystemDescriptionEntities(expansionMembers);

    return (
        <React.Fragment>
            <Graph
                cursorStyle={'default'}
                elements={elements}
                mouseEnteredNode={() => { }}
                mouseLeftNode={() => { }}
                nodeClicked={() => { }}
                graphClicked={() => { }}
            />
            <CornerFab onClick={props.onClose}>
                Back
            </CornerFab>
        </React.Fragment>
    );
};

export default connector(ExpansionGraph);
