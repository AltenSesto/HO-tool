import React, { useState } from 'react';
import { Dialog, Backdrop, DialogActions, Button, TextField, DialogContent, FormControl, InputLabel, Select, MenuItem, makeStyles } from '@material-ui/core';

import { isSystemObject } from '../../entities/system-description/system-description-entity';
import Subsystem from '../../entities/system-description/subsystem';
import SystemObject from '../../entities/system-description/system-object';

interface Props {
    entity: SystemObject | Subsystem;
    subsystemsAvailable: Subsystem[];
    entityUpdated: (entity: SystemObject | Subsystem) => void;
    editCancelled: () => void;
}

const useStyles = makeStyles(theme => ({
    formControl: {
        marginTop: theme.spacing(1),
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

const NodeEditor: React.FC<Props> = (props: Props) => {

    const [entity, setEntity] = useState(props.entity);

    const classes = useStyles();

    const defaultParent = "";

    let parentEditor;
    if (isSystemObject(entity)) {
        const subsystems = props.subsystemsAvailable
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(e => <MenuItem key={e.id} value={e.id}>{e.name}</MenuItem>);

        let entityParent = defaultParent;
        if (entity.parent) {
            entityParent = entity.parent;
        }

        const updateParent = (ev: React.ChangeEvent<{ value: unknown }>) => {
            let parent: string | undefined;
            if (ev.target.value !== defaultParent) {
                parent = ev.target.value as string;
            }
            setEntity({ ...entity, ...{ parent: parent } });
        };

        parentEditor = (
            <FormControl className={classes.formControl}>
                <InputLabel shrink id="label-subsystem">
                    Subsystem
                </InputLabel>
                <Select
                    labelId="label-subsystem"
                    value={entityParent}
                    onChange={updateParent}
                    displayEmpty
                    disabled={subsystems.length === 0}
                    className={classes.selectEmpty}
                >
                    <MenuItem key="-1" value={defaultParent}>
                        <em>None</em>
                    </MenuItem>
                    {subsystems}
                </Select>
            </FormControl>
        );
    }

    const updateName = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setEntity({ ...entity, ...{ name: ev.target.value } });
    };

    const submitEntity = (ev: React.FormEvent) => {
        props.entityUpdated(entity);
        ev.preventDefault();
    };

    return (
        <React.Fragment>
            <Backdrop open={!!props.entity} />
            <Dialog open={!!props.entity}>
                <form autoComplete="off" onSubmit={submitEntity} onReset={() => props.editCancelled()}>
                    <DialogContent>
                        <TextField
                            required
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Name"
                            type="text"
                            fullWidth
                            defaultValue={entity.name}
                            onChange={updateName}
                        />
                        {parentEditor}
                    </DialogContent>
                    <DialogActions>
                        <Button type="submit" variant="contained" color="primary">OK</Button>
                        <Button type="reset" color="primary">Cancel</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </React.Fragment>
    );
};

export default NodeEditor;
