import { mockP5, mockP5Prototype } from '../../js/mocks';
import storage from '../../../src/data/local_storage';
import p5Color from '../../../src/color/p5.Color';
import creatingReading from '../../../src/color/creating_reading';
import p5Vector from '../../../src/math/p5.Vector';
import math from '../../../src/math/math';

suite('local storage', function () {
  const myBoolean = false;
  const myObject = { one: 1, two: { nested: true } };
  const myNumber = 46;
  const myString = 'coolio';
  let myColor;
  let myVector;

  const hardCodedTypeID = 'p5TypeID';

  beforeAll(function () {
    storage(mockP5, mockP5Prototype);
    p5Color(mockP5, mockP5Prototype, {});
    creatingReading(mockP5, mockP5Prototype);
    p5Vector(mockP5, mockP5Prototype);
    math(mockP5, mockP5Prototype);

    mockP5Prototype.storeItem('myBoolean', myBoolean);
    mockP5Prototype.storeItem('myObject', myObject);
    mockP5Prototype.storeItem('myNumber', myNumber);
    mockP5Prototype.storeItem('myString', myString);

    myColor = mockP5Prototype.color(40, 100, 70);
    myVector = mockP5Prototype.createVector(10, 20, 30);
    mockP5Prototype.storeItem('myColor', myColor);
    mockP5Prototype.storeItem('myVector', myVector);
  });

  suite('all keys and type keys should exist in local storage', function () {
    test('boolean storage retrieval should work', function () {
      assert.equal(mockP5Prototype.getItem('myBoolean'), false);
    });
    test('boolean storage should store the correct type ID', function () {
      assert.equal(
        localStorage.getItem('myBoolean' + hardCodedTypeID),
        'boolean'
      );
    });
    test('object storage should work', function () {
      assert.deepEqual(mockP5Prototype.getItem('myObject'), {
        one: 1,
        two: { nested: true }
      });
    });
    test('object storage retrieval should store the correct type ID', function () {
      assert.equal(
        localStorage.getItem('myObject' + hardCodedTypeID),
        'object'
      );
    });
    test('number storage retrieval should work', function () {
      assert.equal(mockP5Prototype.getItem('myNumber'), 46);
    });
    test('number storage should store the correct type ID', function () {
      assert.equal(
        localStorage.getItem('myNumber' + hardCodedTypeID),
        'number'
      );
    });
    test('string storage retrieval should work', function () {
      assert.equal(mockP5Prototype.getItem('myString'), 'coolio');
    });
    test('string storage should store the correct type ID', function () {
      assert.equal(
        localStorage.getItem('myString' + hardCodedTypeID),
        'string'
      );
    });
    test('p5 Color should retrieve as p5 Color', function () {
      assert.instanceOf(mockP5Prototype.getItem('myColor'), mockP5.Color);
    });
    test('p5 Vector should retrieve as p5 Vector', function () {
      assert.instanceOf(mockP5Prototype.getItem('myVector'), mockP5.Vector);
    });
  });

  var checkRemoval = function (key) {
    mockP5Prototype.removeItem(key);
    assert.deepEqual(mockP5Prototype.getItem(key), null);
    assert.deepEqual(mockP5Prototype.getItem(key + hardCodedTypeID), null);
  };

  suite('should be able to remove all items', function () {
    test('boolean should be removable', function () {
      checkRemoval('myBoolean');
    });

    test('number should be removable', function () {
      checkRemoval('myNumber');
    });

    test('object should be removable', function () {
      checkRemoval('myObject');
    });

    test('string should be removable', function () {
      checkRemoval('myString');
    });

    test('color should be removable', function () {
      checkRemoval('myColor');
    });

    test('vector should be removable', function () {
      checkRemoval('myVector');
    });
  });

  suite('should reject invalid input without storing it', function () {
    beforeEach(function () {
      mockP5._friendlyError.mockClear();
    });

    test('a non-string key reports an error instead of throwing', function () {
      assert.doesNotThrow(() => mockP5Prototype.storeItem(42, 'hello'));
      assert.equal(mockP5._friendlyError.mock.calls.length, 1);
      assert.isNull(localStorage.getItem('42'));
      assert.isNull(localStorage.getItem('42' + hardCodedTypeID));
    });

    test('a key ending in p5TypeID is not stored', function () {
      mockP5Prototype.storeItem('fake' + hardCodedTypeID, 'hello');
      assert.equal(mockP5._friendlyError.mock.calls.length, 1);
      assert.isNull(localStorage.getItem('fake' + hardCodedTypeID));
    });

    test('an undefined value is not stored as the string "undefined"', function () {
      mockP5Prototype.storeItem('myUndefined', undefined);
      assert.equal(mockP5._friendlyError.mock.calls.length, 1);
      assert.isNull(mockP5Prototype.getItem('myUndefined'));
      assert.isNull(localStorage.getItem('myUndefined' + hardCodedTypeID));
    });
  });

  suite('should be able to clear all items at once', function () {
    test('should remove all items set by storeItem()', function () {
      localStorage.setItem('extra', 'stuff');
      mockP5Prototype.clearStorage();
      assert.deepEqual(mockP5Prototype.getItem('myBoolean'), null);
      assert.deepEqual(mockP5Prototype.getItem('myNumber'), null);
      assert.deepEqual(mockP5Prototype.getItem('myObject'), null);
      assert.deepEqual(mockP5Prototype.getItem('myString'), null);
      assert.deepEqual(mockP5Prototype.getItem('myColor'), null);
      assert.deepEqual(mockP5Prototype.getItem('myVector'), null);
      assert.deepEqual(mockP5Prototype.getItem('extra'), 'stuff');
    });
  });
});
