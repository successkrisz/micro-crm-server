import User from '../../src/models/User';
import {expect} from 'chai';

describe('User model validation', () => {
  it('Will not accept email address without a dot in domain', () => {
    const user = new User({
      email: 'kriszi.balla@gmail',
      password: 'password',
      profile: { firstName: 'Krisztian', lastName: 'Balla' }
    });
    const error = user.validateSync();
    expect(error.errors['email'].message).to.equal('kriszi.balla@gmail is not a valid email address!');
  });
  it('Will require an email address', () => {
    const user = new User({
      password: 'password',
      profile: { firstName: 'Krisztian', lastName: 'Balla' }
    });
    const error = user.validateSync();
    expect(error.errors['email'].message).to.equal('User email address required!');
  });
  it('Accepts valid email address', () => {
    const user = new User({
      email: 'kriszi.balla@gmail.com',
      password: 'password',
      profile: { firstName: 'Krisztian', lastName: 'Balla' }
    });
    const error = user.validateSync();
    expect(error).to.equal(undefined);
  });
  it('Password required', () => {
    const user = new User({
      email: 'kriszi.balla@gmail.com',
      password: '',
      profile: { firstName: 'Krisztian', lastName: 'Balla' }
    });
    const error = user.validateSync();
    expect(error.errors['password'].message).to.equal('Password required!');
  });
});
