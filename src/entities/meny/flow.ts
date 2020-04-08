import { FlowStepId } from "./flow-step";

export const OUT_OF_FLOW = -1;

export const flowSteps: {[key: string]: FlowStepId} = {
    OHI: { name: 'OHI', order: OUT_OF_FLOW },
    OHI_1: { name: 'OHI-1', order: OUT_OF_FLOW },
    SDF_1: { name: 'SDF-1', order: 1 },
    SDF_2: { name: 'SDF-2', order: 2 },
    SDF_3: { name: 'SDF-3', order: 3 },
    SDF_4: { name: 'SDF-4', order: 4 },
    OHI_2: { name: 'OHI-2', order: 5 },
    OHI_3: { name: 'OHI-3', order: 6 },
    OCH: { name: 'OCH', order: OUT_OF_FLOW },
    OCH_1: { name: 'OCH-1', order: OUT_OF_FLOW },
    OCH_2: { name: 'OCH-2', order: OUT_OF_FLOW },
    OCH_3: { name: 'OCH-3', order: OUT_OF_FLOW },
    SARE: { name: 'SARE', order: OUT_OF_FLOW },
    SARE_1: { name: 'SARE-1', order: OUT_OF_FLOW },
    SARE_2: { name: 'SARE-2', order: OUT_OF_FLOW },
    SARE_3: { name: 'SARE-3', order: OUT_OF_FLOW },
    CM: { name: 'CM', order: OUT_OF_FLOW },
};

export const flow = [
    {
        id: flowSteps.OHI, label: 'Identify Hazards', children: [
            {
                id: flowSteps.OHI_1, label: 'Modelling', children: [
                    { id: flowSteps.SDF_1, label: 'Step 1', helpText: 'Identify the <i>kind</i> and <i>role</i> objects explicitly presented in the system description.' },
                    { id: flowSteps.SDF_2, label: 'Step 2', helpText: 'For each <i>kind</i> object obtained in SDF-Step&nbsp;1, identify all the roles it can play, considering the system description.' },
                    { id: flowSteps.SDF_3, label: 'Step 3', helpText: 'For each <i>role</i> object obtained in SDF-Step&nbsp;1 and SDF-Step&nbsp;2, identify the relator that connects this role, and specify all the other roles connected by the identified relator, considering the system description and the analysts&apos; expertise.' },
                    { id: flowSteps.SDF_4, label: 'Step 4', helpText: 'For each <i>role</i> object obtained in SDF-Step&nbsp;1, SDF-Step&nbsp;2 and SDF-Step&nbsp;3, identify all the <i>kind</i> objects that can play the role, considering the system description.' },
                ]
            },
            {
                id: flowSteps.OHI_2, label: 'Identify Victims', helpText: 'Go through all the <i>roles</i> presented in the HO-style model and analyze if the roles are not supposed to but have the potential to encounter harms. Furthermore, the analysts continue with identifying possible harms that can affect the victims, including but not limited to, physical damages, chemical injuries, fatal illness, explosion, etc.'
            },
            {
                id: flowSteps.OHI_3, label: 'Identify Hazards', helpText: 'Identify the hazardous situations that are likely to harm the identified mishap victims. Occurrence of a mishap is the manifestation of the <i>harm truthmaker</i> dispositions that characterize the <i>hazard element</i> roles in a hazardous situation. '
            },
        ]
    },
    {
        id: flowSteps.OCH, label: 'Identify Causes', children: [
            {
                id: flowSteps.OCH_1, label: 'Categorize', children: []
            },
            {
                id: flowSteps.OCH_2, label: 'Expand', children: []
            },
            {
                id: flowSteps.OCH_3, label: 'Identify Causes', children: []
            },
        ]
    },
    {
        id: flowSteps.SARE, label: 'Safety Requirements', children: [
            {
                id: flowSteps.SARE_1, label: 'Evaluate Severity', children: []
            },
            {
                id: flowSteps.SARE_2, label: 'Evaluate Probability', children: []
            },
            {
                id: flowSteps.SARE_3, label: 'Safety Requirements', children: []
            },
        ]
    },
    {
        id: flowSteps.CM, label: 'Control Mitigation', children: []
    }
];

export function getFirstStepId() {
    return flowSteps.SDF_1;
};
