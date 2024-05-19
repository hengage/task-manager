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

  /**
   * Creates a new task and schedules it for overdue checking.
   * @param createTaskDto - Data transfer object for creating a task.
   * @returns The created task document.
   */
  async create(createTaskDto: CreateTaskDto) {
    const task = new this.taskModel(createTaskDto);
    this.agendaService.scheduleTaskOverdue(task.dueDate, task._id.toString());
    return await task.save();
  }

  /**
   * Retrieves all tasks for a given user.
   * @param userId - The ID of the user.
   * @returns A promise that resolves to an array of task documents.
   */
  findAllForUser(userId: string): Promise<ITaskDocument[]> {
    return this.taskModel
      .find({ user: userId })
      .select('-__v -updatedAt')
      .lean();
  }

  /**
   * Finds a task by its ID.
   * @param id - The ID of the task.
   * @returns A promise that resolves to the task document.
   */
  asy;
  async findOne(id: string) {
    return await this.taskModel.findById(id);
  }

  /**
   * Updates a task by its ID.
   * @param id - The ID of the task.
   * @param updateTaskDto - Data transfer object for updating a task.
   * @returns A promise that resolves to the updated task document.
   */
  async update(id: string, updateTaskDto: UpdateTaskDto) {
    // const select = Object.keys(updateTaskDto);

    return await this.taskModel
      .findByIdAndUpdate(id, { $set: updateTaskDto }, { new: true })
      .select('-__v -createdAt -updatedAt')
      .exec();
  }

  /**
   * Removes a task by its ID and the user ID.
   * Ensures that only the owner can delete the task.
   * @param id - The ID of the task.
   * @param userId - The ID of the user.
   */
  async remove(id: string, userId: string) {
    const task = await this.taskModel
      .findOneAndDelete({ _id: id, user: userId })
      .exec();
    console.log({ task });

    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    return task;
  }

  /**
   * Marks a task as overdue if it is not completed by the due date.
   * @param id - The ID of the task.
   */
  async taskOverDue(id: string) {
    const task = await this.taskModel.findById(id).select('status');
    console.log({ task });
    if (task.status !== TaskStatus.COMPLETED) {
      task.status = TaskStatus.OVERDUE;
      await task.save();
    }
  }
}
