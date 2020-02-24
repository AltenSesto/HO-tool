import SystemObject from "./system-object";
import Connection from "./connection";

export type SystemDescriptionEntity = Connection | SystemObject;

export function isSystemObject(entity: SystemDescriptionEntity): entity is SystemObject {
    return 'type' in entity;
}

export function isConnection(entity: SystemDescriptionEntity): entity is Connection {
    return 'source' in entity;
}
