import React, { useState, useRef } from 'react';
import { NodeSingular, Core } from 'cytoscape';

import { SystemModel } from '../../entities/system-model';
import VictimHazards from './victim-hazards';
import GraphView from './graph-view';
import TableView from './table-view';
import Hazard from '../../entities/hazard-population/hazard';
import { getSystemObject } from '../../entities/graph/element-utilities';
import CornerFab from '../shared/corner-fab';
import { TableChart, BubbleChart } from '@material-ui/icons';
import { isMishapVictim } from '../../entities/system-description/role';
import { makeStyles } from '@material-ui/core';

interface Props {
    system: SystemModel;
    systemUpdated: (system: SystemModel) => void;
}

const useStyle = makeStyles((theme) => ({
    fabSpace: {
        height: theme.spacing(2) + 40
    }
}));

const HazardPopulation: React.FC<Props> = (props) => {
    const classes = useStyle();

    const [isSummarySelected, setIsSummarySelected] = useState(false);
    const [selectedVictim, setSelectedVictim] = useState<NodeSingular | null>(null);

    const cyRef = useRef<Core>();

    const addHazard = (hazard: Hazard) => props.systemUpdated({
        ...props.system,
        ...{
            hazards: props.system.hazards.concat(hazard),
            nextHazardId: props.system.nextHazardId + 1
        }
    });
    
    const editHazard = (hazard: Hazard) => props.systemUpdated({
        ...props.system,
        ...{ hazards: props.system.hazards.map(h => {
            if(h.id === hazard.id) {
                return hazard;
            }
            return h;
        })}
    });

    const removeHazard = (id: number) => props.systemUpdated({
        ...props.system,
        ...{ hazards: props.system.hazards.filter(e => e.id !== id) }
    });

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
            hazards={props.system.hazards.filter(e => e.mishapVictim.id === mishapVictim.id)}
            nextHazardId={props.system.nextHazardId}
            hazardCreated={addHazard}
            hazardEdited={editHazard}
            hazardDeleted={removeHazard}
            close={() => setSelectedVictim(null)}
        />;
    }

    if (isSummarySelected) {
        return (
            <React.Fragment>
                <TableView
                    hazards={props.system.hazards}
                    mishapVictims={props.system.roles.filter(e => isMishapVictim(e))}
                    getNode={findNode}
                    hazardCreated={addHazard}
                    hazardEdited={editHazard}
                    hazardDeleted={removeHazard}
                    nextHazardId={props.system.nextHazardId}
                />
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
                system={props.system}
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
