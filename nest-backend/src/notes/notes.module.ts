import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Note, NoteSchema } from '../schemas/note.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]), JwtModule.register({ secret: process.env.JWT_SECRET || 'secret' })],
  providers: [NotesService],
  controllers: [NotesController]
})
export class NotesModule {}
