/* eslint-disable no-undef */
describe('router', () => {
    describe('.loadInitialRoute', () => {
        beforeEach(() => {
        });
        it('Load Initial Route', () => {
            expect(typeof router.loadInitialRoute).toBe('function');
            expect(router.loadInitialRoute()).toEqual(['context.html']);
        });
    });
});

describe('utils', () => {
    describe('.debounce', () => {
        const { debounce } = utils;
        beforeEach(() => {
            jasmine.clock().install();
        });
        afterEach(() => {
            jasmine.clock().uninstall();
        });
        it('should take two arguments', () => {
            expect(() => debounce()).toThrow();
        });
        it('first argument should be function', () => {
            expect(() => debounce(5)).toThrow();
        });
        it('should return a function', () => {
            const fn = () => true;
            expect(typeof debounce(fn, 100)).toBe('function');
        });
        it('should debounce for a provided time', () => {
            utils.spyFn = jasmine.createSpy('dummySpy').and.returnValue(true);
            const debouncedFn = debounce(utils.spyFn, 1000);
            debouncedFn();
            debouncedFn();
            debouncedFn();
            debouncedFn();
            debouncedFn();

            jasmine.clock().tick(1001);
            expect(utils.spyFn).toHaveBeenCalledTimes(1);
        });
        it('should return results when function executes', () => {
            const fn = () => true;
            const debouncedFn = debounce(fn, 1000);
            debouncedFn();
            debouncedFn();
            debouncedFn();
            debouncedFn();
            let result = debouncedFn();

            jasmine.clock().tick(1001);
            result = debouncedFn();
            expect(result).toBe(true);
        });
        it('return method should have cancel method', () => {
            const fn = function () { return true; };
            const debouncedFn = debounce(fn, 1000);
            expect(typeof debouncedFn.cancel).toBe('function');
        });
    });
});
