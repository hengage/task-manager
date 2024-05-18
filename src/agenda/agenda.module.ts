import { Global, Module } from '@nestjs/common';
import { AgendaService } from './agenda.service';
import { TasksModule } from 'src/tasks/tasks.module';

@Global()
@Module({
  imports: [TasksModule],
  providers: [AgendaService],
  exports: [AgendaService],
})
export class AgendaModule {}
