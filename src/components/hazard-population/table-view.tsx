import React, { useState } from 'react';
import { makeStyles, Typography, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

import Hazard from '../../entities/hazard-population/hazard';
import HazardsTable from './hazards-table';
import { NodeSingular } from 'cytoscape';
import { MishapVictim } from '../../entities/system-description/role';
import HazardCreate from './hazard-create';

interface Props {
    hazards: Hazard[];
    mishapVictims: MishapVictim[];
    getNode: (id: string) => NodeSingular | null;
    nextHazardId: number;
    hazardCreated: (item: Hazard) => void;
    hazardEdited: (id: number, item: Hazard) => void;
    hazardDeleted: (id: number) => void;
}

const useStyles = makeStyles(theme => ({
    header: {
        marginLeft: theme.spacing(2)
    },
    tableGutter: {
        marginBottom: theme.spacing(2)
    },
    select: {
        marginLeft: theme.spacing(2),
        width: '220px'
    }
}));

const TableView: React.FC<Props> = (props: Props) => {
    const classes = useStyles();

    const [mishapVictimId, setMishapVictimId] = useState('');
    const [mishapVictimNode, setMishapVictimNode] = useState<NodeSingular | null>(null);

    const selectMishapVictim = (ev: React.ChangeEvent<{ value: unknown }>) => {
        const id = ev.target.value as string;
        const node = props.getNode(id);
        if (node) {
            setMishapVictimId(id);
            setMishapVictimNode(node);
        }
    };

    return (
        <React.Fragment>
            <Typography variant="h6" color="textSecondary" className={classes.header}>
                Hazards
            </Typography>
            <HazardsTable
                hazards={props.hazards}
                hazardEdited={props.hazardEdited}
                hazardDeleted={props.hazardDeleted}
            />
            <div className={classes.tableGutter}></div>
            <Typography variant='h6' color='textSecondary' className={classes.header}>
                Add New Hazard
            </Typography>
            <FormControl className={classes.select}>
                <InputLabel id='label-select-mishap-victim'>
                    Select mishap victim
                </InputLabel>
                <Select
                    margin='none'
                    labelId='label-select-mishap-victim'
                    onChange={selectMishapVictim}
                    value={mishapVictimId}
                >
                    {props.mishapVictims
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((item, index) => (
                            <MenuItem key={index} value={item.id}>
                                {item.name}
                            </MenuItem>))}
                </Select>
            </FormControl>
            {mishapVictimNode ?
                <React.Fragment>
                    <HazardCreate
                        hazardCreated={props.hazardCreated}
                        nextHazardId={props.nextHazardId}
                        node={mishapVictimNode}
                    />
                </React.Fragment>
                :
                undefined
            }
        </React.Fragment>
    );
};

export default TableView;
