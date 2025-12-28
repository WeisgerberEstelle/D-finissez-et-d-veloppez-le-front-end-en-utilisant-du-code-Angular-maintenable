export interface Participation {
    id: number;
    year: number;
    city: string;
    medalsCount: number;
    athleteCount: number;
}

export interface Olympic {
    id: number;
    country: string;
    participations: Participation[];
}

export interface Stat {
    label: string;
    value: number;
}

export interface ChartItem {
    label: number|string;
    value: number;
}