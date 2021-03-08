export interface TreeGraph {
    id: string;
    layoutOptions: {};
    children: GraphNode[];
    edges: TreeEdge[];
    width: number;
    height: number;
    isLocateMode: boolean;
}

export interface TreeObjectNode {
    nodeID: string;
    value: string;
    kind: string;
    parentID: string;
    didCollapse: boolean;
    ifParent: boolean;
    children: TreeObjectNode[];
    leadingMinutiae: any[];
    trailingMinutiae: any[];
    errorNode?: any;
    diagnostics: any[];
    position: Position;
    isNodePath?: any;
}

export interface GraphNode {
    id: string;
    x: number;
    y: number;
    label: string;
    nodeColor: string;
    ifParent: boolean;
    isCollapsible: boolean;
    kind: string;
    leadingMinutiae: Minutiae[];
    trailingMinutiae: Minutiae[];
    hasDiagnostics: boolean;
    diagnostics: Diagnostics[];
    width: number;
    height: number;
    position: Position;
    isNodePath: boolean;
}

export interface Minutiae {
    kind: string;
    minutiae: string;
    isInvalid: boolean;
}

export interface TreeEdge {
    id: string;
    sources: [];
    targets: [];
    sections: EdgeSections[];
    isNodePath: boolean;
}

export interface EdgeSections {
    id: string;
    startPoint: EdgeCoords;
    endPoint: EdgeCoords;
}

export interface EdgeCoords {
    x: number;
    y: number;
}

export interface Position {
    startLine: number;
    endLine: number;
    startColumn: number;
    endColumn: number;
}

export interface Diagnostics {
    message: string;
    diagnosticInfo: any[];
}

export interface PrimaryProps {
    treeGraph: TreeGraph;
    treeArray: TreeObjectNode[];
}

export interface SyntaxTreeProps {
    activatedCommand: string;
    onCollapseTree: (nodeID: string, representationType: boolean) => void;
    renderTree: () => Promise<PrimaryProps>;
    switchFullTree: () => Promise<PrimaryProps>;
}

export interface GraphicalTreeProps {
    onCollapseTree: (nodeID: string, representationType: boolean) => void;
    treeGraph?: TreeGraph;
}

export interface GraphicalNodeProps {
    node: GraphNode;
    isLocateAction: boolean;
    onCollapseTree: any;
}

export interface GraphicalDetailsProps {
    node: GraphNode;
}

export interface TreeEdgeProps {
    edge: TreeEdge;
    isLocateAction: boolean;
}

export interface DropdownTreeProps {
    treeNode: TreeObjectNode;
    onCollapseTree: (nodeID: string, representationType: boolean) => void;
}

export interface DropdownNodeProps {
    treeNode: TreeObjectNode;
    treeLevel: number;
    onClick: (nodeProp: TreeObjectNode) => void;
    onCollapseTree: (nodeID: string, representationType: boolean) => void;
}

export interface DropdownDetailsProps {
    treeNode: TreeObjectNode;
}

export interface DetailsCardProp {
    title: string;
    value: any;
}

export interface DetailsArrayCardProp {
    title: string;
    type: string;
    value: any[];
}
