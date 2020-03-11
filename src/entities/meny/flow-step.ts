interface FlowStep {
    id: string;
    label?: string;
    children?: FlowStep[];
}

export default FlowStep;
