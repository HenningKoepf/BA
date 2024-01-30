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

export const initialNodes: Node[] = [
    {
        id: 'button-1',
        type: 'input',
        data: { label: 'Button Edge 1' },
        position: { x: 100, y: 50 },
    },
    {
        id: 'button-2',
        data: { label: 'Button Edge 2' },
        position: { x: 300, y: 50 },
    },
    {
        id: 'button-3',
        data: { label: 'Button Edge 3' },
        position: { x: 100, y: 250 },
    },
    {
        id: 'button-4',
        data: { label: 'Button Edge 4' },
        position: { x: 300, y: 250 },
    },
    {
        id: 'button-5',
        data: { label: 'Button Edge 5' },
        position: { x: 500, y: 150 },
    },
];

export const initialEdges: Edge[] = [
    {
        id: 'edge-1-2',
        source: 'button-1',
        target: 'button-2',
        type: 'buttonedge',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-2-3',
        source: 'button-2',
        target: 'button-3',
        type: 'buttonedge',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-3-4',
        source: 'button-3',
        target: 'button-4',
        type: 'buttonedge',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-4-5',
        source: 'button-4',
        target: 'button-5',
        type: 'buttonedge',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
];

export default { initialNodes, initialEdges };