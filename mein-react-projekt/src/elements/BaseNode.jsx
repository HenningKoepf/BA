import React, { memo } from 'react';
import ReactFlow, { useReactFlow,} from 'reactflow';

const BaseNode = ({ data }) => {
    const { setNodes } = useReactFlow();
    return(
        <>
        <div className = {"basenode"} >
            {data.label}
        </div>
        </>
    );
};
export default BaseNode;