export interface Therm {
    node: string;
    date: Date;
    value: number;
}

export interface NodeConfig {
    min: number;
    max: number;
    redFrom: number;
    redTo: number;
    yellowFrom: number;
    yellowTo: number;
    minorTicks: number
}

export interface Node {
    id: number;
    nom: string;
    createdAt: Date;
    config: NodeConfig;
    temperatures: Temperature[];
}

export interface Temperature {
    date: Date;
    value: number;
}

export interface User {
    id: number;
    mail: string;
    limit: string;
    nodeIds: number[];
}
