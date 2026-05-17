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