import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { NodeSingular, EdgeSingular, SingularElementReturnValue } from 'cytoscape';

import { isMishapVictim, MishapVictim } from '../../entities/system-description/role';
import { getConnection, getRole, getSystemObject } from '../../entities/graph/element-utilities';
import { PossibleHazard, ConnectionToObject } from '../../entities/hazard-population/possible-hazard';
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

    const findPossibleHazards = (mishapVictim: MishapVictim) => {
        let result: PossibleHazard[] = [];
        const victimKinds = props.node.incomers();
        const relators = props.node.outgoers();
        const hazardRoles = relators.incomers();

        const hazardElementsEnvObjs: ConnectionToObject[] = [];
        const hazardKinds = hazardRoles.incomers();
        for (let i = 0; i < hazardKinds.length; i++) {
            const envObj = getEntityPair(hazardKinds[i], true);
            if (envObj) {
                hazardElementsEnvObjs.push(envObj);
            }
        }

        for (let i = 0; i < victimKinds.length; i++) {
            const mishapVictimEnvObj = getEntityPair(victimKinds[i], true);
            if (!mishapVictimEnvObj) {
                continue;
            }
            for (let j = 0; j < relators.length; j++) {
                const exposure = getEntityPair(relators[j], false);
                if (!exposure) {
                    continue;
                }
                for (let k = 0; k < hazardRoles.length; k++) {
                    const hazardElement = getEntityPair(hazardRoles[k], true);
                    if (!hazardElement) {
                        continue;
                    }
                    result.push({
                        mishapVictim,
                        mishapVictimEnvObj,
                        exposure,
                        hazardElement,
                        hazardElementEnvObjs: hazardElementsEnvObjs
                            .filter(e => e.connection.target === hazardElement.object.id)
                    });
                }
            }
        }
        return result;
    };


    const getEntityPair = (
        ele: SingularElementReturnValue | (NodeSingular & EdgeSingular),
        takeSource: boolean
    ) => {
        if (ele.isEdge()) {
            const node = takeSource ? ele.source() : ele.target();
            const object = getSystemObject(node);
            const connection = getConnection(ele);
            if (object && connection) {
                return { object, connection };
            }
        }
        return null;
    }

    const possibleHazards = findPossibleHazards(mishapVictim);

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
                possibleHazards={possibleHazards}
                actualHazards={props.hazards}
                hazardDeleted={props.hazardDeleted}
            />
            <div className={classes.tableGutter}></div>
            <Typography variant='h6' color='textSecondary' className={classes.header}>
                Add New Hazard
            </Typography>
            <Typography variant='caption' className={classes.header}>
                Select a table row to add
            </Typography>
            <HazardCreate
                possibleHazards={possibleHazards}
                hazardCreated={props.hazardCreated}
                nextHazardId={props.nextHazardId}
            />
            <div className={classes.fabSpace}></div>
            <CornerFab onClick={props.close} >
                Back
            </CornerFab>
        </React.Fragment>
    );
};

export default VictimHazards;
