import { Request, response, Response } from "express";
import { container } from "tsyringe";
import { CreateTransferOperationUseCase } from "./CreateTransferOperationUseCase";


class CreateTransferOperationController {
  async handle(request: Request, reponse: Response): Promise<Response>{
    const sender_id = request.user.id;
    const { user_id } = request.params;
    const { description, amount } = request.body;

    const createTransferOperationUseCase = container.resolve(CreateTransferOperationUseCase);

    const transfer = createTransferOperationUseCase.execute({
      user_id,
      sender_id,
      description,
      amount,
    })

    return response.json(transfer);
  }
}

export { CreateTransferOperationController };
