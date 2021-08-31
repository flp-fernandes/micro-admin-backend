import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AppService } from './app.service';
import { Categoria } from './interfaces/categorias/categoria.interface';

@Controller()
export class AppController {
  logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @EventPattern('criar-categoria')
  async criarCategoria(
    @Payload() categoria: Categoria,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    console.log('channel :>> ', channel);
    console.log('originalMsg :>> ', originalMsg);

    this.logger.log(`categoria: ${JSON.stringify(categoria)}`);

    await this.appService.criarCategoria(categoria);
    channel.ack(originalMsg);
  }

  @MessagePattern('consultar-categorias')
  async consultarCategorias(@Payload() _id: string) {
    if (_id) {
      return await this.appService.consultarCategoriaPeloId(_id);
    } else {
      return await this.appService.consultarTodasCategorias();
    }
  }
}
