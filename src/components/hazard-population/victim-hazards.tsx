import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { NodeSingular } from 'cytoscape';

import { isMishapVictim } from '../../entities/system-description/role';
import { getRole } from '../../entities/graph/element-utilities';
import HazardsTable from './hazards-table';
import HazardCreate from './hazard-create';
import CornerFab from '../shared/corner-fab';

interface Props {
    node: NodeSingular;
    close: () => void;
}

const useStyles = makeStyles(theme => ({
    header: {
        marginLeft: theme.appSpacing.standard
    },
    tableGutter: {
        marginBottom: theme.appSpacing.standard
    }
}));

const VictimHazards: React.FC<Props> = (props) => {
    const classes = useStyles();

    const mishapVictim = getRole(props.node);
    if (!mishapVictim || !isMishapVictim(mishapVictim)) {
        throw new Error('Entity passed is not a mishap victim');
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
            <HazardsTable selectedMishapVictim={mishapVictim} />
            <div className={classes.tableGutter}></div>
            <Typography variant='h6' color='textSecondary' className={classes.header}>
                Add New Hazard
            </Typography>
            <HazardCreate node={props.node} />
            <CornerFab separated onClick={props.close} >
                Back
            </CornerFab>
        </React.Fragment>
    );
};

export default VictimHazards;
