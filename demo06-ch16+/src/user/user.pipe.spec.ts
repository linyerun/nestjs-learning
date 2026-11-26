import { GenUserIdPipe } from './user.pipe.js';

describe('UserPipe', () => {
  it('should be defined', () => {
    expect(new GenUserIdPipe()).toBeDefined();
  });
});
