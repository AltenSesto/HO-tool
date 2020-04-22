import React, { useState } from 'react';
import { Card, CardHeader, IconButton, Button, Typography, CardContent, CardActions } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { HazardCategory } from '../../../entities/hazard-description-categorization/hazard-category';

interface Props {
    cancel: () => void;
    complete: (category: HazardCategory) => void;
}

enum IntermediateCategory {
    notSet,
    situation,
    event
}

const CategorizationWizard: React.FC<Props> = (props) => {

    const [category, setCategory] = useState(IntermediateCategory.notSet);

    let question: string;
    let instructions: JSX.Element | null = null;
    let actions: JSX.Element;

    switch (category) {
        case IntermediateCategory.notSet:
            question = 'Is the hazard description describing a situation (state of affairs) or an event?';
            instructions = (
                <React.Fragment>
                    <p>
                        Note that
                    </p>
                    <p>
                        1) if a hazard description describes that some event is supposed to occur but
                        does not, then the hazard description is regarded as a generic situation that
                        will not trigger the specific event, such as "the brake command is not issued",
                    </p>
                    <p>
                        and
                    </p>
                    <p>
                        2) if a hazard description describes a repetitive and continuous behavior, it 
                        can be regarded as a situation, such as "a train is running on the track".
                    </p>
                </React.Fragment>
            );
            actions = (
                <React.Fragment>
                    <Button
                        size='small'
                        variant='outlined'
                        onClick={() => setCategory(IntermediateCategory.situation)}
                    >
                        Situation
                    </Button>
                    <Button
                        size='small'
                        variant='outlined'
                        onClick={() => setCategory(IntermediateCategory.event)}
                    >
                        Event
                    </Button>
                </React.Fragment>
            );
            break;
        case IntermediateCategory.situation:
            question = 'Can the situation trigger mishaps when some dispositions in the situation are manifested ?';
            actions = (
                <React.Fragment>
                    <Button
                        size='small'
                        variant='outlined'
                        onClick={() => props.complete(HazardCategory.hazard)}
                    >
                        Yes &mdash; Hazard
                    </Button>
                    <Button
                        size='small'
                        variant='outlined'
                        onClick={() => props.complete(HazardCategory.initiatingCondition)}
                    >
                        No &mdash; Initiating Condition
                    </Button>
                </React.Fragment>
            );
            break;
        case IntermediateCategory.event:
            question = 'Can the event bring about severe injuries of people or damages to the environment?';
            actions = (
                <React.Fragment>
                    <Button
                        size='small'
                        variant='outlined'
                        onClick={() => props.complete(HazardCategory.mishap)}
                    >
                        Yes &mdash; Mishap
                    </Button>
                    <Button
                        size='small'
                        variant='outlined'
                        onClick={() => props.complete(HazardCategory.initiatingEvent)}
                    >
                        No &mdash; Initiating Event
                    </Button>
                </React.Fragment>
            );
            break;
        default:
            throw new Error('Unknown intermediate category');
    }

    return (
        <Card variant='outlined'>
            <CardHeader
                action={
                    <IconButton size='small' onClick={props.cancel}>
                        <Close />
                    </IconButton>
                }
                title={question}
            />
            {
                instructions ?
                    <CardContent>
                        <Typography variant='body2' component='div'>
                            {instructions}
                        </Typography>
                    </CardContent>
                    :
                    undefined
            }
            <CardActions>
                {actions}
            </CardActions>
        </Card>
    );
};

export default CategorizationWizard;
