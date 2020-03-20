import { FlowStepId } from "./meny/flow-step";
import SystemObject from "./system-description/system-object";
import Connection from "./system-description/connection";
import Subsystem from "./system-description/subsystem";
import MishapVictim from "./mishap-victim-identification/mishap-victim";

export interface SystemModel {
    currentStep: FlowStepId;
    lastCompletedStep: FlowStepId;
    kinds: SystemObject[];
    roles: SystemObject[];
    relators: SystemObject[];
    systemObjectConnections: Connection[];
    subsystems: Subsystem[];
    mishapVictims: MishapVictim[];
};
