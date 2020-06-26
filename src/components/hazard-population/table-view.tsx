import React, { useState, useRef } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { makeStyles, Typography, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

import HazardsTable from './hazards-table';
import { NodeSingular } from 'cytoscape';
import { isMishapVictim } from '../../entities/system-description/role';
import HazardCreate from './hazard-create';
import { RootState } from '../../store';
import { HeadlessGraph } from '../../entities/graph/headless-graph';

const mapState = (state: RootState) => ({
    mishapVictims: state.systemModel.roles.filter(e => isMishapVictim(e)),
    systemModel: state.systemModel
})

const connector = connect(mapState);

type Props = ConnectedProps<typeof connector>

const useStyles = makeStyles(theme => ({
    header: {
        marginLeft: theme.appSpacing.standard
    },
    tableGutter: {
        marginBottom: theme.appSpacing.standard
    },
    select: {
        marginLeft: theme.appSpacing.standard,
        width: '220px'
    }
}));

const TableView: React.FC<Props> = (props: Props) => {
    const classes = useStyles();

    const [mishapVictimId, setMishapVictimId] = useState('');
    const [mishapVictimNode, setMishapVictimNode] = useState<NodeSingular | null>(null);
    const headlessGraph = useRef<HeadlessGraph>();

    const selectMishapVictim = (ev: React.ChangeEvent<{ value: unknown }>) => {
        const id = ev.target.value as string;
        if (!headlessGraph.current) {
            headlessGraph.current = new HeadlessGraph(props.systemModel);
        }

        const node = headlessGraph.current.cy.$(`#${id}`);
        if (!node || !node.isNode()) {
            throw new Error(`Node with id ${id} not found`);
        }

        setMishapVictimId(id);
        setMishapVictimNode(node);
    };

    return (
        <React.Fragment>
            <Typography variant="h6" color="textSecondary" className={classes.header}>
                Hazards
            </Typography>
            <HazardsTable />
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
                <HazardCreate node={mishapVictimNode} />
                :
                undefined
            }
        </React.Fragment>
    );
};

export default connector(TableView);
