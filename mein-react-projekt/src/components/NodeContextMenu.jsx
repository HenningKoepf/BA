import React, {useCallback, useState} from 'react';
import { useReactFlow } from 'reactflow';
import Inputform from './Inputform';

export default function NodeContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  ...props
}) {
  const { getNode, setNodes, addNodes, setEdges } = useReactFlow();
  const duplicateNode = useCallback(() => {
    const node = getNode(id);
    const position = {
      x: node.position.x + 50,
      y: node.position.y + 50,
    };

    addNodes({ ...node, id: `${node.id}-copy`, position });
  }, [id, getNode, addNodes]);



  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));
  }, [id, setNodes, setEdges]);

  const changeToInputNode = useCallback(() => {
    setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === id){
            return {...node,  style: {backgroundColor: '#1ec212'},type : 'input'}
          }
          return node;
        })
    );
  }, [id, setNodes]);

  const changeToOutputNode = useCallback(() => {
    setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === id){
            return {...node,  style: {backgroundColor: '#2912c2'},type : 'output'}
          }
          return node;
        })
    );
  }, [id, setNodes]);


  const colorNode = useCallback(() => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id){
          return {...node,  style: {backgroundColor: '#1ec212'},}
        }
      return node;
      })
     );
  }, [id, setNodes]);

  const renameNode = useCallback(() => {
    /*
    TODO Inputform statt window.promt
*/
    const newLabel = window.prompt("Geben Sie den neuen Namen für den Knoten ein:", "");

    if (newLabel !== null) {
      setNodes((nodes) =>
          nodes.map((node) => {
            if (node.id === id) {
              // Aktualisieren Sie das Label des gewünschten Knotens
              return {
                ...node,
                data: {
                  ...node.data,
                  label: newLabel,
                },
              };
            }
            return node;
          })
      );
    }
  }, [id, setNodes]);

  return (
    <div
      style={{ top, left, right, bottom }}
      className="context-menu"
      {...props}
    >
      <p style={{ margin: '0.5em' }}>
        <small>node: {id}</small>
      </p>
      <button onClick={duplicateNode}>Knoten verdoppeln </button>
      <button onClick={deleteNode}>Knoten Löschen</button>
      <button onClick ={renameNode}>Umbenennen</button>
      <button onClick={colorNode}>Einfärben</button>
      <button onClick = {changeToInputNode}>Zu Startzustand</button>
      <button onClick = {changeToOutputNode}>Zu Endzustand</button>

    </div>
  );
}
