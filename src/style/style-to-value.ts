import { pipe } from 'ramda';
import { shortenStyle } from './shorten';
import { stringifyStyle } from './stringify';

export const styleToValue = pipe(stringifyStyle, shortenStyle);
