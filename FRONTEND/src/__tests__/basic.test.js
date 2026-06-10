// Very basic test to verify Jest is working
test('2 + 2 equals 4', () => {
  expect(2 + 2).toBe(4);
});

test('object assignment works', () => {
  const obj = {a: 1};
  obj.b = 2;
  expect(obj).toEqual({a: 1, b: 2});
});