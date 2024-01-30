import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
    Connection,
    EdgeTypes,
    Node, MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import './styles/styles.css'
import './updatenode.css';

import NodeContextMenu from './components/NodeContextMenu';
import EdgeContextMenu from './components/EdgeContextMenu';
import { initialNodes, initialEdges } from './elements/initial-setup';

import Inputform from './components/Inputform';



import { data } from "./data/data";
import ButtonEdge from './elements/ButtonEdge';
import NewNodeButton from './buttonfunctions';

const edgeTypes = {
    buttonedge: ButtonEdge,
};







function App() {

    const [edgemenu, setEdgeMenu] = useState(null);
    const [menu, setMenu] = useState(null);

    const ref = useRef(null);

    const onPaneClick = useCallback(() => {
        setMenu(null); // Set das Menu zurück
        setEdgeMenu(null); // Setz das edgeMenu zurück
    }, [setMenu, setEdgeMenu]);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
/*

  const onConnect = useCallback(
      (params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
 */

    //Verbindung zischen Knoten zu ziehen
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

            const label = "default";

            // Erstelle das Edge-Objekt mit dem Label
            const newEdge = {
                id: `edge-${params.source}-${params.target}`,
                source: params.source,
                target: params.target,
                label: "a", // Fügen Sie das Label dem Edge-Objekt hinzu
                type: "standard",
                markerEnd: { type: MarkerType.ArrowClosed },
            };

            // Aktualisiere die Edge-Liste
            setEdges((edges) => [...edges, newEdge]);
        },
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




             // <div className="toptext" >D F A ---  M I N I M I E R E R ! </div>
  return (
      <>
      <div className="App"
          style={{ width: '100vw', height: '70vw' }}>
        <ReactFlow
            ref={ref}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onPaneClick={onPaneClick}
            onConnect={onConnect}
            edgeTypes={edgeTypes}
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
      </div>
      </>
  );
}
export default App;




