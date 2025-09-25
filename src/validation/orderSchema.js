import { z } from 'zod';

export const orderSchema = z.object({
  quantity: z
    .number({
      required_error: 'Quantidade é obrigatória',
      invalid_type_error: 'Quantidade deve ser um número',
    })
    .positive('Quantidade deve ser maior que zero')
    .int('Quantidade deve ser um número inteiro')
    .min(1, 'Quantidade mínima é 1'),
});
