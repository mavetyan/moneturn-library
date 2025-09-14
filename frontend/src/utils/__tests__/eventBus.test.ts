import { eventBus } from '../eventBus';

describe('EventBus', () => {
  beforeEach(() => {
    // Clear all event listeners before each test
    (eventBus as any).events = {};
  });

  it('should emit and listen to events', () => {
    const callback = jest.fn();
    const testData = { message: 'test' };

    eventBus.on('testEvent', callback);
    eventBus.emit('testEvent', testData);

    expect(callback).toHaveBeenCalledWith(testData);
  });

  it('should remove event listeners', () => {
    const callback = jest.fn();

    eventBus.on('testEvent', callback);
    eventBus.off('testEvent', callback);
    eventBus.emit('testEvent');

    expect(callback).not.toHaveBeenCalled();
  });

  it('should handle multiple listeners for same event', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    eventBus.on('testEvent', callback1);
    eventBus.on('testEvent', callback2);
    eventBus.emit('testEvent');

    expect(callback1).toHaveBeenCalled();
    expect(callback2).toHaveBeenCalled();
  });
});
