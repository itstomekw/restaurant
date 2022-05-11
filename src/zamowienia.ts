const fs = require('fs');
import {Request, Response} from "express";
import {Zamowienie} from "./types/zamowienie";
import {Danie} from "./types/danie";

const PATH = "dane/zamowienia.json";
const MENU_PATH = "dane/menu.json";

export const getZamowienia = function(req: Request, resp: Response) {
    if (!fs.existsSync(PATH)) {
        resp.send("[]");
        return;
    }

    const zamowienia = JSON.parse(fs.readFileSync(PATH));
    resp.send(JSON.stringify(zamowienia));
};

export const createZamowienie = function(
    req: Request<
        null,
        null,
        Omit<Zamowienie, "id" | "kwota"> & {kwota?: number}
    >,
    resp: Response
) {
    let zamowienia: Zamowienie[] = [];
    let menu: Danie[] = [];

    if (fs.existsSync(PATH)) {
        zamowienia = JSON.parse(fs.readFileSync(PATH));
    }

    if (fs.existsSync(MENU_PATH)) {
        menu = JSON.parse(fs.readFileSync());
    }

    let kwota = req.body.kwota;
    if (!kwota) {
        kwota = req.body.pozycje.reduce((kwota, danieId) => {
            const danie: Danie = menu.find(({id}) => id === danieId)!;
            return kwota + danie.cena;
        }, 0);
    }

    const id =
        (zamowienia.length !== 0 ? zamowienia[zamowienia.length - 1].id : 0) +
        1;

    const zamowienie: Zamowienie = {
        id,
        kwota,
        ...req.body,
    };

    zamowienia.push(zamowienie);

    fs.writeFileSync(PATH, JSON.stringify(zamowienia));

    resp.send(JSON.stringify({success: true}));
};

export const updateZamowienie = function(
    req: Request<{id: string}, null, Omit<Zamowienie, "id">>,
    resp: Response
) {
    const id = parseInt(req.params.id);

    let zamowienia: Zamowienie[] = [];
    if (fs.existsSync(PATH)) {
        zamowienia = JSON.parse(fs.readFileSync(PATH));
    }

    if (!zamowienia.find((zamowienie) => zamowienie.id === id)) {
        resp.status(404);
        resp.send(JSON.stringify({success: false}));
        return;
    }

    fs.writeFileSync(PATH, JSON.stringify(zamowienia));

    resp.send(JSON.stringify({success: true}));
};

export const deleteZamowienie = function(
    req: Request<{id: string}, null, null>,
    resp: Response
) {
    const id = parseInt(req.params.id);

    let zamowienia: Zamowienie[] = [];
    if (fs.existsSync(PATH)) {
        zamowienia = JSON.parse(fs.readFileSync(PATH));
    }

    if (!zamowienia.find((zamowienie) => zamowienie.id === id)) {
        resp.status(404);
        resp.send(JSON.stringify({success: false}));
        return;
    }

    fs.writeFileSync(
        PATH,
        JSON.stringify(zamowienia.filter((zamowienie) => zamowienie.id !== id))
    );

    resp.send(JSON.stringify({success: true}));
};


