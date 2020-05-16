import React from 'react';

import OpenFileButton from './open-file-button';
import DownloadFileButton from './download-file-button';
import NewFileButton from './new-file-button';

const Meny: React.FC = () => {

    return (
        <React.Fragment>
            <NewFileButton />
            <OpenFileButton />
            <DownloadFileButton />
        </React.Fragment>
    );
};

export default Meny
