import { FlowStepId } from "./meny/flow-step";
import SystemObject from "./system-description/system-object";
import Connection from "./system-description/connection";
import Subsystem from "./system-description/subsystem";
import PossibleHarm from "./mishap-victim-identification/possible-harm";

export interface SystemModel {
    currentStep: FlowStepId;
    lastCompletedStep: FlowStepId;
    kinds: SystemObject[];
    roles: SystemObject[];
    relators: SystemObject[];
    systemObjectConnections: Connection[];
    subsystems: Subsystem[];
    possibleHarms: PossibleHarm[];
};
