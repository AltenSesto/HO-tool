import React, { createRef, useState, useEffect } from 'react';
import { Singular } from 'cytoscape';
import { makeStyles } from '@material-ui/core';
import Popper from 'popper.js';

interface Props {
    element: Singular;
    placement?: Popper.Placement
}

const useStyle = makeStyles(() => ({
    popper: {
        zIndex: 100
    }
}));

const nodeEvent = 'position';

const NodePopper: React.FC<Props> = (props) => {
    const root = createRef<HTMLDivElement>();
    const [popper, setPopper] = useState<Popper | null>(null);

    useEffect(() => {
        if (root.current && !popper) {
            const popperObj = (props.element as any).popper({
                content: () => root.current,
                popper: {
                    placement: props.placement ? props.placement : 'top'
                }
            });
            props.element.on(nodeEvent, popperObj.scheduleUpdate);
            setPopper(popperObj);
        }

        return () => {
            if (popper) {
                props.element.off(nodeEvent, undefined, popper.scheduleUpdate);
                popper.destroy();
            }
        };
    }, [root, popper, props.element, props.placement]);

    const classes = useStyle();

    return <div ref={root} className={classes.popper}>{props.children}</div>;
};

export default NodePopper;
