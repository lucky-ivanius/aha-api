import { z } from 'zod';
import {
  defaultPage,
  defaultPageSize,
} from '../../../../application/common/pagination';

export const getUserListValidationSchema = z.object({
  page: z
    .string()
    .transform(Number)
    .default(defaultPage.toString())
    .refine((arg) => arg > 0, {
      message: 'Page must be greater than 1',
      path: ['page'],
    }),
  pageSize: z
    .string()
    .transform(Number)
    .default(defaultPageSize.toString())
    .refine((arg) => arg >= 10, {
      message: 'Page size must be greater than or equal 10',
      path: ['pageSize'],
    })
    .refine((arg) => arg <= 100, {
      message: 'Page size must be less than or equal 100',
      path: ['pageSize'],
    }),
});

export type GetUserListValidation = typeof getUserListValidationSchema;
