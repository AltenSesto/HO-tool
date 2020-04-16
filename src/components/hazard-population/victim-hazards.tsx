import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { NodeSingular } from 'cytoscape';

import { isMishapVictim } from '../../entities/system-description/role';
import { getRole } from '../../entities/graph/element-utilities';
import Hazard from '../../entities/hazard-population/hazard';
import HazardsTable from './hazards-table';
import HazardCreate from './hazard-create';
import CornerFab from '../shared/corner-fab';

interface Props {
    node: NodeSingular;
    hazards: Hazard[];
    nextHazardId: number;
    hazardCreated: (hazard: Hazard) => void;
    hazardDeleted: (id: string) => void;
    close: () => void;
}

const useStyles = makeStyles(theme => ({
    header: {
        marginLeft: theme.spacing(2)
    },
    tableGutter: {
        marginBottom: theme.spacing(2)
    },
    fabSpace: {
        marginBottom: theme.spacing(2) + 40
    }
}));

const VictimHazards: React.FC<Props> = (props) => {
    const classes = useStyles();

    const mishapVictim = getRole(props.node);
    if (!mishapVictim || !isMishapVictim(mishapVictim)) {
        throw new Error('Enity passed is not a mishap victim');
    }

    return (
        <React.Fragment>
            <Typography variant="h6" color="textSecondary" className={classes.header}>
                Possible Harms
            </Typography>
            <Typography variant="body1" className={classes.header} gutterBottom>
                {mishapVictim.possibleHarms.join(', ')}
            </Typography>
            <Typography variant="h6" color="textSecondary" className={classes.header}>
                Hazards
            </Typography>
            <HazardsTable
                hazards={props.hazards}
                hazardDeleted={props.hazardDeleted}
            />
            <div className={classes.tableGutter}></div>
            <Typography variant='h6' color='textSecondary' className={classes.header}>
                Add New Hazard
            </Typography>
            <HazardCreate
                hazardCreated={props.hazardCreated}
                nextHazardId={props.nextHazardId}
                node={props.node}
            />
            <div className={classes.fabSpace}></div>
            <CornerFab onClick={props.close} >
                Back
            </CornerFab>
        </React.Fragment>
    );
};

export default VictimHazards;
