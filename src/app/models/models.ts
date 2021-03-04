export interface Therm {
    node: string;
    date: Date;
    value: number;
}

export interface Node {
    id: number;
    nom: string;
    createdAt: Date;
    config: {
        min: number;
        max: number;
        redFrom: number;
        redTo: number;
        yellowFrom: number;
        yellowTo: number;
        minorTicks: number
    }
    temperatures: Temperature[];
}

export interface Temperature {
    date: Date;
    value: number;
}
