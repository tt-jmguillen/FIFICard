import { AddMore } from './add-more';
import { Card } from './card';

describe('AddMore', () => {
  it('should create an instance', () => {
    expect(new AddMore(new Card())).toBeTruthy();
  });
});
