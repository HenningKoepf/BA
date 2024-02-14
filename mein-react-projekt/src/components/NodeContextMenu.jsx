import React, {useCallback, useState} from 'react';
import { useReactFlow } from 'reactflow';
import Inputform from './Inputform';

/**
 * Öffnet ein Kontextmenü bei Rechtsklick auf einen Knoten um diesen zu
 * einem Endzustand zu machen
 * einem Startzustand zu machen
 * zu löschen
 * einen neuen Knoten zu erzeugen
 * @param id
 * @param top
 * @param left
 * @param right
 * @param bottom
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function NodeContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  ...props
}) {
  const { getNode, setNodes, addNodes, setEdges } = useReactFlow();
  const newHandlerId = Math.random();

  /**
   * Funktion um einen neuen Knoten mit eigenen Handlers für neue Edges zu erstellen.
   * Einzige möglichkeit um neue Knoten auf dem Pane und dem DOM hinzuzufügen
   * @type {(function(): void)|*}
   */
  const duplicateNode = useCallback(() => {
    const node = getNode(id);
    const position = {
      x: node.position.x + 50,
      y: node.position.y + 50,

    };

    addNodes({ ...node, id: `${node.id}-copy`, position,
      handlerId: newHandlerId});
  }, [id, getNode, addNodes, newHandlerId]);

  /**
   * Knoten wird entfernt und jegliche damit zusammenhzängende Kanten werden aus dem DOM gelöscht
   * @type {(function(): void)|*}
   */

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));
    setEdges((edges) => edges.filter((edge) => edge.target !== id));
  }, [id, setNodes, setEdges]);

  /**
   * Funktion um einem Knoten den Zustand eines "Startzustandes" zu verpassen, inkl styling
   * @type {(function(): void)|*}
   */
  const changeToInputNode = useCallback(() => {
    setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === id){
            return {...node,  data: {...node.data, input: true} ,style: {backgroundColor: '#1ec212'},}
          }
          return node;
        })
    );
  }, [id, setNodes]);

  /**
   * Funktion um einem Knoten den Zustand eines "Endzustandes" zu verpassen, inkl styling
   * @type {(function(): void)|*}
   */

  const changeToOutputNode = useCallback(() => {
    setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === id){
            let text = node.data.label;
            return {...node ,targetPosition: 'left',
              style: {
                backgroundColor: '#12e81d',
                border: "2px solid black" ,
                borderStyle: "double",},
              sourcePosition: 'right',  data: { label: text, output: true }}
          }
          return node;
        })
    );
  }, [id, setNodes, getNode, addNodes]);


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

  /**
   * Funktion um einen Knoten umzubenennen, autom. rerendering über Callback
   * @type {(function(): void)|*}
   */
  const renameNode = useCallback(() => {
    /*
    TODO Inputform statt window.promt
*/
    const newLabel = window.prompt("Geben Sie den neuen Namen für den Knoten ein:", "");

    if (newLabel !== null) {
      setNodes((nodes) =>
          nodes.map((node) => {
            if (node.id === id) {
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
