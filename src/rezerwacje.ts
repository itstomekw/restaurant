const fs = require('fs');
import {Request, Response} from 'express';
import { Rezerwacja } from './types/rezerwacja';
import { Stolik } from './types/stolik';

const PATH = 'dane/rezerwacje.json';
const STOLIKI_PATH = 'dane/stoliki.json';

export const getRezerwacje = function(req: Request, resp: Response) {
    if(!fs.existsSync(PATH)) {
        resp.send('[]');
        return;
    }

    const rezerwacje: Rezerwacja[] = JSON.parse(fs.readFileSync(PATH));
    const stoliki: Stolik[] = JSON.parse(fs.readFileSync(STOLIKI_PATH));

    resp.send(JSON.stringify(rezerwacje.map(({stolikId, ...rezerwacja}) => {
        const stolik = stoliki.find(stolik => stolik.id === stolikId);

        return {
            ...rezerwacja,
            stolik
        };
    })));
}

export const createRezerwacja = function(req: Request<null, null, Omit<Rezerwacja, 'id'>>, resp: Response) {
    let rezerwacje: Rezerwacja[] = [];
    if(fs.existsSync(PATH)) {
        rezerwacje = JSON.parse(fs.readFileSync(PATH));
    }
    
    const id = (rezerwacje.length !== 0 ? rezerwacje[rezerwacje.length - 1].id : 0) + 1;

    const rezerwacja: Rezerwacja = {
        id,
        ...req.body
    }

    rezerwacje.push(rezerwacja);

    fs.writeFileSync(PATH, JSON.stringify(rezerwacje));

    resp.send(JSON.stringify({success: true}));
}

export const updateRezerwacja = function(req: Request<{id: string}, null, Omit<Rezerwacja, 'id'>>, resp: Response) {
    const id = parseInt(req.params.id);
    
    let rezerwacje: Rezerwacja[] = [];
    if(fs.existsSync(PATH)) {
        rezerwacje = JSON.parse(fs.readFileSync(PATH));
    }

    if(!rezerwacje.find(rezerwacja => rezerwacja.id === id)) {
        resp.status(404);
        resp.send(JSON.stringify({success: false}));
        return;
    }

    fs.writeFileSync(PATH, JSON.stringify(rezerwacje.map(rezerwacja => {
        if(rezerwacja.id !== id) {
            return rezerwacja;
        }

        return {
            id,
            ...req.body
        };
    })));

    resp.send(JSON.stringify({success: true}));
}

export const deleteRezerwacja = function(req: Request<{id: string}, null, null>, resp: Response) {
    const id = parseInt(req.params.id);
    
    let rezerwacje: Rezerwacja[] = [];
    if(fs.existsSync(PATH)) {
        rezerwacje = JSON.parse(fs.readFileSync(PATH));
    }

    if(!rezerwacje.find(rezerwacja => rezerwacja.id === id)) {
        resp.status(404);
        resp.send(JSON.stringify({success: false}));
        return;
    }

    fs.writeFileSync(PATH, JSON.stringify(rezerwacje.filter(rezerwacja => rezerwacja.id !== id)));

    resp.send(JSON.stringify({success: true}));
}