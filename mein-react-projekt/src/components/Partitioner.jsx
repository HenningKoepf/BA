import React, { useEffect, useState } from 'react';
import { useReactFlow } from 'reactflow';



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
        console.log("Found Target Sate for :" + node.data.label + " mit " + symbol + " zu " + edge.target );
        return edge.source === node.data.label && übergänge.includes(symbol); // Sicherstellen, ob die Quelle und das Symbol übereinstimmen
    });

    return edge ? edge.target : null;
}

/**
 * Durchläuft alle Partitionen, um die Partition zu finden, die den Zielzustand der enthält
 * @param targetLabel
 * @param partitions
 * @returns {*}
 */
function findPartitionForState(targetLabel, partitions) {
    console.log("Suche nach:", targetLabel);
    return partitions.find(partition => {
        console.log("Partition:", partition.map(node => node.data.label));
        return partition.some(node => {
            const match = node.data.label === targetLabel;
            console.log("Vergleiche:", node.data.label, targetLabel, "Übereinstimmung:", match);
            return match;
        });
    });
}
/*

function findPartitionForState(targetLabel, partitions) {
    return partitions.find(partition => partition.some(node => node.data.label === targetLabel));
}
 */

/**
 * Ausgabeformatierung der Partitionen
 * @param partitions
 * @returns {*}
 */
const formatPartitions = (partitions) => {
    return partitions.map(partition =>
        partition.map(node => node.data.label).join(' ')
    ).join(' | ');
};

/**
 * Hier findet die eigentliche Logik der Partitionstabelle statt
 * @param nodes
 * @param edges
 * @param alphabet
 * @returns {[*,*]}
 */

/*

function refinePartitions(nodes, edges, alphabet, partitions, setPartitions) {
    // Initialisiere Partitionen mit Endzuständen und Nicht-Endzuständen
    //let partitions = initialPartition(nodes);

    let changed = true;
    while (changed) {
        //erst wenn sich noch etwas verändert hat,changed => true, wird weitergearbeitet.
        changed = false;
        //initalisieurng für diese Schleife
        let newPartitions = [];

        //For-Schleife über alle Partitionen
        partitions.forEach(partition => {
            let partitionMap = new Map();
            //For-Schleife über alle Knoten dieser Partition
            partition.forEach(node => {
                // Sammle alle Übergänge für die aktuelle Node
                let symbolsForNode = new Set();
                //For- Schleife für alle Kanten dieses Knotens
                edges.forEach(edge => {
                    if (edge.source === node.id) {
                        edge.label.split(/[\s,;]+/).forEach(symbol => symbolsForNode.add(symbol));
                    }
                });
                console.log("Node ID: " + node.id + " mit Label: " + node.data.label);
                console.log(symbolsForNode);

                //For-Schleife für alle Übergangssymbole dieser Kante
                symbolsForNode.forEach(symbol => {

                    const target = findTargetState(node, symbol, edges);
                    console.log('Knoten ' + node.data.label + ' mit Übergang: ' + symbol + "zu: " + target );
                    const targetPartition = findPartitionForState(target, partitions);
                    const partitionKey = targetPartition
                        ? targetPartition.map(n => n.label).sort().join(',')
                        : 'Müllzustand';

                    if (!partitionMap.has(partitionKey)) {
                        partitionMap.set(partitionKey, new Set ());
                    }
                    //evtl direkt bei den nodes partitionieren, benefit für späteres ansteuern bei GUI
                    partitionMap.get(partitionKey).add(node);
                });
            });

            partitionMap.forEach(subPartition => {
                newPartitions.push(subPartition);
            });
        });
        //Vorherige größe der Partitionen speichern
        const prevPartitionsLength = partitions.length;
        console.log(partitions);
        console.log(newPartitions);
        setPartitions(newPartitions);
        // Überprüfen, ob sich die Anzahl der Partitionen geändert hat

            console.log("Else bereich hat changed auf: ")
            // Zusätzlich überprüfen, ob die Inhalte der Partitionen sich geändert haben
            changed = partitions.every((partition, index) => {
                return partition.length === newPartitions[index].length &&
                    partition.every((node, nodeIndex) => { return node === newPartitions[index][nodeIndex];
                });
            });
            console.log(changed + " gesetz.")

    }
    return partitions;
}
 */
 function refinePartitions(nodes, edges, alphabet, partitions, setPartitions) {
     //let partitions = initialPartition(nodes);
    console.log("start refining partitions");

    let changed = true;
    while (changed) {
        changed = false;
        let newPartitions = [];

        partitions.forEach(partition => {
            let partitionMap = new Map();
            console.log("for each partition");

            partition.forEach(node => {
                console.log("for each node")
                let symbolsForNode = new Set();
                edges.forEach(edge => {
                    if (edge.source === node.id) {
                        edge.label.split(/[\s,;]+/).forEach(symbol => symbolsForNode.add(symbol));
                    }
                });

                symbolsForNode.forEach(symbol => {
                    console.log("for each transition");
                    const target = findTargetState(node, symbol, edges);
                    const targetPartition = findPartitionForState(target, partitions);
                    const partitionKey = targetPartition
                        ? targetPartition.map(n => n.data.label).sort().join(',')
                        : 'Müllzustand';

                    if (!partitionMap.has(partitionKey)) {
                        partitionMap.set(partitionKey, new Set());
                    }
                    partitionMap.get(partitionKey).add(node);
                    console.log(node.data.label + " übergang: " + symbol);
                });
            });

            // Konvert Sets in Arrays,für newPartitions
            partitionMap.forEach(subPartitionSet => {
                //array zum
                const subPartitionArray = Array.from(subPartitionSet);
                newPartitions.push(subPartitionArray);
            });
        });


        // Überprüfen, ob sich die Anzahl der Partitionen geändert hat
        const prevPartitionsLength = partitions.length;
        if (prevPartitionsLength !== newPartitions.length) {
            changed = true;
        } else {
            // Zusätzlich überprüfen, ob die Inhalte der Partitionen sich geändert haben
            changed = !partitions.every((partition, index) => {
                return partition.length === newPartitions[index].length &&
                    partition.every((node, nodeIndex) => node === newPartitions[index][nodeIndex]);
            });
        }

        // Aktualisiere partitions für den nächsten Durchlauf
       partitions = newPartitions;

    }

    // Aktualisiere den globalen State nur nach Abschluss der Schleife

    return partitions;
}



const Partitioner = ({ isDfaResult, nodes, edges, alphabet , partitions, setPartitions}) => {

// wenn der DFA kein DFA ist, dann wird auch nix minimiert, State kommt direkt als prop
if (isDfaResult != true){
    return <p>Der Automat ist kein DFA und kann nicht minimiert werden. </p>;
}
else{
    const refinedPartitions = refinePartitions(nodes,edges, alphabet, partitions, setPartitions);
    const formattedPartitions = formatPartitions(refinedPartitions);
    return (
        <>
            <h2>DFA Partitionen</h2>
            <p>{formattedPartitions}</p>
        </>
    );
}

}

export default Partitioner;