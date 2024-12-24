import { Prisma } from '@prisma/client';
import { JsonObject } from '@prisma/client/runtime/library';

export type ModelNameType = (typeof Prisma.ModelName)[keyof typeof Prisma.ModelName];

export type SelectFields = {
  [key: string]: boolean | { select: SelectFields };
};
// Define the type for the fields array to allow for both strings and objects with arbitrary keys
export type Field = string | { [key: string]: Field[] };

export interface AggregatedResult<T>{
  cursor: {
    firstBatch: Array<T>;
    id: number;
    ns: string;
  };
  ok: number;
}
