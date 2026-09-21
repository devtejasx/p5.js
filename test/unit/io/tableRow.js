import { mockP5, mockP5Prototype } from '../../js/mocks';
import table from '../../../src/io/p5.Table';
import tableRow from '../../../src/io/p5.TableRow';

suite('p5.TableRow', function () {
  beforeAll(() => {
    table(mockP5, mockP5Prototype);
    tableRow(mockP5, mockP5Prototype);
  });

  function makeTable(columns, values) {
    const myTable = new mockP5.Table();
    myTable.columns = columns;
    const row = new mockP5.TableRow(values);
    myTable.addRow(row);
    return { myTable, row };
  }

  test('a value set by column title is read back by title', () => {
    const { myTable, row } = makeTable(['name', 'age'], ['Ann', '30']);
    row.setString('name', 'Bea');
    assert.strictEqual(row.getString('name'), 'Bea');
    assert.strictEqual(row.getString(0), 'Bea');
    assert.strictEqual(myTable.findRow('Bea', 'name'), row);
  });

  test('a value set by column index is read back by title', () => {
    const { row } = makeTable(['name', 'age'], ['Ann', '30']);
    row.setString(0, 'Cy');
    assert.strictEqual(row.getString('name'), 'Cy');
    assert.strictEqual(row.getString(0), 'Cy');
  });

  test('a row of a table without column titles can be set by index', () => {
    // A table loaded without the 'header' option has no column titles.
    const { row } = makeTable([], ['Ann', '30']);
    row.setString(0, 'Dee');
    row.setNum(1, 31);
    assert.strictEqual(row.getString(0), 'Dee');
    assert.strictEqual(row.getNum(1), 31);
  });

  test('an index past the end of the row still throws', () => {
    const { row } = makeTable([], ['Ann', '30']);
    assert.throws(() => row.setString(5, 'x'), /out of the range/);
  });
});
