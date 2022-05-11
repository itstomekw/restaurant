export enum Status {
    Wolny = 'wolny',
    Zajety = 'zajety',
    Niedostepny = 'niedostepny'
}

export interface Stolik {
    id: number;
    nazwa: string;
    iloscOsob: number;
    status: Status;
}

