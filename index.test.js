const sunday = require('./dist/index');

test('sunday.next() returns a sunday', () => {
    expect(sunday.next(new Date()).getDay()).toBe(0);
});

test('sunday.trade() returns true for 22.12.2019 (a sunday that occurs before christmas is opened to trade)', () => {
    const sundayBeforeXmas = new Date('December 22, 2019');
    expect(sunday.trade(sundayBeforeXmas)).toBe(true);
});

test('sunday.trade() returns true for all opened-to-commerce sundays in year 2020', () => {
    const openedToTrade = [
        new Date('January 26, 2020'),
        new Date('April 5, 2020'),
        new Date('April 26, 2020'),
        new Date('June 28, 2020'),
        new Date('August 30, 2020'),
        new Date('December 13, 2020'),
        new Date('December 20, 2020')
    ]
    openedToTrade.forEach( day => { expect(sunday.trade(day)).toBe(true); });
});
