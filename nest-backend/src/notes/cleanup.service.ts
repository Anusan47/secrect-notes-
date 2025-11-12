import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note } from './schemas/note.schema';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);
  constructor(@InjectModel(Note.name) private noteModel: Model<Note>) {}

  // run daily at midnight
  @Cron('0 0 * * *')
  async handleCron() {
    this.logger.log('Cleaning up old trashed notes...');
    const result = await this.noteModel.deleteMany({
      isTrashed: true,
      updatedAt: { $lte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
    this.logger.log(`Deleted ${result.deletedCount} old trashed notes.`);
  }
}
