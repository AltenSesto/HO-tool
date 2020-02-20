import SystemObject from "../system-description/system-object";
import Connection from "../system-description/connection";

export type GraphEntity = Connection | SystemObject;

export function isSystemObject(entity: GraphEntity): entity is SystemObject {
    return 'type' in entity;
}

export function isConnection(entity: GraphEntity): entity is Connection {
    return 'source' in entity;
}
