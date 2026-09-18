import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatalogoModule } from './catalogo/catalogo.module';
import { TypeOrmModule } from '@nestjs/typeorm';
//import { TasksService } from "cron-job";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'sistema_vendas',
      autoLoadEntities: true,
      synchronize: true,
    }),
    
    CatalogoModule
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    //TasksService
  ],
})
export class AppModule {}
