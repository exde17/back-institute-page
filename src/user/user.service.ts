import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
// import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, LoginUserDto, CreateUserDto, ChangePasswordDto } from './dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { HttpExceptionFilter } from 'src/utils/http-exception.filter';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: await bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);

      return {
        ...user,
        token: this.getJwtToken({ 
          // email: user.email,
          id: user.id, 
        }),
        password: undefined,
      }
    } catch (error) {
      return error;
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const { email, password } = loginUserDto;

      const user = await this.userRepository.findOne({ 
        where: { email },
        select: ['email', 'password', 'id', 'role', 'firstName', 'lastName'],
       });

       if (!user){
          throw new UnauthorizedException('Invalid imail');
       }

        const isPasswordValid = await bcrypt.compareSync(password, user.password);

        if (!isPasswordValid){
          throw new UnauthorizedException('Invalid password');
        }

        return {
          ...user,
          token: this.getJwtToken({ 
            // email: user.email,
            id: user.id,
          }),
          password: undefined,
        }

    } catch (error) {

      return error;
      
    }
  }

  private getJwtToken(payload: JwtPayload){
    const token = this.jwtService.sign(payload);
    return token;
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    try {
      const { newPassword } = changePasswordDto;

      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const hashedPassword = await bcrypt.hashSync(newPassword, 10);

      await this.userRepository.update(userId, {
        password: hashedPassword,
      });

      return {
        ok: true,
        message: 'Password changed successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const users = await this.userRepository.find({
        select: ['email', 'id', 'firstName', 'lastName', 'role'],
      });
      return users;
      
    } catch (error) {
      throw error;
      
    }
    
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: [
        'tipoDocumento',
        'lugarExpedicion',
        'municipioNacimiento',
        'departamentoNacimiento',
        'parentesco',
        'nivelEducativo',
        'departamentoInstitucion',
        'municipioInstitucion',
        'grupo',
      ],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return { ...user, password: undefined };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Don't allow updating password through this endpoint
    const { password, ...rest } = updateUserDto as any;

    Object.assign(user, rest);
    await this.userRepository.save(user);

    return this.findOne(id);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
