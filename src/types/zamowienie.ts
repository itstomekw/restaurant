export enum Status {
    Zlozone = 'zlozone',
    WRealizacji = 'wRealizacji',
    Zrealizowane = 'zrealizowane',
    Rachunek = 'rachunek'
}

export interface Zamowienie {
    id: number;
    pracownikId: number;
    pozycje: number[];
    status: Status;
    stolikId: number;
    kwota: number;
}