const stepsOrder: {
    [key: string]: number
} = {
    'SDF-1': 1,
    'SDF-2': 2,
    'SDF-3': 3,
    'SDF-4': 4,
};

export const Flow = [
    {
        id: 'OHI', label: 'Identify Hazards', children: [
            {
                id: 'OHI-1', label: 'Modelling', children: [
                    { id: 'SDF-1', label: 'Step 1', helpText: 'Identify the <i>kind</i> and <i>role</i> objects explicitly presented in the system description.' },
                    { id: 'SDF-2', label: 'Step 2', helpText: 'For each <i>kind</i> object obtained in SDF-Step&nbsp;1, identify all the roles it can play, considering the system description.' },
                    { id: 'SDF-3', label: 'Step 3', helpText: 'For each <i>role</i> object obtained in SDF-Step&nbsp;1 and SDF-Step&nbsp;2, identify the relator that connects this role, and specify all the other roles connected by the identified relator, considering the system description and the analysts&apos; expertise.' },
                    { id: 'SDF-4', label: 'Step 4', helpText: 'For each <i>role</i> object obtained in SDF-Step&nbsp;1, SDF-Step&nbsp;2 and SDF-Step&nbsp;3, identify all the <i>kind</i> objects that can play the role, considering the system description.' },
                ]
            },
            { id: 'OHI-2', label: 'Identify Victims', children: [] },
            { id: 'OHI-3', label: 'Identify Hazards', children: [] },
        ]
    },
    {
        id: 'OCH', label: 'Identify Causes', children: [
            { id: 'OCH-1', label: 'Categorize', children: [] },
            { id: 'OCH-2', label: 'Expand', children: [] },
            { id: 'OCH-3', label: 'Identify Causes', children: [] },
        ]
    },
    {
        id: 'SARE', label: 'Safety Requirements', children: [
            { id: 'SARE-1', label: 'Evaluate Severity', children: [] },
            { id: 'SARE-2', label: 'Evaluate Probability', children: [] },
            { id: 'SARE-3', label: 'Safety Requirements', children: [] },
        ]
    },
    { id: '4', label: 'Control Mitigation', children: [] }
];

export function getFirstStepId() {
    return Object.keys(stepsOrder).find(e => stepsOrder[e] === 1) as string;
};

export function getStepIndex(key: string) {
    return stepsOrder[key];
}
