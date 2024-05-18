import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Response,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Request() req,
    @Response() res,
  ) {
    const payload = {
      ...createTaskDto,
      user: req.user._id,
    };
    const task = await this.tasksService.create(payload);
    return res.status(HttpStatus.CREATED).json({
      message: 'success',
      data: task,
    });
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAllForUser(@Request() req) {
    return this.tasksService.findAllForUser(req.user._id);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req, @Response() res) {
    await this.tasksService.remove(id, req.user._id);
    return res.status(HttpStatus.OK).json({
      message: 'success',
    });
  }
}
