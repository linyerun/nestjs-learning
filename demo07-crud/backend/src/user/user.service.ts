import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { Like, Repository } from 'typeorm';
import { User } from '@/entities/user.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from '@/entities/tag.entity.js';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Tag) private readonly tagRepo: Repository<Tag>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const data = new User();
    data.name = createUserDto.name;
    data.desc = createUserDto.desc;
    return this.userRepo.save(data);
  }

  async findAll(query: { keyword: string; page: number; pageSize: number }) {
    const data = await this.userRepo.find({
      where: {
        name: Like(`%${query.keyword}%`),
      },
      relations: { tags: true },
      order: {
        id: 'DESC',
      },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    });
    const total = await this.userRepo.count({
      where: {
        name: Like(`%${query.keyword}%`),
      },
    });
    return {
      data,
      total,
    };
  }

  findOne(id: number) {
    return this.userRepo.findOne({ where: { id } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepo.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepo.delete(id);
  }

  async addTags(params: { tags: string[]; userId: number }) {
    const userInfo = await this.userRepo.findOne({
      where: { id: params.userId },
    });
    if (!userInfo) {
      throw new NotFoundException();
    }
    const tags: Tag[] = [];
    for (let i = 0; i < params.tags.length; i++) {
      let tag = new Tag();
      tag.tag = params.tags[i];
      await this.tagRepo.save(tag);
      tags.push(tag);
    }
    userInfo.tags = tags;
    return this.userRepo.save(userInfo);
  }

  async transfer({
    from,
    to,
    amount,
  }: {
    from: number;
    to: number;
    amount: number;
  }) {
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new BadRequestException('转账金额必须为正整数');
    }
    if (from === to) {
      throw new BadRequestException('不能给自己转账');
    }
    // 读余额、校验、扣加款必须和事务的锁一起做，事务外先读会读到过期余额
    return this.userRepo.manager.transaction(async (mgr) => {
      const u1 = await mgr.findOne(User, {
        where: { id: from },
        lock: { mode: 'pessimistic_write' },
      });
      const u2 = await mgr.findOne(User, {
        where: { id: to },
        lock: { mode: 'pessimistic_write' },
      });
      if (!u1 || !u2) {
        throw new NotFoundException('用户不存在');
      }
      if (u1.amount < amount) {
        throw new BadRequestException('余额不足');
      }
      u1.amount -= amount;
      u2.amount += amount;
      await mgr.save([u1, u2]);
      return { from: u1, to: u2 };
    });
  }
}
