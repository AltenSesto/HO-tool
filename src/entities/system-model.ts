import { FlowStepId } from "./meny/flow-step";
import SystemObject from "./system-description/system-object";
import Connection from "./system-description/connection";
import Subsystem from "./system-description/subsystem";
import PossibleHarm from "./mishap-victim-identification/possible-harm";

export interface SystemDescription {
    kinds: SystemObject[];
    roles: SystemObject[];
    relators: SystemObject[];
    systemObjectConnections: Connection[];
    subsystems: Subsystem[];
}

export interface SystemModel extends SystemDescription {
    currentStep: FlowStepId;
    lastCompletedStep: FlowStepId;
    possibleHarms: PossibleHarm[];
};

export function createObjectId(prefix: string) {
    return `${prefix}-${new Date().getTime()}`;
}
