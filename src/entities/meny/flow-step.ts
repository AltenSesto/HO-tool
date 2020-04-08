export interface FlowStep {
    id: FlowStepId;
    label?: string;
    children?: FlowStep[];
    helpText?: string;
}

export interface FlowStepId {
    name: string;
    order: number;
}
