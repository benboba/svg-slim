import { pipe } from 'ramda';
import { shortenPureDecimal } from './shorten-pure-decimal';
import { toScientific } from './to-scientific';

export const shortenNumber = pipe(toScientific, shortenPureDecimal);
