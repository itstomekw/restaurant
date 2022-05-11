const fs = require("fs");
import {Request, Response} from "express";
import {Danie} from "./types/danie";

const PATH = "dane/menu.json";

export const getMenu = function (req: Request, resp: Response) {
    if (!fs.existsSync(PATH)) {
        resp.send("[]");
        return;
    }

    const menu = JSON.parse(fs.readFileSync(PATH));
    resp.send(JSON.stringify(menu));
};

export const createDanie = function (
    req: Request<null, null, Omit<Danie, "id">>,
    resp: Response
) {
    let menu: Danie[] = [];
    if (fs.existsSync(PATH)) {
        menu = JSON.parse(fs.readFileSync(PATH));
    }

    const id = (menu.length !== 0 ? menu[menu.length - 1].id : 0) + 1;

    const danie: Danie = {
        id,
        ...req.body,
    };

    menu.push(danie);

    fs.writeFileSync(PATH, JSON.stringify(menu));

    resp.send(JSON.stringify({success: true}));
};

export const updateDanie = function (
    req: Request<{id: string}, null, Omit<Danie, "id">>,
    resp: Response
) {
    const id = parseInt(req.params.id);

    let menu: Danie[] = [];
    if (fs.existsSync(PATH)) {
        menu = JSON.parse(fs.readFileSync(PATH));
    }

    if (!menu.find((danie) => danie.id === id)) {
        resp.status(404);
        resp.send(JSON.stringify({success: false}));
        return;
    }

    fs.writeFileSync(
        PATH,
        JSON.stringify(
            menu.map((danie) => {
                if (danie.id !== id) {
                    return danie;
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

export const deleteDanie = function (
    req: Request<{id: string}, null, null>,
    resp: Response
) {
    const id = parseInt(req.params.id);

    let menu: Danie[] = [];
    if (fs.existsSync(PATH)) {
        menu = JSON.parse(fs.readFileSync(PATH));
    }

    if (!menu.find((danie) => danie.id === id)) {
        resp.status(404);
        resp.send(JSON.stringify({success: false}));
        return;
    }

    fs.writeFileSync(
        PATH,
        JSON.stringify(menu.filter((danie) => danie.id !== id))
    );

    resp.send(JSON.stringify({success: true}));
};
