import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        unique: [true, 'Title already exists']
    },
    content: {
        type: String,
        required: [true, 'Content is required']
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Owner is required']
    }
}, { timestamps: true });

const noteModel = mongoose.model('Note', noteSchema);


export default noteModel;