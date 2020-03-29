const sunday = require("./dist/index");

test("sunday.next() returns a Sunday", () => {
  expect(sunday.next(new Date()).getDay()).toBe(0);
});

test("sunday.trade() returns true for 28.03.2021 (a Sunday that occurs before Easter is opened to trade)", () => {
  const sundayBeforeXmas = new Date("March 28, 2021");
  expect(sunday.trade(sundayBeforeXmas)).toBe(true);
});

test("sunday.trade() returns true for 12.12.2021 (a Sunday that occurs two weeks before Christmas is opened to trade)", () => {
  const sundayBeforeXmas = new Date("December 12, 2021");
  expect(sunday.trade(sundayBeforeXmas)).toBe(true);
});

test("sunday.trade() returns true for 19.12.2021 (a Sunday that occurs before Christmas is also opened to trade)", () => {
  const sundayBeforeXmas = new Date("December 19, 2021");
  expect(sunday.trade(sundayBeforeXmas)).toBe(true);
});

test("sunday.trade() returns true for all opened-to-commerce Sundays in year 2020", () => {
  const openedToTrade = [
    new Date("January 26, 2020"),
    new Date("April 5, 2020"),
    new Date("April 26, 2020"),
    new Date("June 28, 2020"),
    new Date("August 30, 2020"),
    new Date("December 13, 2020"),
    new Date("December 20, 2020")
  ];
  openedToTrade.forEach(day => {
    expect(sunday.trade(day)).toBe(true);
  });
});
