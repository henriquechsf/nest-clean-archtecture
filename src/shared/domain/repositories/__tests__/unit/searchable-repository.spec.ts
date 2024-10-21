import { SearchParams } from "../../searchable-repository-contracts";

describe('Searchable Repository - unit -tests', () => {
  describe('Searchable tests', () => {
    it('page props', () => {
      const sut = new SearchParams()
      expect(sut.page).toBe(1)

      const params = [
        { page: null, expected: 1 },
        { page: undefined, expected: 1 },
        { page: '', expected: 1 },
        { page: 'test', expected: 1 },
        { page: 0, expected: 1 },
        { page: -1, expected: 1 },
        { page: true, expected: 1 },
        { page: false, expected: 1 },
        { page: {}, expected: 1 },
        { page: 1, expected: 1 },
        { page: 2, expected: 2 },
      ]

      params.forEach(param => {
        expect(new SearchParams({ page: param.page as any}).page).toBe(param.expected)
      })
    });

    it('perPage props', () => {
      const sut = new SearchParams()
      expect(sut.perPage).toBe(10)

      const params = [
        { perPage: null, expected: 10 },
        { perPage: undefined, expected: 10 },
        { perPage: '', expected: 10 },
        { perPage: 'test', expected: 10 },
        { perPage: 0, expected: 10 },
        { perPage: -1, expected: 10 },
        { perPage: true, expected: 10 },
        { perPage: false, expected: 10 },
        { perPage: {}, expected: 10 },
        { perPage: 1, expected: 1 },
        { perPage: 2, expected: 2 },
      ]

      params.forEach(param => {
        expect(new SearchParams({ perPage: param.perPage as any}).perPage).toBe(param.expected)
      })
    });

    it('sort props', () => {
      const sut = new SearchParams()
      expect(sut.sort).toBeNull()

      const params = [
        { sort: null, expected: null },
        { sort: undefined, expected: null },
        { sort: '', expected: null },
        { sort: 'test', expected: 'test' },
        { sort: 0, expected: '0' },
        { sort: -1, expected: '-1' },
        { sort: true, expected: 'true' },
        { sort: false, expected: 'false' },
        { sort: {}, expected: '[object Object]' },
        { sort: 1, expected: '1' },
        { sort: 2, expected: '2' },
        { sort: 25, expected: '25' },
      ]

      params.forEach(param => {
        expect(new SearchParams({ sort: param.sort as any}).sort).toBe(param.expected)
      })
    });

    it('sortDir props', () => {
      let sut = new SearchParams()
      expect(sut.sortDir).toBeNull()

      sut = new SearchParams({ sort: null })
      expect(sut.sortDir).toBeNull()

      sut = new SearchParams({ sort: undefined })
      expect(sut.sortDir).toBeNull()

      sut = new SearchParams({ sort: '' })
      expect(sut.sortDir).toBeNull()

      const params = [
        { sortDir: null, expected: 'desc' },
        { sortDir: undefined, expected: 'desc' },
        { sortDir: '', expected: 'desc' },
        { sortDir: 'test', expected: 'desc' },
        { sortDir: 0, expected: 'desc' },
        { sortDir: -1, expected: 'desc' },
        { sortDir: true, expected: 'desc' },
        { sortDir: false, expected: 'desc' },
        { sortDir: 'desc', expected: 'desc' },
        { sortDir: 'DESC', expected: 'desc' },
        { sortDir: 'asc', expected: 'asc' },
        { sortDir: 'ASC', expected: 'asc' },
      ]

      params.forEach(param => {
        expect(new SearchParams({ sort: 'any_sort', sortDir: param.sortDir as any}).sortDir).toBe(param.expected)
      })
    });

    it('filter props', () => {
      const sut = new SearchParams()
      expect(sut.filter).toBeNull()

      const params = [
        { filter: null, expected: null },
        { filter: undefined, expected: null },
        { filter: '', expected: null },
        { filter: 'test', expected: 'test' },
        { filter: 0, expected: '0' },
        { filter: -1, expected: '-1' },
        { filter: true, expected: 'true' },
        { filter: false, expected: 'false' },
        { filter: {}, expected: '[object Object]' },
        { filter: 1, expected: '1' },
        { filter: 2, expected: '2' },
        { filter: 25, expected: '25' },
      ]

      params.forEach(param => {
        expect(new SearchParams({ filter: param.filter as any}).filter).toBe(param.expected)
      })
    });
  });
});
