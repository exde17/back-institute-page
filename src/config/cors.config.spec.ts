import { corsOptions } from './cors.config';

describe('corsOptions', () => {
  it('should allow any origin', () => {
    expect(corsOptions.origin).toBe('*');
  });
});
