import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Note extends Document {
  @Prop({ required: true }) title: string;
  @Prop() content: string;
  @Prop({ required: true }) userId: string;
  @Prop({ default: false }) isPinned: boolean;
  @Prop({ default: false }) isArchived: boolean;
  @Prop({ default: false }) isTrashed: boolean;
  @Prop() trashedAt: Date;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
