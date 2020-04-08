import SystemObject from "../system-description/system-object";
import Subsystem from "../system-description/subsystem";
import Connection from "../system-description/connection";

export interface Data {
    id: string;
    label: string;
}

export interface SystemObjectData extends Data {
    systemObject: SystemObject;
    parent?: string;
}

export interface SubsystemData extends Data {
    subsystem: Subsystem;
}

export interface ConnectionData extends Data {
    source: string;
    target: string;
    connection: Connection;
}

export interface GraphElement<TData extends Data> {
    group: 'nodes' | 'edges';
    data: TData;
    position?: GraphElementPosition;
    classes?: string[];
    grabbable?: boolean,
    pannable?: boolean;
}

export interface GraphElementPosition {
    x: number;
    y: number;
}

export function isSystemObjectData(data: Data): data is SystemObjectData {
    return 'systemObject' in data;
}

export function isSubsystemData(data: Data): data is SubsystemData {
    return 'subsystem' in data;
}

export function isConnectionData(data: Data): data is ConnectionData {
    return 'connection' in data;
}
