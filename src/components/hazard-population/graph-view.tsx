import React, { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { EventObject, NodeSingular } from 'cytoscape';
import { Typography } from '@material-ui/core';

import GraphElementsFactoryMishapVictims from '../../entities/graph/graph-elements-factory-mishap-victims';
import Graph from '../graph/graph';
import { isMishapVictim } from '../../entities/system-description/role';
import CornerCard from '../shared/corner-card';
import { getRole } from '../../entities/graph/element-utilities';
import { RootState } from '../../store';

const mapState = (state: RootState) => ({
    system: state.systemModel
})

const connector = connect(mapState);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    victimSelected: (node: NodeSingular) => void;
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
                mouseEnteredNode={checkVictimPointed}
                mouseLeftNode={checkVictimPointed}
                nodeClicked={selectVictim}
            />
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

export default connector(GraphView);
