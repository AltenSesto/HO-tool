import React from 'react';
import { IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';

interface Props {
    click: () => void;
}

const DeleteElementButton: React.FC<Props> = (props) => {

    return (
        <IconButton
            size='small'
            title="Delete"
            onClick={props.click}
        >
            <Delete />
        </IconButton>
    );
};

export default DeleteElementButton;
