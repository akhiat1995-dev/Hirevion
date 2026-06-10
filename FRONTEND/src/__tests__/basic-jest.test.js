// Basic Jest test without DOM dependencies
test('adds 2 + 2 to equal 4', () => {
  expect(2 + 2).toBe(4);
});

test('object assignment', () => {
  const data = {one: 1};
  data['two'] = 2;
  expect(data).toEqual({one: 1, two: 2});
});

test('truthiness', () => {
  expect(null).toBeNull();
  expect(0).toBeFalsy();
  expect('').toBeFalsy();
  expect(false).toBeFalsy();
});