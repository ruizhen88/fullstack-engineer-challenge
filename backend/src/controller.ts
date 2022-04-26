import { NextFunction, Request, Response } from "express";
import service, { ITEMS_PER_PAGE } from "./service";

const getPolicies = async (req: Request, res: Response, next: NextFunction) => {
  let policies;
  try {
    const { search, page } = req.query;
    const skip = page ? (parseInt(page as string, 10) - 1) * 5 : undefined;

    policies = await service.findPolicies(search as string, skip as number);
    const totalCount = await service.getPolicyCount();

    const response = {
      policies,
      totalPage: totalCount / ITEMS_PER_PAGE,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export default { getPolicies };
