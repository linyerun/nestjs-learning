import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { User } from '@/entities/user.entity.js';
import { Tag } from '@/entities/tag.entity.js';
import { UserService } from './user.service.js';

describe('UserService', () => {
  let service: UserService;

  // 用内存表模拟数据库：findOne 返回副本（像真实 SELECT），save 才写回
  let rows: Map<number, { id: number; amount: number }>;
  let findOne: ReturnType<typeof vi.fn>;
  let save: ReturnType<typeof vi.fn>;
  let transaction: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    rows = new Map([
      [1, { id: 1, amount: 100 }],
      [2, { id: 2, amount: 10 }],
    ]);

    findOne = vi.fn(
      async (_entity: typeof User, options: { where: { id: number } }) => {
        const row = rows.get(options.where.id);
        return row ? Object.assign(new User(), row) : null;
      },
    );
    save = vi.fn(async (entities: User[]) => {
      for (const u of entities) {
        rows.set(u.id, { id: u.id, amount: u.amount });
      }
      return entities;
    });

    const manager = { findOne, save };
    transaction = vi.fn(
      async (cb: (mgr: typeof manager) => Promise<unknown>) => cb(manager),
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: { manager: { transaction } },
        },
        { provide: getRepositoryToken(Tag), useValue: {} },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('transfer', () => {
    it('转账成功后双方余额正确变化', async () => {
      await service.transfer({ from: 1, to: 2, amount: 30 });

      expect(rows.get(1)?.amount).toBe(70);
      expect(rows.get(2)?.amount).toBe(40);
      expect(save).toHaveBeenCalledTimes(1);
    });

    it('余额不足时抛 400，且不写库', async () => {
      await expect(
        service.transfer({ from: 1, to: 2, amount: 101 }),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(save).not.toHaveBeenCalled();
      expect(rows.get(1)?.amount).toBe(100);
      expect(rows.get(2)?.amount).toBe(10);
    });

    it('用户不存在时抛 404', async () => {
      await expect(
        service.transfer({ from: 1, to: 99, amount: 10 }),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(save).not.toHaveBeenCalled();
    });

    it('金额不是正整数时直接拒绝，不开事务', async () => {
      await expect(
        service.transfer({ from: 1, to: 2, amount: -5 }),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(transaction).not.toHaveBeenCalled();
    });

    it('不能转给自己', async () => {
      await expect(
        service.transfer({ from: 1, to: 1, amount: 5 }),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(transaction).not.toHaveBeenCalled();
    });
  });
});