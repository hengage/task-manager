import { Inject, Injectable, OnModuleInit, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Agenda } from 'agenda';
import { TasksService } from 'src/tasks/tasks.service';

/**
 * Service responsible for managing the Agenda scheduling library.
 * It sets up and defines jobs for scheduling tasks.
 */
@Injectable()
export class AgendaService implements OnModuleInit {
  private agenda: Agenda;

  constructor(
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => TasksService))
    private readonly taskService: TasksService,
  ) {}

  /**
   * Lifecycle hook that is called once the module has been initialized.
   * Sets up the Agenda instance.
   */
  onModuleInit() {
    this.setupAgenda();
  }

  private setupAgenda() {
    const dbUrl = this.configService.get<string>('DB_URL');

    this.agenda = new Agenda({
      db: {
        address: dbUrl,
        collection: 'agendaJobs',
      },
      processEvery: '30 seconds',
    });

    this.agenda
      .on('ready', () => console.log('Agenda started!'))
      .on('error', () => console.log('Agenda connection error!'));

    this.defineJobs();
    this.agenda.start();
  }

  /**
   * Defines the jobs to be scheduled by Agenda.
   * Currently, it defines a 'task-overdue' job that marks tasks as overdue.
   * Other job defnitions can be aded too.
   */
  private defineJobs() {
    this.agenda.define('task-overdue', async (job: any) => {
      console.log('Running schedule');

      const { taskId } = job.attrs.data;
      await this.taskService.taskOverDue(taskId);
    });
  }

  /**
   * Schedules a 'task-overdue' job at the specified due date.
   * @param dueDate - The date when the task should be marked as overdue.
   * @param taskId - The ID of the task to be marked as overdue.
   */
  public scheduleTaskOverdue(dueDate: Date, taskId: string) {
    this.agenda.schedule(dueDate, 'task-overdue', { taskId });
  }
}
