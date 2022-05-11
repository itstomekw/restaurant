const fs = require("fs");
import {Request, Response} from "express";
import {Stolik} from "./types/stolik";
import {Rezerwacja} from "./types/rezerwacja";

const PATH = "dane/stoliki.json";
const REZERWACJE_PATH = "dane/rezerwacje.json";

export const getStoliki = function(req: Request, resp: Response) {
    if (!fs.existsSync(PATH)) {
        resp.send("[]");
        return;
    }

    const stoliki = JSON.parse(fs.readFileSync(PATH));
    resp.send(JSON.stringify(stoliki));
};

export const createStolik = function(
    req: Request<null, null, Omit<Stolik, "id">>,
    resp: Response
) {
    let stoliki: Stolik[] = [];
    if (fs.existsSync(PATH)) {
        stoliki = JSON.parse(fs.readFileSync(PATH));
    }

    const id = (stoliki.length !== 0 ? stoliki[stoliki.length - 1].id : 0) + 1;

    const stolik: Stolik = {
        id,
        ...req.body,
    };

    stoliki.push(stolik);

    fs.writeFileSync(PATH, JSON.stringify(stoliki));

    resp.send(JSON.stringify({success: true}));
};

export const updateStolik = function(
    req: Request<{id: string}, null, Omit<Stolik, "id">>,
    resp: Response
) {
    const id = parseInt(req.params.id);

    let stoliki: Stolik[] = [];
    if (fs.existsSync(PATH)) {
        stoliki = JSON.parse(fs.readFileSync(PATH));
    }

    if (!stoliki.find((stolik) => stolik.id === id)) {
        resp.status(404);
        resp.send(JSON.stringify({success: false}));
        return;
    }

    fs.writeFileSync(
        PATH,
        JSON.stringify(
            stoliki.map((stolik) => {
                if (stolik.id !== id) {
                    return stolik;
                }

                return {
                    id,
                    ...req.body,
                };
            })
        )
    );

    resp.send(JSON.stringify({success: true}));
};

export const deleteStolik = function(
    req: Request<{id: string}, null, null>,
    resp: Response
) {
    const id = parseInt(req.params.id);

    let stoliki: Stolik[] = [];
    if (fs.existsSync(PATH)) {
        stoliki = JSON.parse(fs.readFileSync(PATH));
    }

    if (!stoliki.find((stolik) => stolik.id === id)) {
        resp.status(404);
        resp.send(JSON.stringify({success: false}));
        return;
    }

    fs.writeFileSync(
        PATH,
        JSON.stringify(stoliki.filter((stolik) => stolik.id !== id))
    );

    resp.send(JSON.stringify({success: true}));
};

export const raportStolikow = function(
    req: Request<{id: string}, null, null>,
    resp: Response
) {
    const id = parseInt(req.params.id);

    if (!fs.existsSync(REZERWACJE_PATH)) {
        resp.send("[]");
        return;
    }

    const stoliki: Stolik[] = JSON.parse(fs.readFileSync(PATH));
    const rezerwacje: Rezerwacja[] = JSON.parse(fs.readFileSync(REZERWACJE_PATH));

    resp.send(
        JSON.stringify(
            rezerwacje
                .filter((rezerwacja) => rezerwacja.stolikId === id)
                .map(({stolikId, ...rezerwacja}) => {
                    const stolik = stoliki.find(
                        (stolik) => stolik.id === stolikId
                    );

                    return {
                        ...rezerwacja,
                        stolik,
                    };
                })
        )
    );
};
