import React from 'react';

/**
 * Exportiere die Labels der Knoten in einer anzeigbaren Komponente
 * @param nodes
 * @returns {JSX.Element}
 * @constructor
 */

const NodeLabelList = ({ nodes }) => {

    const nodeLabels = nodes.map((node) => node.data.label);

    return (
        <div>
            <h3>Zustände:</h3>
            <ul>
                {nodeLabels.map((label, index) => (
                    <li key={index}>{label}</li>
                ))}
            </ul>
        </div>
    );
};

export default NodeLabelList;