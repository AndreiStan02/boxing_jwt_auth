import prisma from "src/db/prismaClient.js";
import { NOT_FOUND, OK } from "../constants/http.js";
import { appAsert } from "../util/appAsert.js";
import { catchErrors } from "../util/catchErrors.js";

export const getUserHandler = catchErrors(async (req, res) => {
  const user = await prisma.user.findFirst({
    where: {
      id: req.userId,
    },
  });
  appAsert(user, NOT_FOUND, "User not found");
  const { id, password, ...publicUser } = user;
  return res.status(OK).json(publicUser);
});
