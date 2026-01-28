import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, ValidationPipe } from '@nestjs/common';
import { PagoService } from './pago.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { WompiWebhookDto } from './dto/wompi-webhook.dto';

@Controller('pago')
export class PagoController {
  constructor(private readonly pagoService: PagoService) {}

  @Post()
  create(@Body() createPagoDto: CreatePagoDto) {
    return this.pagoService.create(createPagoDto);
  }

  @Post('webhook/wompi')
  @HttpCode(HttpStatus.OK)
  async handleWompiWebhook(@Body(new ValidationPipe({ skipMissingProperties: true, whitelist: false, forbidNonWhitelisted: false })) webhookData: any) {
    console.log('===== WEBHOOK WOMPI RECIBIDO =====');
    console.log('Tipo de dato:', typeof webhookData);
    console.log('Datos completos:', JSON.stringify(webhookData, null, 2));
    console.log('Propiedades:', Object.keys(webhookData));
    console.log('==================================');
    return this.pagoService.handleWompiWebhook(webhookData);
  }

  @Get()
  findAll() {
    return this.pagoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pagoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePagoDto: UpdatePagoDto) {
    return this.pagoService.update(+id, updatePagoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pagoService.remove(+id);
  }
}
