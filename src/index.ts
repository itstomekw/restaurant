const express = require('express');
const bodyParser = require('body-parser');

import {Request, Response} from "express";
import {
    getRestauracje,
    createRestauracja,
    updateRestauracja,
    deleteRestauracja,
} from "./restauracje";
import {
    getRezerwacje,
    createRezerwacja,
    updateRezerwacja,
    deleteRezerwacja,
} from "./rezerwacje";
import {
    getPracownicy,
    createPracownik,
    updatePracownik,
    deletePracownik,
} from "./pracownicy";
import {getMenu, createDanie, updateDanie, deleteDanie} from "./menu";
import {
    getStoliki,
    createStolik,
    updateStolik,
    deleteStolik,
    raportStolikow,
} from "./stoliki";
import {
    getZamowienia,
    createZamowienie,
    updateZamowienie,
    deleteZamowienie
} from "./zamowienia";
import { getRaportKelnera } from "./raporty";

const app = express();
app.use(bodyParser.json());
app.use((_req: Request, resp: Response, next: Function) => {
    resp.setHeader("Content-Type", "application/json");
    next();
});

app.get("/restauracje", getRestauracje);
app.post("/restauracje", createRestauracja);
app.put("/restauracje/:id", updateRestauracja);
app.delete("/restauracje/:id", deleteRestauracja);
app.get("/rezerwacje", getRezerwacje);
app.post("/rezerwacje", createRezerwacja);
app.put("/rezerwacje/:id", updateRezerwacja);
app.delete("/rezerwacja/:id", deleteRezerwacja);
app.get("/pracownicy", getPracownicy);
app.post("/pracownicy", createPracownik);
app.put("/pracownicy/:id", updatePracownik);
app.delete("/pracownicy/:id", deletePracownik);
app.get("/menu", getMenu);
app.post("/menu", createDanie);
app.put("/menu/:id", updateDanie);
app.delete("/menu/:id", deleteDanie);
app.get("/stoliki", getStoliki);
app.post("/stoliki", createStolik);
app.put("/stoliki/:id", updateStolik);
app.delete("/stoliki/:id", deleteStolik);
app.get("/stoliki/raport", raportStolikow);
app.get("/zamowienia", getZamowienia);
app.post("/zamowienia", createZamowienie);
app.put("/zamowienia/:id", updateZamowienie);
app.delete("/zamowienia/:id", deleteZamowienie);
app.get("/raporty/kelner/:id", getRaportKelnera);

app.listen(3000);
