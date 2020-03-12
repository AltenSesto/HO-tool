const stepsOrder: {
    [key: string]: number
} = {
    'SDF-1': 1,
    'SDF-2': 2,
    'SDF-3': 3,
    'SDF-4': 4,
    'SDF-5': 5,
};

export const Flow = [
    {
        id: 'OHI', label: 'Identify Hazards', children: [
            {
                id: 'OHI-1', label: 'Modelling', children: [
                    { id: 'SDF-1', label: 'Step 1' },
                    { id: 'SDF-2', label: 'Step 2' },
                    { id: 'SDF-3', label: 'Step 3' },
                    { id: 'SDF-4', label: 'Step 4' },
                    { id: 'SDF-5', label: 'Step 5' },
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
    return <string>Object.keys(stepsOrder).find(e => stepsOrder[e] === 1);
};

export function getStepIndex(key: string) {
    return stepsOrder[key];
}
