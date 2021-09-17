import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType, Statement } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { ICreateTransferDTO } from "./ICreateTransferDTO";

@injectable()
class CreateTransferOperationUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) { };

  async execute({
    user_id,
    sender_id,
    description,
    amount,
  }: ICreateTransferDTO): Promise<Statement> {
    const sender = await this.usersRepository.findById(sender_id);

    if (!sender) {
      throw new AppError("Sender not found")
    }

    const receiver = await this.usersRepository.findById(user_id);

    if (!receiver) {
      throw new AppError("Receiver not found");
    }

    const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id });

    if (balance < amount) {
      throw new AppError("Balances is insuffient");
    }

    const transfer = await this.statementsRepository.create({
      user_id,
      sender_id,
      description,
      amount,
      type: OperationType.TRANSFER
    });

    return transfer;
  }
}

export { CreateTransferOperationUseCase }
