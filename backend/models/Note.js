import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            default: "",
        },
        content: {
            type: String,
            required: true,
        },
        color: {
            type: String,
            default: "#ffffff",
        },
        isArchived: {
            type: Boolean,
            default: false,
        },
        isTrashed: { 
            type: Boolean, 
            default: false 
        },
         trashedAt: {
             type: Date 
        }, 
    },
    { timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);

export default Note;
