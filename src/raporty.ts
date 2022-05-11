const fs = require('fs');
import {Request, Response} from 'express';
import { Zamowienie } from './types/zamowienie';

const ZAMOWIENIA_PATH = 'dane/zamowienia.json';

export const getRaportKelnera = function(
    req: Request<{id: string}, null, null>,
    resp: Response
) {
    const id = parseInt(req.params.id);

    let zamowienia: Zamowienie[] = [];
    if (fs.existsSync(ZAMOWIENIA_PATH)) {
        zamowienia = JSON.parse(fs.readFileSync(ZAMOWIENIA_PATH));
    }

    resp.send(
        JSON.stringify(zamowienia.filter(({pracownikId}) => pracownikId === id))
    );
};