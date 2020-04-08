import { NodeSingular, EdgeSingular } from "cytoscape";
import { isSystemObjectData, isConnectionData } from "./graph-element";
import { isRole } from "../system-description/role";

export function getSystemObject(ele: NodeSingular | EdgeSingular) {
    const data = ele.data();
    if (isSystemObjectData(data)) {
        return data.systemObject;
    }
}

export function getRole(ele: NodeSingular | EdgeSingular) {
    const systemObject = getSystemObject(ele);
    if (systemObject && isRole(systemObject)) {
        return systemObject;
    }
}

export function getConnection(ele: NodeSingular | EdgeSingular) {
    const data = ele.data();
    if (isConnectionData(data)) {
        return data.connection;
    }
}
