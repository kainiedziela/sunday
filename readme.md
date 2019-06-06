# Sunday

Determine when the next Sunday is and whether it's open to trade in Poland.

## Installation

```bash
npm install @kainiedziela/sunday --save
```

## Usage

```TS
import { sunday } from '@kainiedziela/sunday';

const nextSunday: Date = sunday.next(new Date());
const storesOpened: boolean = sunday.trade(nextSunday);
```

`sunday.next(today)` returns the date (in `Date` format) of the next Sunday, unless the passed in date is a Sunday, then it returns the same date. Only accepts dates in a `Date` format.

`sunday.trade(date)` returns a boolean value - **true** if the passed in date is a Sunday and the stores will be/are opened on that Sunday or **false** if they are closed. `trade()` only accepts Sundays in a `Date` format.

If an invalid `Date` object or something that isn't an `instanceof Date` will be passed as an argument to either of those function an error will be thrown indicating what went wrong.

This project is under the **MIT license**.
