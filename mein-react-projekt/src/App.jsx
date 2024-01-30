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
import { initialNodes, initialEdges } from './elements/initial-setup';

import Inputform from './components/Inputform';


import { data } from "./data/data";
import ButtonEdge from './elements/ButtonEdge';

import NewNodeButton from './buttonfunctions';

const edgeTypes = {
    buttonedge: ButtonEdge,
};


function App() {


    const [menu, setMenu] = useState(null);
    const ref = useRef(null);
    const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  

  const onConnect = useCallback(
      (params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  
 

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




  return (
      <>
              <div className="toptext" >Hier Kommt das Titelbild hin! </div>

      <div className="App"
          style={{ width: '100vw', height: '100vh' }}>


        <ReactFlow
            ref={ref}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onPaneClick={onPaneClick}
            onConnect={onConnect}
            edgeTypes={edgeTypes}
            onNodeContextMenu = {onNodeContextMenu}

            fitView //Für den automatischen Fullscreen
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={15} size={1} />
            {menu && <NodeContextMenu onClick={onPaneClick} {...menu} />}
        </ReactFlow>


      </div>
      </>
  );
}
export default App;




