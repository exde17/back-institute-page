import { Injectable } from '@nestjs/common';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Factura } from './entities/factura.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FacturaService {
  constructor(
    @InjectRepository(Factura)
    private readonly facturaRepository: Repository<Factura>,
  ) {}

  async create(createFacturaDto: CreateFacturaDto) {
    try {
      const factura = this.facturaRepository.create(createFacturaDto);
      await this.facturaRepository.save(factura);
      return "Factura creada exitosamente";
      
    } catch (error) {
      console.error('Error al crear la factura:', error);
      throw new Error('No se pudo crear la factura');
      
    }
  }

  async findAll() {
    try {
      return await this.facturaRepository.find();
      
    } catch (error) {
      console.error('Error al obtener las facturas:', error);
      throw new Error('No se pudieron obtener las facturas');
      
    }
  }

  async findOne(id: string) {
    try {
      return await this.facturaRepository.findOneBy({ id });
      
    } catch (error) {
      console.error('Error al obtener la factura:', error);
      throw new Error('No se pudo obtener la factura');
      
    }
  }

  async update(id: string, updateFacturaDto: UpdateFacturaDto) {
    try {
      await this.facturaRepository.update(id, updateFacturaDto);
      return await this.facturaRepository.findOneBy({ id });
      
    } catch (error) {
      console.error('Error al actualizar la factura:', error);
      throw new Error('No se pudo actualizar la factura');
      
    }
  }

  async remove(id: string) {
    try {
      await this.facturaRepository.delete(id);
      return "Factura eliminada exitosamente";
      
    } catch (error) {
      console.error('Error al eliminar la factura:', error);
      throw new Error('No se pudo eliminar la factura');
      
    }
  }

  async marcarComoPagada(id: string) {
    try {
      await this.facturaRepository.update(id, { isPaid: true });
      return await this.facturaRepository.findOneBy({ id });
      
    } catch (error) {
      console.error('Error al marcar la factura como pagada:', error);
      throw new Error('No se pudo marcar la factura como pagada');
      
    }
  }
}
