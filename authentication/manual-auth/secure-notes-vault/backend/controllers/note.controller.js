import noteModel from '../models/note.model.js';


export async function createNote(req, res) {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const note = await noteModel.create({
            title,
            content,
            owner: req.user._id
        });

        res.status(201).json({ message: 'Note created successfully', note});
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}



export async function getMyNotes(req, res) {
    try {
        const notes = await noteModel.find({ owner: req.user._id });

        res.status(200).json({ message: 'All notes fetched successfully', notes });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export async function updateNote(req, res) {
    try {
        const { noteId } = req.params;

        const allowedFields = ['title', 'content'];

        const updates = {};

        Object.entries(req.body).forEach(([key, value]) => {
            if (allowedFields.includes(key) && value !== undefined) {
                updates[key] = value;
            }
        });

        const note = await noteModel.findByIdAndUpdate(
            noteId,
            { $set: updates },
            {
                new: true,
                runValidators: true
            }
        );

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.status(200).json({ message: 'Note updated successfully', note });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export async function deleteNote(req, res) {
    try {
        const { noteId } = req.params;

        const note = await noteModel.findByIdAndDelete(noteId);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.status(200).json({ message: 'Note deleted successfully' });
    }
    catch (error){
        res.status(500).json({ message: error.message });
    }
}