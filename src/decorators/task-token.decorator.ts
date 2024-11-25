import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentTask = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const { iat, exp, ...filteredTask } = req.task as any;

    return filteredTask;
  },
);
