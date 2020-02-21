import SystemObject from "./system-object";
import Connection from "./connection";

export default interface ObjectConnections {
    object: SystemObject;
    connections: Connection[];
};
