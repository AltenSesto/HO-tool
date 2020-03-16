import { SystemDescriptionEntity } from "./system-description/system-description-entity";
import { FlowStepId } from "./meny/flow-step";

export interface SystemModel {
    currentStep: FlowStepId;
    lastCompletedStep: FlowStepId;
    systemDescription: SystemDescriptionEntity[];
};
