import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DbService } from '../db/db.service';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let usersService: UsersService;
  let dbService: DbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, DbService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    dbService = module.get<DbService>(DbService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      // Create a mock createUserDto
      const createUserDto = { username: 'John Doe', email: '1@1.com' };

      // Mock the dbService.user.create method
      jest
        .spyOn(dbService.user, 'create')
        .mockResolvedValue({ id: 1, ...createUserDto });

      // Call the create method and assert the result
      const result = await usersService.create(createUserDto);
      expect(result).toEqual({ id: 1, ...createUserDto });

      // Assert that dbService.user.create was called with the correct arguments
      expect(dbService.user.create).toHaveBeenCalledWith({
        data: createUserDto,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      // Mock the dbService.user.findMany method
      jest
        .spyOn(dbService.user, 'findMany')
        .mockResolvedValue([{ id: 1, username: 'John Doe', email: '1@1.com' }]);

      // Call the findAll method and assert the result
      const result = await usersService.findAll();
      expect(result).toEqual([
        { id: 1, username: 'John Doe', email: '1@1.com' },
      ]);

      // Assert that dbService.user.findMany was called
      expect(dbService.user.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user with the given id', async () => {
      // Create a mock user object
      const mockUser = { id: 1, username: 'John Doe', email: '1@1.com' };

      // Mock the dbService.user.findUnique method
      jest.spyOn(dbService.user, 'findUnique').mockResolvedValue(mockUser);

      // Call the findOne method with a valid id and assert the result
      const result = await usersService.findOne(1);
      expect(result).toEqual(mockUser);

      // Assert that dbService.user.findUnique was called with the correct arguments
      expect(dbService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw a NotFoundException if user is not found', async () => {
      // Mock the dbService.user.findUnique method to return null
      jest.spyOn(dbService.user, 'findUnique').mockResolvedValue(null);

      // Call the findOne method with an invalid id and expect it to throw a NotFoundException
      await expect(usersService.findOne(1)).rejects.toThrow(NotFoundException);

      // Assert that dbService.user.findUnique was called with the correct arguments
      expect(dbService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('update', () => {
    it('should update a user with the given id', async () => {
      // Create a mock updateUserDto and mock user object
      const updateUserDto = { username: 'John Doe', email: '1@1.com' };
      const mockUser = { id: 1, username: 'John Doe', email: '1@1.com' };

      // Mock the dbService.user.update method
      jest
        .spyOn(dbService.user, 'update')
        .mockResolvedValue({ id: 1, ...updateUserDto });

      // Call the update method with a valid id and assert the result
      const result = await usersService.update(1, updateUserDto);
      expect(result).toEqual({ id: 1, ...updateUserDto });

      // Assert that dbService.user.update was called with the correct arguments
      expect(dbService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateUserDto,
      });
    });
  });

  describe('remove', () => {
    it('should remove a user with the given id', async () => {
      // Mock the dbService.user.delete method
      jest
        .spyOn(dbService.user, 'delete')
        .mockResolvedValue({ id: 1, username: 'John Doe', email: '1@1.com' });

      // Call the remove method with a valid id and assert the result
      const result = await usersService.remove(1);
      expect(result).toEqual({ id: 1, username: 'John Doe', email: '1@1.com' });

      // Assert that dbService.user.delete was called with the correct arguments
      expect(dbService.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
});
