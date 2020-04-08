import { FlowStepId } from "./meny/flow-step";
import SystemObject from "./system-description/system-object";
import Connection from "./system-description/connection";
import Subsystem from "./system-description/subsystem";
import Role from "./system-description/role";
import Hazard from "./hazard-population/hazard";

export interface SystemDescription {
    kinds: SystemObject[];
    roles: Role[];
    relators: SystemObject[];
    systemObjectConnections: Connection[];
    subsystems: Subsystem[];
    hazards: Hazard[];
}

export interface SystemModel extends SystemDescription {
    currentStep: FlowStepId;
    lastCompletedStep: FlowStepId;
};

export function createObjectId(prefix: string) {
    return `${prefix}-${new Date().getTime()}`;
}
