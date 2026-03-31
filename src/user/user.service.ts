import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
// import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, LoginUserDto, CreateUserDto, ChangePasswordDto, UserFilterDto } from './dto';
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

  async findAll(filterDto: UserFilterDto) {
    try {
      const { page = 1, limit = 10, search, role, email } = filterDto;
      const skip = (page - 1) * limit;

      const query = this.userRepository.createQueryBuilder('user');

      // Aplicar búsqueda general
      if (search) {
        query.where(
          'user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search',
          { search: `%${search}%` },
        );
      }

      // Filtrar por rol
      if (role) {
        query.andWhere('user.role = :role', { role });
      }

      // Filtrar por email exacto
      if (email) {
        query.andWhere('user.email = :email', { email });
      }

      // Seleccionar campos específicos
      query.select([
        'user.id',
        'user.email',
        'user.firstName',
        'user.lastName',
        'user.role',
      ]);

      // Aplicar paginación
      query.skip(skip).take(limit);

      const [users, total] = await query.getManyAndCount();

      return {
        data: users,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
