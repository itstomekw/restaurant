const fs = require('fs');
import {Request, Response} from 'express';
import { Restauracja } from './types/restauracja';

const PATH = 'dane/restauracje.json';

export const getRestauracje = function(req: Request, resp: Response) {
    if(!fs.existsSync(PATH)) {
        resp.send('[]');
        return;
    }

    const restauracje = JSON.parse(fs.readFileSync(PATH));
    resp.send(JSON.stringify(restauracje));
}

export const createRestauracja = function(req: Request<null, null, Omit<Restauracja, 'id'>>, resp: Response) {
    let restauracje: Restauracja[] = [];
    if(fs.existsSync(PATH)) {
        restauracje = JSON.parse(fs.readFileSync(PATH));
    }
    
    const id = (restauracje.length !== 0 ? restauracje[restauracje.length - 1].id : 0) + 1;

    const restauracja: Restauracja = {
        id,
        ...req.body
    }

    restauracje.push(restauracja);

    fs.writeFileSync(PATH, JSON.stringify(restauracje));

    resp.send(JSON.stringify({success: true}));
}

export const updateRestauracja = function(req: Request<{id: string}, null, Omit<Restauracja, 'id'>>, resp: Response) {
    const id = parseInt(req.params.id);
    
    let restauracje: Restauracja[] = [];
    if(fs.existsSync(PATH)) {
        restauracje = JSON.parse(fs.readFileSync(PATH));
    }

    if(!restauracje.find(restauracja => restauracja.id === id)) {
        resp.status(404);
        resp.send(JSON.stringify({success: false}));
        return;
    }

    fs.writeFileSync(PATH, JSON.stringify(restauracje.map(restauracja => {
        if(restauracja.id !== id) {
            return restauracja;
        }

        return {
            id,
            ...req.body
        };
    })));

    resp.send(JSON.stringify({success: true}));
}

export const deleteRestauracja = function(req: Request<{id: string}, null, null>, resp: Response) {
    const id = parseInt(req.params.id);
    
    let restauracje: Restauracja[] = [];
    if(fs.existsSync(PATH)) {
        restauracje = JSON.parse(fs.readFileSync(PATH));
    }

    if(!restauracje.find(restauracja => restauracja.id === id)) {
        resp.status(404);
        resp.send(JSON.stringify({success: false}));
        return;
    }

    fs.writeFileSync(PATH, JSON.stringify(restauracje.filter(restauracja => restauracja.id !== id)));

    resp.send(JSON.stringify({success: true}));
}