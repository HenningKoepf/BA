import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
    BaseEdge,
    Connection,
    ConnectionMode,

    Node, MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import './styles/styles.css'
import './updatenode.css';

import NodeContextMenu from './components/NodeContextMenu';
import EdgeContextMenu from './components/EdgeContextMenu';
import SelfConnectingEdge from './elements/SelfConnectingEdge';
import { initialNodes, initialEdges } from './elements/initial-setup';

import Inputform from './components/Inputform';



import { data } from "./data/data";
import ButtonEdge from './elements/ButtonEdge';
import NewNodeButton from './buttonfunctions';

const EdgeTypes = {
    buttonedge: ButtonEdge,
    selfconnecting: SelfConnectingEdge,

};


function App() {

    const [edgemenu, setEdgeMenu] = useState(null);
    const [menu, setMenu] = useState(null);
    const [nodeBg, setNodeBg] = useState('#eee');

    const ref = useRef(null);

    const onPaneClick = useCallback(() => {
        setMenu(null); // Set das Menu zurück
        setEdgeMenu(null); // Setz das edgeMenu zurück
    }, [setMenu, setEdgeMenu]);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [isDfaResult, setIsDfaResult, onChange] = useState(false);



    /*
      const onConnect = useCallback(
          (params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
    */

    //Kante umbenennen und löschen
    const onEdgeContextMenu = useCallback((event,edge) => {
        // Kein normales Kontextmenü
        event.preventDefault();

        const pane = ref.current.getBoundingClientRect();
            setEdgeMenu({
                id: edge.id,
                top: event.clientY < pane.height - 200 && event.clientY,
                left: event.clientX < pane.width - 200 && event.clientX,
                right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
                bottom:
                    event.clientY >= pane.height - 200 && pane.height - event.clientY,
            });
        },
        [setEdgeMenu],
    );

    const onConnect = useCallback(
        (params) => {
            if ( params.source == params.target){
                const newEdge = {
                    id: `edge-${params.source}-${params.target}`,
                    source: params.source,
                    target: params.target,
                    label: "selfc", // Fügen Sie das Label dem Edge-Objekt hinzu
                    type: "selfconnecting",
                    markerEnd: { type: MarkerType.ArrowClosed },
                };
                setEdges((edges) => [...edges, newEdge]);
            }
            else{

                const newEdge = {
                    id: `edge-${params.source}-${params.target}`,
                    source: params.source,
                    target: params.target,
                    label: "a", // Fügen Sie das Label dem Edge-Objekt hinzu
                    type: "default",
                    markerEnd: { type: MarkerType.ArrowClosed },
                };

                // Erstelle das Edge-Objekt mit dem Label

                // Aktualisiere die Edge-Liste
                setEdges((edges) => [...edges, newEdge]);
             }
            },
// Zwei Knoten werden per Drag and Drop verbunden
        [setEdges]
    );

//Kontextmenü der Knoten

    const onNodeContextMenu = useCallback(
        (event, node) => {
            // Kein normales Kontextmenü
            event.preventDefault();

            // Sicherstellen, dass das Menü nicht neben dem Fenster gerendert wrid
            const pane = ref.current.getBoundingClientRect();
            setMenu({
                id: node.id,
                top: event.clientY < pane.height - 200 && event.clientY,
                left: event.clientX < pane.width - 200 && event.clientX,
                right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
                bottom:
                    event.clientY >= pane.height - 200 && pane.height - event.clientY,
            });
        },
        [setMenu],
    );

    const alphabet = ['a', 'b'];

    const checkIsDFA = () => {
        const result = isDFA(nodes, edges, alphabet);
        setIsDfaResult(result);
        alert(`Ist das ein DFA? ${result ? 'Ja, es ist ein DFA.' : 'Nein, es ist kein DFA.'}`);
    };
    //überprüfen ob der Graph ein DFA ist

    function isDFA(nodes, edges, alphabet) {
        if (!nodes || !edges || !alphabet) {
            console.error('Einer der Inputs (nodes, edges, alphabet) ist undefined.');
            return false;
        }
        const transitions = new Map();

        // Initialisieren der Transitions Map mit leeren Sets
        nodes.forEach(node => {
            alphabet.forEach(symbol => {
                const key = `${node.id}-${symbol}`;
                transitions.set(key, new Set());
            });
        });

        // Verarbeiten der Kanten und Überprüfen der Symbole gegen das Alphabet
        for (const edge of edges) {
            const symbols = edge.label.split(',').map(symbol => symbol.trim()); // Unterstützt mehrere Symbole pro Kante
            for (const symbol of symbols) {
                if (!alphabet.includes(symbol)) {
                    // Symbol nicht im Alphabet, daher kein gültiger DFA
                    console.error(`Ungültiges Symbol '${symbol}' in Kante '${edge.id}' gefunden.`);
                    return false;
                }
                const key = `${edge.source}-${symbol}`;
                if (transitions.has(key)) {
                    transitions.get(key).add(edge.target);
                } else {
                    // Initialisiert einen neuen Set, falls noch nicht vorhanden
                    transitions.set(key, new Set([edge.target]));
                }
            }
        }

        // Überprüfen, ob es für jedes Symbol in jedem Zustand höchstens einen Übergang gibt
        for (let [key, targetStates] of transitions) {
            if (targetStates.size > 1) {
                // Mehr als ein Übergang für ein Symbol in einem Zustand gefunden das wid kein DFA sein
                return false;
            }
        }

        return true; // Der Automat ist ein DFA (wir implizieren Müllzustände))
    }



    // <div className="toptext" >D F A ---  M I N I M I E R E R ! </div>
  return (
      <>
      <div className="App"
          style={{ width: '100vw', height: '60vw' }}>
        <ReactFlow
            ref={ref}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onPaneClick={onPaneClick}
            onConnect={onConnect}
            edgeTypes={EdgeTypes}
            //nodeTypes={nodeTypes}
            onNodeContextMenu = {onNodeContextMenu}
            onEdgeContextMenu = {onEdgeContextMenu}
            fitView //Für den automatischen Fullscreen
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={15} size={1} />
            {menu && <NodeContextMenu onClick={onPaneClick} {...menu} />}
            {edgemenu && <EdgeContextMenu onClick={onPaneClick} {...edgemenu} />}
        </ReactFlow>
          <button onClick={checkIsDFA}>
              Ist das ein DFA?
          {isDfaResult !== null && <span>{isDfaResult ? 'True' : 'False'}</span>}
          </button>
      </div>
          </>

  );
}
export default App;




