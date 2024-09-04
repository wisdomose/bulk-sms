import { z } from "zod";
import MessageModel, { TMessage } from "./messages.model";
import { FilterQuery, UpdateQuery } from "mongoose";

async function create(params: UpdateQuery<TMessage>) {
  const message = await MessageModel.create(params);
  return message;
}

async function find(params: FilterQuery<TMessage>) {
  const messages = await MessageModel.find(params);
  return messages;
}

function prepareNumbers(numbers: string[]) {
  return numbers.map((number) => {
    const success = z
      .string()
      .regex(new RegExp(/^0\d{10}$/gm))
      .safeParse(number).success;

    return success ? `+234${number.slice(1)}` : number;
  });
}

async function devUpdate() {}

const MessagesService = {
  prepareNumbers,
  create,
  find,
  devUpdate,
};

export default MessagesService;
