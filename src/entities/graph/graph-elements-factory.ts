import { SystemDescriptionEntity, isSystemObject, isConnection, isSubsystem } from "../system-description/system-description-entity";
import SystemObject from "../system-description/system-object";
import { GraphElement, SystemObjectData, ConnectionData, SubsystemData, Data } from "./graph-element";
import Connection from "../system-description/connection";
import Subsystem from "../system-description/subsystem";
import { SystemDescription } from "../system-model";

export default class GraphElementsFactory {

    mapSystemDescription(system: SystemDescription) {
        return this.mapSystemDescriptionEntities(
            (this.getAllNodes(system) as SystemDescriptionEntity[])
                .concat(system.systemObjectConnections)
        );
    }

    mapSystemDescriptionEntities(entities: SystemDescriptionEntity[]): GraphElement<Data>[] {
        return entities.map((e) => {
            if (isSystemObject(e)) return this.mapSystemObject(e);
            if (isConnection(e)) return this.mapConnection(e);
            if (isSubsystem(e)) return this.mapSubsystem(e);
            throw new Error('Unknown entity type');
        });
    }

    getAllNodes(system: SystemDescription): (SystemObject | Subsystem)[] {
        return (system.kinds as (SystemObject | Subsystem)[])
            .concat(system.relators)
            .concat(system.roles)
            .concat(system.subsystems);
    }

    protected hookSystemObject(element: GraphElement<SystemObjectData>) {
        return element;
    }

    protected hookConnection(element: GraphElement<ConnectionData>) {
        return element;
    }

    protected hookSubsystem(element: GraphElement<SubsystemData>) {
        return element;
    }

    private mapSystemObject(object: SystemObject): GraphElement<SystemObjectData> {
        return this.hookSystemObject({
            group: 'nodes',
            data: {
                id: object.id,
                label: `<<${object.type.toString()}>>\n${object.name}`,
                systemObject: object,
                parent: object.parent
            },
            position: {
                x: object.posX, y: object.posY
            },
            classes: [object.type.toString()]
        });
    }

    private mapConnection(connection: Connection): GraphElement<ConnectionData> {
        return this.hookConnection({
            group: 'edges',
            data: {
                id: connection.id,
                label: connection.label ? connection.label : '',
                source: connection.source,
                target: connection.target,
                connection: connection
            },
            pannable: true,
            classes: connection.isOriented ? ['arrow-edge'] : []
        });
    }

    private mapSubsystem(subsystem: Subsystem): GraphElement<SubsystemData> {
        return this.hookSubsystem({
            group: 'nodes',
            data: {
                id: subsystem.id,
                label: subsystem.name,
                subsystem: subsystem
            },
            position: {
                x: subsystem.posX, y: subsystem.posY
            },
            classes: ['subsystem']
        });
    }
}
