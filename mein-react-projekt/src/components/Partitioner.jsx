import React, { useEffect, useState } from 'react';
import { useReactFlow } from 'reactflow';



export const initialPartition = (nodes) => {
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
export function findTargetState(node, symbol, edges) {
    // Durchsuche alle Kanten, um Übereinstimmungen mit dem Symbol zu finden
    const edge = edges.find(edge => {
        const übergänge = edge.label.split(/[\s,;]+/); // Splitte das Label der Kante

        return edge.source === node.data.label && übergänge.includes(symbol); // Sicherstellen, ob die Quelle und das Symbol übereinstimmen
    });
    console.log("Found Target Sate for :" + node.data.label + " mit " + symbol + " zu " + edge.target );
    return edge ? edge.target : null;
}

/**
 * Durchläuft alle Partitionen, um die Partition zu finden, die den Zielzustand der enthält
 * @param targetLabel
 * @param partitions
 * @returns {*}
 */
export function findPartitionForState(targetLabel, partitions) {
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
        if (partitions.length > 15){
            changed = false;
        }

    }

    // Aktualisiere den globalen State nur nach Abschluss der Schleife

    return partitions;
}



/*

const Partitioner = ({ isDfaResult, nodes, edges, alphabet , partitions, setPartitions,triggerCalculation, resetTrigger }) => {


// wenn der DFA kein DFA ist, dann wird auch nix minimiert, State kommt direkt als prop
if (isDfaResult != true){
    return (
        <p>Prüfung auf DFA noch nicht abgeschlossen... </p>
    );

}
else{
    const refinedPartitions = refinePartitions(nodes,edges, alphabet, partitions, setPartitions);
    const formattedPartitions = formatPartitions(refinedPartitions);
    return (
        <>
            <h2>Partitionen</h2>
            <p>{formattedPartitions}</p>
        </>
    );
}


}
 */
const Partitioner = ({ isDfaResult, nodes, edges, alphabet, partitions, setPartitions,triggerCalculation, setTriggerCalculation }) => {

    const handleCalculateClick = () => {
        setTriggerCalculation(true); // Setzt den Trigger für die Berechnung
    };

    useEffect(() => {
        if (triggerCalculation) {
            if (isDfaResult) {

                const refinedPartitions = refinePartitions(nodes, edges, alphabet, partitions);
                setPartitions(refinedPartitions); // Aktualisiert die Partitionen im übergeordneten Zustand
            }
            setTriggerCalculation(false); //keine erneute berechnung bei
        }
    }, [triggerCalculation]);

    if (isDfaResult !== true) {
        <button onClick={handleCalculateClick}>Berechnung auslösen</button>
        return
        <p>
            Die DFA Prüfung ist nicht abgeschlosse
            Startpartitionen:
        </p>;
    } else {
        return (
            <>
                <button onClick={handleCalculateClick}>Berechnung lösen</button>
                <h2>Partitionen</h2>
            </>
        );
    }
};

export default Partitioner;



 /*

 //Vl doch eher die Version mit zuerst die Idee,
  über alle Partitionen zu iterieren, für jede Partition die Übergangssymbole zu sammeln und
   dann zu prüfen, ob alle Zustände, die bei einem bestimmten Symbol zu einem Zielzustand übergehen,
    in die gleiche Partition übergehen.
    Falls ein Zielzustand nicht gefunden wird (Müllzustand),
    sollte dies nicht automatisch zur Erstellung einer neuen Partition führen.
 function minimizeDFA(states, edges, partitions) {
    let changed = true;
    while (changed) {
        changed = false;
        let newPartitions = [];

        partitions.forEach(partition => {
            // Sammle alle Symbole, die in dieser Partition vorkommen
            let symbols = new Set();
            partition.forEach(state => {
                edges.forEach(edge => {
                    if (edge.source === state.id) {
                        edge.label.split(/[\s,;]+/).forEach(symbol => symbols.add(symbol));
                    }
                });
            });

            // Überprüfe für jedes Symbol, ob die Zustände in der Partition konsistent sind
            symbols.forEach(symbol => {
                let targetPartitionsMap = new Map();
                partition.forEach(state => {
                    const target = findTargetState(state, symbol, edges);
                    if (target !== null) { // Ignoriere Müllzustände
                        const targetPartition = findPartitionForState(target, partitions);
                        if (targetPartitionsMap.has(targetPartition)) {
                            targetPartitionsMap.get(targetPartition).push(state);
                        } else {
                            targetPartitionsMap.set(targetPartition, [state]);
                        }
                    }
                });

                // Wenn mehr als eine Ziel-Partition existiert, müssen wir eine neue Partition erstellen
                if (targetPartitionsMap.size > 1) {
                    targetPartitionsMap.forEach((partitionStates) => {
                        newPartitions.push(partitionStates);
                    });
                    changed = true;
                } else {
                    // Alle Zustände führen zu derselben Partition, also behalten wir die aktuelle Partition bei
                    newPartitions.push(partition);
                }
            });
        });

        if (changed) {
            partitions = newPartitions;
        }
    }

    return partitions;
}

function findTargetState(state, symbol, edges) {
    // Findet den Zielzustand für einen gegebenen Zustand und ein Symbol
    // Diese Funktion bleibt unverändert
}

function findPartitionForState(target, partitions) {
    // Findet die Partition, zu der ein Zustand gehört
    // Diese Funktion bleibt unverändert
}

  */