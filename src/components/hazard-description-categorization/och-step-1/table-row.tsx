import React, { useState } from 'react';
import Hazard from '../../../entities/hazard-population/hazard';
import { TableRow, TableCell, Button } from '@material-ui/core';
import HazardId from '../../hazard-population/hazard-id';
import { HazardCategory } from '../../../entities/hazard-description-categorization/hazard-category';
import CategorizationWizard from './categorization-wizard';

interface Props {
    hazard: Hazard;
    hazardUpdated: (hazard: Hazard) => void;
}

const OchStep1TableRow: React.FC<Props> = (props) => {

    const [isCategorizing, setIsCategorizing] = useState(false);

    const updateCategory = (category: HazardCategory) => {
        setIsCategorizing(false);
        props.hazardUpdated({ ...props.hazard, ...{ category: category } });
    };

    return (
        <React.Fragment>
            <TableRow>
                <TableCell>
                    <HazardId hazard={props.hazard} />
                </TableCell>
                <TableCell>{props.hazard.description}</TableCell>
                <TableCell>
                    {props.hazard.category ? props.hazard.category : '-'}
                </TableCell>
                <TableCell>
                    <Button variant='outlined' onClick={() => setIsCategorizing(true)}>
                        Categorize
                </Button>
                </TableCell>
            </TableRow>
            {isCategorizing ? 
                <TableRow>
                    <TableCell colSpan={4}>
                        <CategorizationWizard
                            cancel={() => setIsCategorizing(false)}
                            complete={updateCategory}
                        />
                    </TableCell>
                </TableRow>
                :
                undefined}
        </React.Fragment>
    );
};

export default OchStep1TableRow;
