import React from 'react';
import Toolbar from './toolbar';
import SystemObject from '../../entities/system-description/system-object';
import Graph from './graph';
import { SystemDescriptionEntity } from '../../entities/system-description/system-description-entity';
import Subsystem from '../../entities/system-description/subsystem';
import { Grid, Paper } from '@material-ui/core';

interface Props {
    entities: SystemDescriptionEntity[];
    entitiesChanged: (entities: SystemDescriptionEntity[]) => void;
}

export default class SystemDescription extends React.Component<Props> {
    constructor(props: Props) {
        super(props);

        this.addEntity = this.addEntity.bind(this);
        this.updateObject = this.updateObject.bind(this);
        this.deleteEntities = this.deleteEntities.bind(this);
    }

    render() {
        return (
			<Grid container alignItems="stretch">
                <Grid item xs={12}>
                    <Toolbar entityAdded={this.addEntity} allEntities={this.props.entities}></Toolbar>
                    <Paper variant="outlined" square>
                        <Graph
                            entities={this.props.entities}
                            connectionCreated={this.addEntity}
                            entitiesDeleted={this.deleteEntities}
                            nodeUpdated={this.updateObject}></Graph>
                    </Paper>
                </Grid>
            </Grid>
        );
    }

    private addEntity(entity: SystemDescriptionEntity) {
        const entities = this.props.entities.concat(entity);
        this.props.entitiesChanged(entities);
    };

    private updateObject(updatedObj: SystemObject | Subsystem) {
        const entities = this.props.entities.map(e => e.id === updatedObj.id ? updatedObj : e);
        this.props.entitiesChanged(entities);
    };

    private deleteEntities(ids: string[]) {
        const entities = this.props.entities.filter(e => !ids.some(i => e.id === i))
        this.props.entitiesChanged(entities);
    }
};
