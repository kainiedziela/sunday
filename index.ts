const DAYS_IN_WEEK = 7;
const DAYS_IN_MONTH_LONG = 31;
const DAYS_IN_MONTH_SHORT = 30;
const DAYS_IN_FEBRUARY = 28; // in 2019, as applicable here

const sunday = {
  /**
   * @param today is todays date
   * @returns the next sunday unless today is a sunday,
   * then returns today
   */
  next: function(today: Date): Date {
    dateErrorHandler(today);
    if ( today.getDay() === 0 ) { return today; }

    const nextSunday = new Date(); 
    nextSunday.setDate(nextSunday.getDate() + (7 - nextSunday.getDay()) % 7);
    return nextSunday;
  },

  /**
   * @param date is any sunday in the future or today, if it's a sunday
   * @returns true if commerce is allowed during that sunday
   */
  trade: function(date: Date): boolean {
    dateErrorHandler(date);
    if (date.getDay() !== 0) { throw new Error(`Expected date.getDay to indicade Sunday (0), got ${date.getDay()} instead.`); }
  
    if (isHoliday(date)) { return false; }
  
    // in the Sunday preceding Easter the stores are open
    const weekPreEaster: Date = new Date(easterDate(date.getFullYear()));
    weekPreEaster.setDate(weekPreEaster.getDate() - DAYS_IN_WEEK);
    if (sameDayAndMonth(date, weekPreEaster)) { return true; }
  
    // in the two Sundays preceding Christmas the stores are open
    if (sameMonth(date, [Month.December]) && (date.getDate() > 10 && date.getDate() < 25)) { return true; }
  
    // the code below will be deprecated post 2019 and can be deleted when that occurs
    if (date.getFullYear() === 2019) {
      // in year 2019 the stores are open every last Sunday of a month, except when that Sunday is also a Holiday
      // these months have 31 days, so if the Sunday occurs on a day post 24th than it is the Last Sunday of that month
      if (sameMonth(date, [Month.January, Month.March, Month.May, Month.July, Month.August, Month.October, Month.December])) {
        if (date.getDate() > (DAYS_IN_MONTH_LONG - DAYS_IN_WEEK)) {
          return true;
        }
      }
  
      // these months have 30 days, the same logic as above applies to days post 23rd
      if (sameMonth(date, [Month.April, Month.June, Month.September, Month.November])) {
        if (date.getDate() > (DAYS_IN_MONTH_SHORT - DAYS_IN_WEEK)) {
          return true;
        }
      }
  
      // February has 28 days in 2019 and thus requires a separate condition
      if (sameMonth(date, [Month.February]) && (date.getDate() > (DAYS_IN_FEBRUARY - DAYS_IN_WEEK))) { return true; }
    }
  
    // in the last Sunday of January, April, June and August the stores are open
    // January and August have 31 days, so if the Sunday occurs on a day post 24th than it is the Last Sunday of that month
    if (sameMonth(date, [Month.January, Month.August]) && (date.getDate() > (DAYS_IN_MONTH_LONG - DAYS_IN_WEEK))) { return true; }
  
    // April and June have 30 days, the same logic as above applies to days post 23rd
    if (sameMonth(date, [Month.April, Month.June]) && (date.getDate() > (DAYS_IN_MONTH_SHORT - DAYS_IN_WEEK))) { return true; }
  
    return false;
  }
};

const isHoliday = (date: Date): boolean => {
  // in the case of additional holidays added to the polish law they should be added to the array below in a 'DD.MM' format
  const holidays: Array<string> = [
    "01.01",
    "06.01",
    dateToString(easterDate(date.getFullYear())),
    "01.05",
    "03.05",
    dateToString(pentecostDate(date.getFullYear())),
    "15.08",
    "01.11",
    "11.11",
    "25.12",
    "26.12"
  ];

  return !!holidays.find( holiday => holiday === dateToString(date) );
}

const easterDate = (year: number): Date => {
  // Computus is a calculation that determines the calendar date of Easter

  const date: Date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setFullYear(year);

  const goldenNumber: number = year % 19;

  const determineByYear: number =
    2200 <= year && year <= 2299
      ? (11 * goldenNumber + 4) % 30
      : (11 * goldenNumber + 5) % 30;

  const algorithm: number =
    determineByYear === 0 || (determineByYear === 1 && goldenNumber > 10)
      ? determineByYear + 1
      : determineByYear;

  // use the algorithm first to find the month: April or March
  const month: number = 1 <= algorithm && algorithm <= 19 ? 3 : 2;

  // then use the algorithm to find the full moon after the northward equinox
  const fullMoon: number = (50 - algorithm) % 31;
  date.setMonth(month, fullMoon);

  // find the next Sunday
  date.setMonth(month, fullMoon + (DAYS_IN_WEEK - date.getDay()));

  // Gregorian Western Easter Sunday
  return date;
}

// pentecost occurs seven weeks after Easter on a Sunday
const pentecostDate = (year: number): Date =>
  new Date(easterDate(year).setDate(easterDate(year).getDate() + (DAYS_IN_WEEK * 7)));

const sameDayAndMonth = (date1: Date, date2: Date): boolean =>
  (date1.getDate() === date2.getDate()) && (date1.getMonth() === date2.getMonth()) ? true : false;

const sameMonth = (date: Date, months: Array<number>): boolean =>
  !!months.find( month => month === (date.getMonth() + 1) );

/**
 * @returns DD.MM string of date
 */
const dateToString = (date: Date): string =>  `${date.getDate()}.${date.getMonth() + 1}`;

// an invalid date object returns NaN for getTime()
const isInvalidDate = (date: Date): boolean => isNaN(date.getTime());

const dateErrorHandler = (date: Date): void => {
  if (Object.prototype.toString.call(date) !== '[object Date]') { throw new Error(`Expected instance of Date, got ${Object.prototype.toString.call(date)}`); }
  if (isInvalidDate(date)) { throw new Error('Passed date is invalid.'); }
};

module.exports = sunday;

enum Month {
  January = 1,
  February = 2,
  March = 3,
  April = 4,
  May = 5,
  June = 6,
  July = 7,
  August = 8,
  September = 9,
  October = 10,
  November = 11,
  December = 12
}
