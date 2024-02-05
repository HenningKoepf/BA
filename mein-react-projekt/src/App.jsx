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

    //State Listener
    const [edgemenu, setEdgeMenu] = useState(null);
    const [menu, setMenu] = useState(null);
    const [nodeBg, setNodeBg] = useState('#eee');
    const [isDfaResult, setIsDfaResult, onChange] = useState(null);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const [alphabet, setAlphabet] = useState(['a', 'b', 'c']);
    /**
     * Refs für die einzelnen Komponenten, damit kan nich dynamisch auf die Größenänderungen reagieren
     * @type {{current: (unknown|null)}}
     */
    const ref = useRef(null);
    const kontrollContainerRef = useRef(null);
    const topTextRef = useRef(null);

    /**
     * Beim Klick auf das Canvas sollen alle Menüs geschlossen werden
     * @type {(function(): void)|*}
     */
    const onPaneClick = useCallback(() => {
        setMenu(null); // Set das Menu zurück
        setEdgeMenu(null); // Setz das edgeMenu zurück
    }, [setMenu, setEdgeMenu]);


    /**
     * Erzeugt das Kontextmenü für Kanten
     * @type {(function(*, *): void)|*}
     */

    //Kante umbenennen und löschen
    const onEdgeContextMenu = useCallback((event,edge) => {
        // Kein normales Kontextmenü
        event.preventDefault();
                //Koordinaten de clicks
                const clickX = event.clientX;
                const clickY = event.clientY;

                //Größe des Kontainers daneben
                const kontrollContainer = kontrollContainerRef.current.getBoundingClientRect();
                const kontrollContainerWidth = kontrollContainer.width;
                const pane = ref.current.getBoundingClientRect();

                const topText = topTextRef.current.getBoundingClientRect();
                const topTextHeight = topText.height;

                const left = Math.min(clickX- kontrollContainerWidth , pane.width - kontrollContainerWidth - 200); // Begrenze die linke Position entsprechend der Breite des .Kontrollcontainer
                const top = Math.min(clickY -topTextHeight, pane.height -topTextHeight - 200);

            setEdgeMenu({
                id: edge.id,
                top: top,
                left: left,
                right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
                bottom:
                    event.clientY >= pane.height - 200 && pane.height - event.clientY,
            });
        },
        [setEdgeMenu],
    );

    /**
     * Erzeugen einer Kante, wenn von einer Source Handle per DragnDrop zu einer TargetHandle gezogen wurde
     * Erzeugt
     * @type {(function(*): void)|*}
     */

    const onConnect = useCallback(
        (params) => {
            if ( params.source == params.target){
                const newEdge = {
                    id: `edge-${params.source}-${params.target}`,
                    source: params.source,
                    target: params.target,
                    label: "self", // Fügen Sie das Label dem Edge-Objekt hinzu
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
    /**
     * Öffnet das Kontextmenü der Knoten
     * @type {(function(*, *): void)|*}
     */
//Kontextmenü der Knoten


    const onNodeContextMenu = useCallback(
        (event, node) => {
            // Kein normales Kontextmenü
            event.preventDefault();

            //Koordinaten de clicks
            const clickX = event.clientX;
            const clickY = event.clientY;

            const pane = ref.current.getBoundingClientRect();

            //Größe des Kontainers daneben
            const kontrollContainer = kontrollContainerRef.current.getBoundingClientRect();
            const kontrollContainerWidth = kontrollContainer.width;

            const topText = topTextRef.current.getBoundingClientRect();
            const topTextHeight = topText.height;

            // Sicherstellen, dass das Menü nicht neben dem Fenster gerendert wrid
            const left = Math.min(clickX- kontrollContainerWidth , pane.width - kontrollContainerWidth - 200); // Begrenze die linke Position entsprechend der Breite des .Kontrollcontainer
            const top = Math.min(clickY -topTextHeight, pane.height -topTextHeight - 200);

            setMenu({
                id: node.id,
                left,
                top,
            });
        },
        [setMenu],
    );

    /**
     * Der Klick auf den Prüfbutton erzeugt eine Prüfinstanz auf DFA Konformitat und setzt den Wert, so das neu gerendert wird
     */

    const checkIsDFA = () => {
        setIsDfaResult((prev) => null);
        const result = isDFA(nodes, edges, alphabet);
        setIsDfaResult(result);

    };

    /**
     * Genau ein Startzustand: Es wird sichergestellt, dass genau ein Startzustand vorhanden ist.
     * Validität der Kantenlabels: Es wird überprüft, ob alle Kantenlabels gültige Symbole des Alphabets enthalten.
     * Eindeutigkeit der Übergänge: Für jedes Symbol in jedem Zustand darf es höchstens einen Übergang geben.
     * Erreichbarkeit aller Zustände: Alle Zustände müssen vom Startzustand aus erreichbar sein.
     * @param nodes
     * @param edges
     * @param alphabet
     * @returns {boolean}
     */

    function isDFA(nodes, edges, alphabet) {
        if (!nodes || !edges || !alphabet) {
            console.error('Einer der Inputs (nodes, edges, alphabet) ist nicht richtig definiert.');
            return false;
        }

        // Gibt es genau einen Startzustand
        const startStates = nodes.filter(node => node.type === 'input');
        if (startStates.length !== 1) {
            console.error("Es muss genau einen Startzustand geben.");
            alert("Startzustand ist nicht eindeutig");
            return false;
        }
        const startStateId = startStates[0].id; //Breitensuche aufsetzpunkt
        const transitions = new Map();

        // Initialisieren der Transitions Map mit leeren Sets
        nodes.forEach(node => {
            alphabet.forEach(symbol => {
                const key = `${node.id}-${symbol}`;
                transitions.set(key, new Set());
            });
        });
        const stateLabels = new Set(); // Ein Set, um eindeutige Labels zu speichern

        for (const node of nodes) {
            if (stateLabels.has(node.data.label)) {
                // Wenn das Label bereits im Set ist, gibt es einen Konflikt
                console.error(`Mehrere Zustände mit dem Label '${node.data.label}' gefunden.`);
                alert(`Es ist kein DFA. Mehrere Zustände mit dem Label '${node.data.label}' gefunden.`);
                return false;
            }
            stateLabels.add(node.data.label); // Füge das Label zum Set hinzu
        }

        // Verarbeiten der Kanten und Überprüfen der Symbole gegen das Alphabet
        for (const edge of edges) {

            const symbols = edge.label.split(/[,;\s]\s*/).map(symbol => symbol.trim());
                /*
                Ünterstützt mehrere Symbole pro Kante, Trennung mit , oder ; oder Leerzeichen möglich
                 */

            for (const symbol of symbols) {
                if (!alphabet.includes(symbol)) {
                    // Symbol nicht im Alphabet, daher kein gültiger DFA
                    console.error(`Ungültiges Symbol '${symbol}' in Kante '${edge.id}' gefunden.`);
                    alert(`Es ist kein DFA. Ungültiges Symbol '${symbol}' in Kante '${edge.id}' gefunden.`);

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
                alert(`Es ist kein DFA. Ungültiges Symbol beim Knoten '${key}' `);
                console.error(`Ungültiges Symbol beim Knoten '${key}' gefunden.`);
                // Mehr als ein Übergang für ein Symbol in einem Zustand gefunden das wid kein DFA sein

                return false;
            }
        }

        //Sind alle Zustände vom Startzustand erreichbar
        let visited = new Set();
        let queue = [startStateId];
        while (queue.length > 0) {
            const currentState = queue.shift();
            if (!visited.has(currentState)) {
                visited.add(currentState);
                edges.forEach(edge => {
                    if (edge.source === currentState && !visited.has(edge.target)) {
                        queue.push(edge.target);
                    }
                });
            }
        }

        if (visited.size !== nodes.length) {
            alert("Nicht alle Zustände sind erreichbar.");
            return false;
        }
        return true; // Der Automat ist ein DFA (wir implizieren Müllzustände))
    }

    /**
     * Aktualisieren des aktuell akzeptiereten Alphabets
     * @param newAlphabet
     */
    const [inputAlphabet, setInputAlphabet] = useState(alphabet.join(', '));
    const handleAlphabetInput = (e) => {
        setInputAlphabet(e.target.value);
        updateAlphabet(e.target.value);
    }
    const updateAlphabet = (inputValue) => {
        const newAlphabet = inputValue.split(/[;,]\s*|\s+/).map(symbol => symbol.trim()).filter((symbol, index, array) => array.indexOf(symbol) === index);
        setAlphabet(newAlphabet);
    };




    return (
      <>
     <div className="toptext" ref={topTextRef} >D F A ---  M I N I M I E R E R ! </div>

          <div className="App"
          style={{ width: '100vw', height: '60vw' }}>

              <div className="Kontrollcontainer" ref={kontrollContainerRef}>
                  <legend><strong>Eingabe: </strong></legend>
                  <div>
                      <label>Alphabet bearbeiten:</label>
                      <input
                          type="text"
                          value={inputAlphabet}
                          onInput={(e) => {handleAlphabetInput(e)}}
                      />
                      <div>Aktuelles Alphabet:</div>

                      <div className="alphabet">{`Σ = {${alphabet.join(', ')}}`}</div>

                  </div>
              <div className="DFAContainer">
                  <button onClick={checkIsDFA}>Ist das ein DFA?</button>
                  <div className={`DFAAnzeige ${isDfaResult !== null ? (isDfaResult ? 'true' : 'false') : ''}`}>
                         {isDfaResult !== null && (<div>{isDfaResult ? 'Ja' : 'Nein'}</div>)}
                  </div>
              </div>
          </div>
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
          <MiniMap pannable />
          <Background variant="dots" gap={15} size={1} />
            {menu && <NodeContextMenu onClick={onPaneClick} {...menu} />}
            {edgemenu && <EdgeContextMenu onClick={onPaneClick} {...edgemenu} />}
        </ReactFlow>

      </div>
          <footer>
              <p><strong>&copy; 2024 Henning Köpf</strong> - <strong>Kontakt:</strong> ************@gmx.de</p>
          </footer>
          </>

  );
}
export default App;




