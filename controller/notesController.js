const { query } = require("../database/db");

const getNotes = async (req, res) => {
  try {
    const result = await query("SELECT * FROM notes");
    return res.status(200).json({ data: result });
  } catch (error) {
    console.error("Gagal mengambil notes:", error);
    return res.status(500).json({ message: "Gagal mengambil notes", error: error.message });
  }
};

const getNotesById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query("SELECT * FROM notes WHERE id = ?", [id]);
    if (result.length === 0) {
      return res.status(404).json({ message: "Notes tidak ditemukan" });
    }
    return res.status(200).json({ data: result });
  } catch (error) {
    console.error("Gagal mengambil notes:", error);
    return res.status(500).json({ message: "Gagal mengambil notes", error: error.message });
  }
};

const addNotes = async (req, res) => {
  const { title, datetime, note } = req.body;
  try {
    const queryStr = "INSERT INTO notes (title, datetime, note) VALUES (?, ?, ?)";
    const result = await query(queryStr, [title, datetime, note]);

    return res.status(200).json({
      message: "Penambahan notes berhasil",
      data: {
        id: result.insertId,
        title: title,
        datetime: datetime,
        note: note
      }
    });
  } catch (error) {
    console.error("Gagal menambahkan notes:", error);
    return res.status(500).json({ message: "Gagal menambahkan notes", error: error.message });
  }
};

const updateNotes = async (req, res) => {
    const { id } = req.params;
    const { title, datetime, note } = req.body;
    
    try {
        const existingNote = await query("SELECT * FROM notes WHERE id = ?", [id]);
        
        if (existingNote.length === 0) {
            return res.status(404).json({
                message: "Catatan tidak ditemukan"
            });
        }
        
        const updatedFields = {};
        if (title !== undefined && title !== existingNote[0].title) {
            updatedFields.title = title;
        }
        if (datetime !== undefined && datetime !== existingNote[0].datetime) {
            updatedFields.datetime = datetime;
        }
        if (note !== undefined && note !== existingNote[0].note) {
            updatedFields.note = note;
        }
        
        if (Object.keys(updatedFields).length === 0) {
            return res.status(200).json({
                message: "Tidak ada perubahan yang dilakukan pada catatan",
                data: existingNote[0]  
            });
        }

        const queryValues = [];
        let updateQuery = "UPDATE notes SET";
        

        Object.keys(updatedFields).forEach((key, index) => {
            updateQuery += ` ${key} = ?`;
            queryValues.push(updatedFields[key]);
            if (index < Object.keys(updatedFields).length - 1) {
                updateQuery += ",";
            }
        });
        
        updateQuery += " WHERE id = ?";
        queryValues.push(id);
    
        await query(updateQuery, queryValues);
        
        const updatedNote = await query("SELECT * FROM notes WHERE id = ?", [id]);
     
        return res.status(200).json({
            message: "Catatan berhasil diperbarui",
            data: updatedNote[0]  
        });
    } catch (error) {
        console.error("Gagal memperbarui catatan:", error);
        return res.status(500).json({
            message: "Gagal memperbarui catatan",
            error: error.message
        });
    }
};

  

const deleteNotes = async (req, res) => {
  const { id } = req.params;
  try {
    await query("DELETE FROM notes WHERE id = ?", [id]);
    return res.status(200).json({
      message: "Hapus notes berhasil"
    });
  } catch (error) {
    console.error("Gagal menghapus notes:", error);
    return res.status(500).json({ message: "Gagal menghapus notes", error: error.message });
  }
};

module.exports = {
  getNotes,
  getNotesById,
  addNotes,
  updateNotes,
  deleteNotes
};
