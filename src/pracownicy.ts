const fs = require('fs');
import {Request, Response} from 'express';
import { Pracownik } from './types/pracownik';

const PATH = 'dane/pracownicy.json';

export const getPracownicy = function(req: Request, resp: Response) {
    if(!fs.existsSync(PATH)) {
        resp.send('[]');
        return;
    }

    const pracownicy = JSON.parse(fs.readFileSync(PATH));
    resp.send(JSON.stringify(pracownicy));
}

export const createPracownik = function(req: Request<null, null, Omit<Pracownik, 'id'>>, resp: Response) {
    let pracownicy: Pracownik[] = [];
    if(fs.existsSync(PATH)) {
        pracownicy = JSON.parse(fs.readFileSync(PATH));
    }
    
    const id = (pracownicy.length !== 0 ? pracownicy[pracownicy.length - 1].id : 0) + 1;

    const pracownik: Pracownik = {
        id,
        ...req.body
    }

    pracownicy.push(pracownik);

    fs.writeFileSync(PATH, JSON.stringify(pracownicy));

    resp.send(JSON.stringify({success: true}));
}

export const updatePracownik = function(req: Request<{id: string}, null, Omit<Pracownik, 'id'>>, resp: Response) {
    const id = parseInt(req.params.id);
    
    let pracownicy: Pracownik[] = [];
    if(fs.existsSync(PATH)) {
        pracownicy = JSON.parse(fs.readFileSync(PATH));
    }

    if(!pracownicy.find(pracownik => pracownik.id === id)) {
        resp.status(404);
        resp.send(JSON.stringify({success: false}));
        return;
    }

    fs.writeFileSync(PATH, JSON.stringify(pracownicy.map(pracownik => {
        if(pracownik.id !== id) {
            return pracownik;
        }

        return {
            id,
            ...req.body
        };
    })));

    resp.send(JSON.stringify({success: true}));
}

export const deletePracownik = function(req: Request<{id: string}, null, null>, resp: Response) {
    const id = parseInt(req.params.id);
    
    let pracownicy: Pracownik[] = [];
    if(fs.existsSync(PATH)) {
        pracownicy = JSON.parse(fs.readFileSync(PATH));
    }

    if(!pracownicy.find(pracownik => pracownik.id === id)) {
        resp.status(404);
        resp.send(JSON.stringify({success: false}));
        return;
    }

    fs.writeFileSync(PATH, JSON.stringify(pracownicy.filter(pracownik => pracownik.id !== id)));

    resp.send(JSON.stringify({success: true}));
}