import {
    Node, MarkerType

} from 'reactflow';



export const initialNodes: Node[] = [
    {
        id: 'button-1',
        type: 'input',
        style: {backgroundColor: '#1ec212'},
        data: { label: 'Input' },
        position: { x: 100, y: 50 },
        sourcePosition: 'right',
    },
    {
        id: 'button-2',
        data: { label: 'Button Edge 2' },
        position: { x: 300, y: 50 },
        targetPosition: 'left',
        sourcePosition: 'right',
    },
    {
        id: 'button-3',
        data: { label: 'Button Edge 3' },
        position: { x: 100, y: 250 },
        targetPosition: 'left',
        sourcePosition: 'right',
    },
    {
        id: 'button-4',
        data: { label: 'Button Edge 4' },
        position: { x: 300, y: 250 },
        targetPosition: 'left',
        sourcePosition: 'right',
    },
    {
        id: 'Endzustand',
        data: {label: 'Z8, Ende' },
        style: {backgroundColor: '#9c12c2'},
        position: { x: 500, y: 150 },
        targetPosition: 'left',
        type: 'output',
    },
];

export const initialEdges: Edge[] = [
    {
        id: 'edge-1-2',
        source: 'button-1',
        target: 'button-2',

        label: 'a',
       
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-2-3',
        source: 'button-2',
        target: 'button-3',
        label: 'a',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-3-4',
        source: 'button-3',
        target: 'button-4',
        label: 'a',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-4-5',
        source: 'button-4',
        target: 'Endzustand',
        label: 'b',
        markerEnd: { type: MarkerType.ArrowClosed },
    },

    {
        id: 'edge-self',
        label: 'a' ,
        source: 'button-4',
        target: 'button-4',
        type: 'selfconnecting',
        markerEnd: { type: MarkerType.ArrowClosed },
    }
];

export default { initialNodes, initialEdges };