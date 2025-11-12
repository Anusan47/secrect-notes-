import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note } from '../schemas/note.schema';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Note.name) private noteModel: Model<Note>) {}

  async findActiveByUser(userId: string) {
    return this.noteModel.find({ userId, isArchived: false, isTrashed: false }).sort({ updatedAt: -1 });
  }

  async create(userId: string, dto: any) {
    const n = new this.noteModel({ ...dto, userId });
    return n.save();
  }

  async update(id: string, userId: string, dto: any) {
    const note = await this.noteModel.findById(id);
    if (!note) throw new NotFoundException('Note not found');
    Object.assign(note, dto);
    return note.save();
  }

  async softDelete(id: string, userId: string) {
    const note = await this.noteModel.findById(id);
    if (!note) throw new NotFoundException('Note not found');
    note.isTrashed = true;
    note.trashedAt = new Date();
    return note.save();
  }

  async deletePermanent(id: string) {
    return this.noteModel.findByIdAndDelete(id);
  }
}
