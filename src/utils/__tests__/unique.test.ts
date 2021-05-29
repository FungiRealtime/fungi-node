import { unique } from '../unique';

test('removes duplicates from array', () => {
  let duplicateNums = [1, 1, 3, 4, 8, 1, 4, 3];
  let uniqueNums = unique(duplicateNums);
  expect(uniqueNums).toMatchInlineSnapshot(`
    Array [
      1,
      3,
      4,
      8,
    ]
  `);

  let duplicateStrings = ['a', 'b', 'a', 'a', 'c', 'b'];
  let uniqueStrings = unique(duplicateStrings);
  expect(uniqueStrings).toMatchInlineSnapshot(`
    Array [
      "a",
      "b",
      "c",
    ]
  `);
});
