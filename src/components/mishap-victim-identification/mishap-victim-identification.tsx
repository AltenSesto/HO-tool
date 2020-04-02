import React, { useState } from 'react';
import GraphView from './graph-view';
import { makeStyles, Fab } from '@material-ui/core';
import { TableChart, BubbleChart } from '@material-ui/icons';
import TableView from './table-view';
import { SystemDescription } from '../../entities/system-model';
import Role from '../../entities/system-description/role';

interface Props {
    system: SystemDescription;
    possibleHarmsUpdated: (roles: { roles: Role[] }) => void;
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

    const updateHarms = (role: Role) => {
        const updatedRoles = props.system.roles.map(e => e.id === role.id ? role : e);
        props.possibleHarmsUpdated({ roles: updatedRoles });
    };

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
                    systemDescription={props.system}
                    possibleHarmsUpdated={updateHarms}
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
                possibleHarmsUpdated={updateHarms}
            />
        </React.Fragment>
    );
}

export default MishapVictimIdentification;
