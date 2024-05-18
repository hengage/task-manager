import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Agenda } from 'agenda';
import { TasksService } from 'src/tasks/tasks.service';

@Injectable()
export class AgendaService implements OnModuleInit {
  private agenda: Agenda;

  constructor(
    private readonly configService: ConfigService,
    private readonly taskService: TasksService,
  ) {
    // this.setupAgenda();
  }

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

  private defineJobs() {
    this.agenda.define('task-overdue', async (job: any) => {
      console.log('Running schedule');

      const { taskId } = job.attrs.data;
      await this.taskService.taskOverDue(taskId);
    });
  }

  public scheduleTaskOverdue(dueDate: Date, taskId: string) {
    this.agenda.schedule(dueDate, 'task-overdue', { taskId });
  }
}
