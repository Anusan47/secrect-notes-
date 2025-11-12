import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { NotesService } from './notes.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Request } from 'express';

@Controller('api/notes')
export class NotesController {
  constructor(private notesService: NotesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getActive(@Req() req: Request) {
    const user = (req as any).user;
    return this.notesService.findActiveByUser(user.id || user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req: Request, @Body() body) {
    const user = (req as any).user;
    return this.notesService.create(user.id || user._id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/permanent')
  async deletePermanent(@Param('id') id: string) {
    return this.notesService.deletePermanent(id);
  }
}
