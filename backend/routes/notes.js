import express from "express";
import Note from "../models/Note.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// ✅ Get all notes (active only)
router.get("/", verifyToken, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id, isArchived: false }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get archived notes
router.get("/archived", verifyToken, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id, isArchived: true }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Create new note
router.post("/", verifyToken, async (req, res) => {
  try {
    const newNote = new Note({ ...req.body, userId: req.user.id });
    const saved = await newNote.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update note (archive/unarchive/edit)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (note.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    const updated = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// // ✅ Delete note
// router.delete("/:id", verifyToken, async (req, res) => {
//   try {
//     const note = await Note.findById(req.params.id);
//     if (!note) return res.status(404).json({ message: "Note not found" });

//     if (note.userId.toString() !== req.user.id)
//       return res.status(403).json({ message: "Not authorized" });

//     await Note.findByIdAndDelete(req.params.id);
//     res.json({ message: "Note deleted" });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });
// PUT /notes/trash/:id

// PUT /notes/:id/trash
router.put("/:id/trash", async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { isTrashed: true, trashedAt: new Date() },
      { new: true }
    );
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to move note to trash" });
  }
});

router.put("/notes/trash/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { isTrashed: true },
      { new: true }
    );
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: "Failed to move note to trash" });
  }
});

// GET /notes/trashed
router.get("/notes/trashed", async (req, res) => {
  const trashedNotes = await Note.find({ isTrashed: true });
  res.json(trashedNotes);
});

// PUT /notes/restore/:id
router.put("/notes/restore/:id", async (req, res) => {
  const note = await Note.findByIdAndUpdate(
    req.params.id,
    { isTrashed: false },
    { new: true }
  );
  res.json(note);
});

// DELETE /notes/permanent/:id
router.delete("/notes/permanent/:id", async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ message: "Note permanently deleted" });
});

// ✅ Get all trashed notes
router.get("/trash", async (req, res) => {
  try {
    const notes = await Note.find({ isTrashed: true }).sort({ trashedAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Failed to load trashed notes" });
  }
});

// ✅ Restore note
router.put("/:id/restore", async (req, res) => {
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
router.delete("/:id/permanent", async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note permanently deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to permanently delete note" });
  }
});


export default router;
