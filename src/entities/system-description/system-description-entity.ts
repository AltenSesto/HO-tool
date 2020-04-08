import SystemObject from "./system-object";
import Connection from "./connection";
import Subsystem from "./subsystem";
import ConnectionToCollapsed from "./connection-to-collapsed";

export type SystemDescriptionEntity = Connection | SystemObject | Subsystem;

export function isSystemObject(entity: SystemDescriptionEntity): entity is SystemObject {
    return 'type' in entity;
}

export function isConnection(entity: SystemDescriptionEntity): entity is Connection {
    return 'source' in entity;
}

export function isSubsystem(entity: SystemDescriptionEntity): entity is Subsystem {
    return !('source' in entity) && !('type' in entity);
}

export function isConnectionToCollapsed(entity: SystemDescriptionEntity): entity is ConnectionToCollapsed {
    return isConnection(entity) && 'originalEnds' in entity;
}
