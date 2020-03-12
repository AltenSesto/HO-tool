interface FlowStep {
    id: string;
    label?: string;
    children?: FlowStep[];
    helpText?: string;
}

export default FlowStep;
