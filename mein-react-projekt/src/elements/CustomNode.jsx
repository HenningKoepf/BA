import React from "react";
import { Handle, Position } from "react-flow-renderer";

const MyCustomNode = ({ data }) => {
    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                backgroundColor: "blue",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
            }}
        >
            <Handle type="target" position={Position.Top} style={{ borderRadius: "50%" }} />
            {data.label}
            <Handle type="source" position={Position.Bottom} style={{ borderRadius: "50%" }} />
        </div>
    );
};

export default MyCustomNode;
