import userModel from '../models/user.model.js';
import noteModel from '../models/note.model.js';


export async function getAllUsers(req, res) {
    try {
        const users = await userModel.find({ role: 'user' });

        res.status(200).json({ 
            message: 'All users fetched successfully',
            users
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export async function deleteAnyNote(req, res) {
    try {
        const { noteId } = req.params;

        const note = await noteModel.findByIdAndDelete(noteId);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.status(200).json({ message: 'Note deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}