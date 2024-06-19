const express = require("express");
const { getNotes, addNotes, updateNotes, deleteNotes, getNotesById } = require("../controller/notesController");
const route = express.Router();

route.get("/notes", getNotes);
route.get("/notes/:id", getNotesById);
route.post("/notes", addNotes);
route.put("/notes/:id", updateNotes);
route.delete("/notes/:id", deleteNotes);

module.exports = route;