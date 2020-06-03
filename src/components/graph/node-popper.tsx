import React, { createRef, useState, useEffect, useCallback } from 'react';
import { Singular } from 'cytoscape';
import { makeStyles } from '@material-ui/core';
import Popper from 'popper.js';

interface Props {
    element: Singular;
    placement?: Popper.Placement
}

const useStyle = makeStyles(theme => ({
    popper: {
        zIndex: theme.zIndex.nodeAction
    }
}));

const EVENT_POSITION = 'position';
const EVENT_MOUSEUP = 'mouseup';

const NodePopper: React.FC<Props> = (props) => {
    const root = createRef<HTMLDivElement>();
    const [popper, setPopper] = useState<Popper | null>(null);

    const destroyPopper = useCallback(() => {
        if (popper) {
            props.element.off(EVENT_POSITION, undefined, popper.scheduleUpdate);
            props.element.off(EVENT_MOUSEUP, undefined, destroyPopper);
            popper.destroy();
            setPopper(null);
        }
    }, [popper, props.element]);

    useEffect(() => {
        if (root.current && !popper) {
            const popperObj = (props.element as any).popper({
                content: () => root.current,
                popper: {
                    placement: props.placement ? props.placement : 'top'
                }
            });
            props.element.on(EVENT_POSITION, popperObj.scheduleUpdate);
            props.element.on(EVENT_MOUSEUP, destroyPopper); // otherwise the popper will dislocate on mouseup
            setPopper(popperObj);
        }

        return destroyPopper;
    }, [root, popper, props.element, props.placement, destroyPopper]);

    const classes = useStyle();

    return <div ref={root} className={classes.popper}>{props.children}</div>;
};

export default NodePopper;
