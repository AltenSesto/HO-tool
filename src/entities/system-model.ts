import { SystemDescriptionEntity } from "./system-description/system-description-entity";

// This will grow more complex as system evolves
export interface SystemModel {
    systemDescription: SystemDescriptionEntity[]
};
