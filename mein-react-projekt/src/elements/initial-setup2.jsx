import {
    Node, MarkerType

} from 'reactflow';


export const initialNodes: Node[] = [

    {
        id: 'Z1',
        style: {backgroundColor: '#5a4eab'},
        data: { label: 'Z1' , input: true},
        position: { x: 100, y: 100 },
        sourcePosition: 'right',
        targetPosition: 'left',
    },
    {
        id: 'Z2',
        data: { label: 'Z2' },
        position: { x: 250, y: 50 },
        targetPosition: 'left',
        sourcePosition: 'right',
    },
    {
        id: 'Z3',
        data: { label: 'Z3' },
        position: { x: 250, y: 150 },
        targetPosition: 'left',
        sourcePosition: 'right',
    },
    {
        id: 'Z5',
        style: {
            backgroundColor: '#12e81d',
            border: "2px solid black" ,
            borderStyle: "double",
        },
        data: {label: 'Z5', output: true },
        position: { x: 500, y: 150 },
        targetPosition: 'left',
        sourcePosition: 'right'
    },
    {
        id: 'Z6',
        style: {
            backgroundColor: '#12e81d',
            border: "2px solid black" ,
            borderStyle: "double",
        },
        data: {label: 'Z6', output: true },
        position: { x: 500, y: 50 },
        targetPosition: 'left',
        sourcePosition: 'right'
    },
];


export const initialEdges: Edge[] = [

    {
        id: 'edge-1-2',
        source: 'Z1',
        target: 'Z2',
        label: 'a',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-1-3',
        source: 'Z1',
        target: 'Z3',
        label: 'b',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-3-5',
        source: 'Z3',
        target: 'Z5',
        label: 'a, b',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-2-6',
        source: 'Z2',
        target: 'Z6',
        label: 'a, b',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-self',
        label: 'a, b' ,
        source: 'Z5',
        target: 'Z5',
        type: 'selfconnecting',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-self',
        label: 'a b' ,
        source: 'Z6',
        target: 'Z6',
        type: 'selfconnecting',
        markerEnd: { type: MarkerType.ArrowClosed },
    },

];
