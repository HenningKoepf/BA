import React, { useEffect, useState } from 'react';

const initialPartition = (nodes) => {
    const endStates = nodes.filter(node => node.data.output);
    const nonEndStates = nodes.filter(node => !node.data.output);
    return [nonEndStates, endStates];
};

/**
 * Splitted das Label der Kante auf um einzelne übergänge zu betrachten
 * @param node
 * @param symbol
 * @param edges
 * @returns {*|null}
 */
function findTargetState(node, symbol, edges) {
    // Durchsuche alle Kanten, um Übereinstimmungen mit dem Symbol zu finden
    const edge = edges.find(edge => {
        const übergänge = edge.label.split(/[\s,;]+/); // Splitte das Label der Kante
        return edge.source === node.data.label && übergänge.includes(symbol); // Prüfe, ob die Quelle und das Symbol übereinstimmen
    });

    return edge ? edge.target : null;
}

function findPartitionForState(targetLabel, partitions) {
    // Durchläuft alle Partitionen, um die zu finden, die den Zielzustand enthält
    return partitions.find(partition => partition.some(node => node.data.label === targetLabel));
}

const formatPartitions = (partitions) => {
    return partitions.map(partition =>
        partition.map(node => node.data.label).join(' ')
    ).join(' | ');
};

function refinePartitions(nodes, edges, alphabet) {
    let partitions = initialPartition(nodes);

    let newPartitions = [];

    partitions.forEach(partition => {
        let partitionMap = new Map();

        partition.forEach(node => {
            // Sammle alle Übergänge für die aktuelle Node
            let symbolsForNode = new Set();
            edges.forEach(edge => {
                if (edge.source === node.data.label) {
                    edge.label.split(/[\s,;]+/).forEach(symbol => symbolsForNode.add(symbol));
                }
            });
            console.log(node.data.label);
            console.log(symbolsForNode);

            symbolsForNode.forEach(symbol => {
                const target = findTargetState(node, symbol, edges);
                console.log('Knoten ' + node.data.label + ' mit Übergang: ' + symbol + "zu: " + target );
                const targetPartition = findPartitionForState(target, partitions);
                const partitionKey = targetPartition
                    ? targetPartition.map(n => n.label).sort().join(',')
                    : 'Müllzustand';

                if (!partitionMap.has(partitionKey)) {
                    partitionMap.set(partitionKey, []);
                }
                partitionMap.get(partitionKey).push(node);
            });
        });


        partitionMap.forEach(subPartition => {
            newPartitions.push(subPartition);

        });

    });

    partitions = newPartitions;
    console.log(partitions);

    //cheating on the formatting
    partitions = partitions.map(partition => {
        const uniqueNodes = Array.from(new Set(partition.map(node => node.data.label)))
            .map(label => partition.find(node => node.data.label === label));
        return uniqueNodes;
    });

    return partitions;
}

/*

function refinePartitions(nodes, edges, alphabet) {
    // Initialisiere Partitionen mit Endzuständen und Nicht-Endzuständen
    let partitions = initialPartition(nodes);

    let changed = true;
    while (changed) {
        changed = false;
        let newPartitions = [];

        partitions.forEach(partition => {
            let partitionMap = new Map(); // Map, um Knoten nach Zielpartitionen zu gruppieren

            partition.forEach(node => {
                alphabet.forEach(symbol => {
                    //wohin geht der Übergang
                    const target = findTargetState(node, symbol, edges);
                    //liegt das Ziel in eienr andreen Partition, wenn ja , welche
                    const targetPartition = findPartitionForState(target, partitions);

                    const partitionKey = targetPartition
                        ? targetPartition.map(n => n.label).sort().join(',')
                        : 'Müllzustand';


                  //  const partitionKey = targetPartition.map(n => n.label).sort().join(',');


                    if (!partitionMap.has(partitionKey)) {
                        partitionMap.set(partitionKey, []);

                    }
                    partitionMap.get(partitionKey).push(node);
                });
            });
            // Wenn eine Partition in mehrere Teile aufgeteilt wird, markiere Änderung als true
            if (partitionMap.size > 1) {
                changed = true;
            }
            partitionMap.forEach(subPartition => {
                newPartitions.push(subPartition);
            });
        });

        partitions = newPartitions;
    }

    return partitions;
}
*/


const Partitioner = ({ isDfaResult, nodes, edges, alphabet }) => {
// wenn der DFA kein DFA ist, dann wird auch nix minimiert, State kommt direkt aus der App.jsx
if (isDfaResult != true){
    return <p>Der Automat ist kein DFA und kann nicht minimiert werden. </p>;
}
else{
    //cheated on the formatting

    const formattedPartitions = formatPartitions(refinePartitions(nodes,edges, alphabet));
    return (
        <>
            <h2>DFA Partitionen</h2>
            <p>{formattedPartitions}</p>
        </>
    );
}

}

export default Partitioner;