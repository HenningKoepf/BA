import {
    Node, MarkerType

} from 'reactflow';



export const initialNodes: Node[] = [
    {
        id: 'input',
        type: 'input',
        style: {backgroundColor: '#1ec212'},
        data: { label: 'Z0: Input' },
        position: { x: 100, y: 50 },
        sourcePosition: 'right',
    },
    {
        id: 'Zustand 1',
        data: { label: 'Zustand 1' },
        position: { x: 300, y: 50 },
        targetPosition: 'left',
        sourcePosition: 'right',
    },
    {
        id: 'Zustand 2',
        data: { label: 'Zustand 2' },
        position: { x: 100, y: 250 },
        targetPosition: 'left',
        sourcePosition: 'right',
    },
    {
        id: 'Zustand 3',
        data: { label: 'Zustand 3' },
        position: { x: 300, y: 250 },
        targetPosition: 'left',
        sourcePosition: 'right',
    },
    {
        id: 'Endzustand',
        data: {label: 'Z4: Output' },
        style: {backgroundColor: '#9c12c2'},
        position: { x: 500, y: 150 },
        targetPosition: 'left',
        type: 'output',
    },
];

export const initialEdges: Edge[] = [
    {
        id: 'edge-1-2',
        source: 'input',
        target: 'Zustand 1',

        label: 'a',
       
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-2-3',
        source: 'Zustand 1',
        target: 'Zustand 2',
        label: 'a',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-3-4',
        source: 'Zustand 2',
        target: 'Zustand 3',
        label: 'a',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-4-5',
        source: 'Zustand 3',
        target: 'Endzustand',
        label: 'b',
        markerEnd: { type: MarkerType.ArrowClosed },
    },

    {
        id: 'edge-self',
        label: 'a' ,
        source: 'Zustand 3',
        target: 'Zustand 3',
        type: 'selfconnecting',
        markerEnd: { type: MarkerType.ArrowClosed },
    }
];

const initalData = {
    initialNodes,
    initialEdges,
};

export default initalData;