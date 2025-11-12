import express from "express";
import Note from "../models/Note.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// ✅ Get all active (non-archived, non-trashed) notes
router.get("/", verifyToken, async (req, res) => {
  try {
    const notes = await Note.find({
      userId: req.user.id,
      isArchived: false,
      isTrashed: false,
    }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get archived notes
router.get("/archived", verifyToken, async (req, res) => {
  try {
    const notes = await Note.find({
      userId: req.user.id,
      isArchived: true,
      isTrashed: false,
    }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Create a new note
router.post("/", verifyToken, async (req, res) => {
  try {
    const newNote = new Note({ ...req.body, userId: req.user.id });
    const saved = await newNote.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update (general edit)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    if (note.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    const updated = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ Archive note
router.put("/:id/archive", verifyToken, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    if (note.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    const updated = await Note.findByIdAndUpdate(
      req.params.id,
      { isArchived: true },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error archiving note" });
  }
});

// ✅ Unarchive note
router.put("/:id/unarchive", verifyToken, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    if (note.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    const updated = await Note.findByIdAndUpdate(
      req.params.id,
      { isArchived: false },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error unarchiving note" });
  }
});


// ✅ Move to Trash
router.put("/:id/trash", verifyToken, async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { isTrashed: true, trashedAt: new Date() },
      { new: true }
    );
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: "Failed to move note to trash" });
  }
});

// ✅ Get all trashed notes
router.get("/trash", verifyToken, async (req, res) => {
  try {
    const notes = await Note.find({
      userId: req.user.id,
      isTrashed: true,
    }).sort({ trashedAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Failed to load trashed notes" });
  }
});

// ✅ Restore from Trash
router.put("/:id/restore", verifyToken, async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { isTrashed: false, trashedAt: null },
      { new: true }
    );
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: "Failed to restore note" });
  }
});

// ✅ Permanently delete note
router.delete("/:id/permanent", verifyToken, async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note permanently deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to permanently delete note" });
  }
});

export default router;
