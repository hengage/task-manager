import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { ITaskDocument, Task } from './schema/task.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TaskStatus } from 'src/constants';
import { AgendaService } from 'src/agenda/agenda.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<ITaskDocument>,
    @Inject(forwardRef(() => AgendaService))
    private readonly agendaService: AgendaService,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    const task = new this.taskModel(createTaskDto);
    this.agendaService.scheduleTaskOverdue(task.dueDate, task._id.toString());
    return await task.save();
  }

  findAllForUser(userId: string): Promise<ITaskDocument[]> {
    return this.taskModel
      .find({ user: userId })
      .select('-__v -updatedAt')
      .lean();
  }

  async findOne(id: string) {
    return await this.taskModel.findById(id);
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    // const select = Object.keys(updateTaskDto);

    return await this.taskModel
      .findByIdAndUpdate(id, { $set: updateTaskDto }, { new: true })
      .select('-__v -createdAt -updatedAt')
      .exec();
  }

  async remove(id: string, userId: string) {
    /**
     * Finds taks by user id and task id to make sure a task is only
     *  deleted by it's owner/creator.
     */
    const task = await this.taskModel
      .findOneAndDelete({ _id: id, user: userId })
      .exec();
    console.log({ task });

    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    return task;
  }

  async taskOverDue(id: string) {
    await this.taskModel.findByIdAndUpdate(
      id,
      { $set: { status: TaskStatus.OVERDUE } },
      { new: true },
    );
  }
}
