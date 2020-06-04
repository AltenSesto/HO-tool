import { FlowStepId } from "./flow-step-id";

export const OUT_OF_FLOW = -1;

export function getFirstStepId() {
    return FlowStepId.SDF_1;
};

export function getFlowStepOrder(step: FlowStepId): number {
    switch (step) {
        case FlowStepId.SDF_1:
            return 1;
        case FlowStepId.SDF_2:
            return 2;
        case FlowStepId.SDF_3:
            return 3;
        case FlowStepId.SDF_4:
            return 4;
        case FlowStepId.OHI_2:
            return 5;
        case FlowStepId.OHI_3:
            return 6;
        case FlowStepId.OCH_1:
            return 7;
        case FlowStepId.OCH_2:
            return 8;
        default:
            return OUT_OF_FLOW;
    }
};

export const flow = [
    {
        id: FlowStepId.OHI, label: 'Identify Hazards', children: [
            {
                id: FlowStepId.OHI_1, label: 'Modelling', children: [
                    { id: FlowStepId.SDF_1, label: 'Step 1', helpText: 'Identify the <i>kind</i> and <i>role</i> objects explicitly presented in the system description.' },
                    { id: FlowStepId.SDF_2, label: 'Step 2', helpText: 'For each <i>kind</i> object obtained in SDF-Step&nbsp;1, identify all the roles it can play, considering the system description.' },
                    { id: FlowStepId.SDF_3, label: 'Step 3', helpText: 'For each <i>role</i> object obtained in SDF-Step&nbsp;1 and SDF-Step&nbsp;2, identify the relator that connects this role, and specify all the other roles connected by the identified relator, considering the system description and the analysts&apos; expertise.' },
                    { id: FlowStepId.SDF_4, label: 'Step 4', helpText: 'For each <i>role</i> object obtained in SDF-Step&nbsp;1, SDF-Step&nbsp;2 and SDF-Step&nbsp;3, identify all the <i>kind</i> objects that can play the role, considering the system description.' },
                ]
            },
            {
                id: FlowStepId.OHI_2, label: 'Identify Victims', helpText: 'Go through all the <i>roles</i> presented in the HO-style model and analyze if the roles are not supposed to but have the potential to encounter harms. Furthermore, the analysts continue with identifying possible harms that can affect the victims, including but not limited to, physical damages, chemical injuries, fatal illness, explosion, etc.'
            },
            {
                id: FlowStepId.OHI_3, label: 'Identify Hazards', helpText: 'Identify the hazardous situations that are likely to harm the identified mishap victims. Occurrence of a mishap is the manifestation of the <i>harm truthmaker</i> dispositions that characterize the <i>hazard element</i> roles in a hazardous situation. '
            },
        ]
    },
    {
        id: FlowStepId.OCH, label: 'Identify Causes', children: [
            {
                id: FlowStepId.OCH_1, label: 'Categorize', helpText: 'Categorize all the hazard descriptions into four categories, in terms of <b>Hazard</b>, <b>Initiating Condition</b>, <b>Initiating Event</b>, and/or <b>Mishap</b> based on the set of heuristic questions.'
            },
            {
                id: FlowStepId.OCH_2, label: 'Expand', helpText: 'Expand the categorized hazard description, taking both the expertise of analysts and the system description into consideration. '
            },
            {
                id: FlowStepId.OCH_3, label: 'Identify Causes', children: []
            },
        ]
    },
    {
        id: FlowStepId.SARE, label: 'Safety Requirements', children: [
            {
                id: FlowStepId.SARE_1, label: 'Evaluate Severity', children: []
            },
            {
                id: FlowStepId.SARE_2, label: 'Evaluate Probability', children: []
            },
            {
                id: FlowStepId.SARE_3, label: 'Safety Requirements', children: []
            },
        ]
    },
    {
        id: FlowStepId.CM, label: 'Control Mitigation', children: []
    }
];
