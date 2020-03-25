import React, { useState } from 'react';
import SystemObject from '../../entities/system-description/system-object';
import Connection from '../../entities/system-description/connection';
import Subsystem from '../../entities/system-description/subsystem';
import PossibleHarm from '../../entities/mishap-victim-identification/possible-harm';
import { SystemDescriptionEntity } from '../../entities/system-description/system-description-entity';
import GraphView from './graph-view';
import { makeStyles, Fab } from '@material-ui/core';
import { TableChart, BubbleChart } from '@material-ui/icons';
import TableView from './table-view';

interface Props {
    system: {
        kinds: SystemObject[];
        roles: SystemObject[];
        relators: SystemObject[];
        systemObjectConnections: Connection[];
        subsystems: Subsystem[];
        possibleHarms: PossibleHarm[];
    };
    possibleHarmsUpdated: (items: { possibleHarms: PossibleHarm[] }) => void;
}

const useStyles = makeStyles(theme => ({
    fab: {
        position: 'fixed',
        marginBottom: theme.spacing(2),
        marginLeft: theme.spacing(2),
        bottom: 0,
        zIndex: 110,
    }
}));

const MishapVictimIdentification: React.FC<Props> = (props: Props) => {
    const classes = useStyles();
    const [isGraphView, setIsGraphView] = useState(true);

    if (isGraphView) {
        return (
            <React.Fragment>
                <Fab variant='extended'
                    className={classes.fab}
                    size='medium'
                    onClick={() => setIsGraphView(false)}
                >
                    <TableChart />
                    Table View
                </Fab>
                <GraphView
                    systemDescription={(props.system.kinds as SystemDescriptionEntity[])
                        .concat(props.system.roles)
                        .concat(props.system.relators)
                        .concat(props.system.systemObjectConnections)
                        .concat(props.system.subsystems)}
                    possibleHarms={props.system.possibleHarms}
                    possibleHarmsUpdated={(items) => props.possibleHarmsUpdated({ possibleHarms: items })}
                />
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <Fab variant='extended'
                className={classes.fab}
                size='medium'
                onClick={() => setIsGraphView(true)}
            >
                <BubbleChart />
                Graph View
            </Fab>
            <TableView
                roles={props.system.roles}
                possibleHarms={props.system.possibleHarms}
                possibleHarmsUpdated={(items) => props.possibleHarmsUpdated({ possibleHarms: items })}
            />
        </React.Fragment>
    );
}

export default MishapVictimIdentification;
