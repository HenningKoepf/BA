import React, {useCallback, useState} from 'react';
import { useReactFlow } from 'reactflow';


export default function EdgeContextMenu({
                                            id,
                                            top,
                                            left,
                                            right,
                                            bottom,
                                            ...props
                                        }) {
    const { getEdge, setEdge, addEdges, setEdges } = useReactFlow();




    const deleteEdge = useCallback(() => {
        setEdges((edges) => edges.filter((edge) => edge.id !== id));
    }, [id, setEdges]);

    const renameEdge = useCallback((edgeId) => {
        /*
        TODO: Inputform statt window.prompt
        */
        const newLabel = window.prompt("Geben Sie den neuen Namen für die Kante ein:", "");

        if (newLabel !== null) {
            setEdges((edges) =>
                edges.map((edge) => {
                    if (edge.id === id) { // Vergleich mit welcher ID?
                        return {
                            ...edge,
                            
                                label: newLabel,

                        };
                    }
                    return edge;
                })
            );
        }
    }, [setEdges]);




    return (
        <div
            style={{ top, left, right, bottom }}
            className="context-menu"
            {...props}
        >
            <p style={{ margin: '0.5em' }}>
                <small>node: {id}</small>
            </p>

            <button onClick ={deleteEdge}>Kante Löschen</button>
            <button onClick ={renameEdge}>Umbenennen</button>

        </div>
    );
}
