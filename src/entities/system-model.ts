import { SystemDescriptionEntity } from "./system-description/system-description-entity";

export interface SystemModel {
    currentStep: string;
    lastCompletedStep: string;
    systemDescription: SystemDescriptionEntity[];
};
