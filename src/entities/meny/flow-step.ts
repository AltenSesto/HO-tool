import { FlowStepId } from "./flow-step-id";

export interface FlowStep {
    id: FlowStepId;
    label?: string;
    children?: FlowStep[];
    helpText?: string;
}
