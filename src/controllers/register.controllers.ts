import { BadRequestError } from '@pippip/pip-system-common';
import { Request, Response } from 'express';
import _Agency from '../models/agency.model';
import _Register, { TRegister } from '../models/register.model';
import { convertToNumber, getTotalPage } from '../utils';

/**
 * [ADMIN,PM] getRegisterList
 * TODO:
 * [x] - Phân trang, Tìm kiếm
 * [x] - Bộ lọc
 * [] - Sắp xếp
 */
export const getRegisterList = async (req: Request, res: Response): Promise<void> => {
  const { status, keyword, page, limit, sort } = req.query; // => all string | undefined
  let filter: any = {};

  if (status) {
    filter.status = status;
  }

  if (keyword) {
    const regex = new RegExp(`${keyword}`, 'i');
    const regexCond = { $regex: regex };
    console.log(regexCond);
    filter['$or'] = [{ name: regexCond }, { phone: regexCond }];
  }

  const currentPage = convertToNumber(page) || 1;

  const limitNumber = convertToNumber(limit) || 10;

  const totalRegister = await _Register.countDocuments(filter);

  const foundRegisterList = await _Register
    .find(filter)
    .skip((currentPage - 1) * limitNumber)
    .limit(limitNumber)
    .sort([
      ['status', 1],
      ['updatedAt', -1],
    ]);

  res.status(200).json({
    status: 1,
    message: 'Get Register List Successfully.',
    data: {
      register_list: foundRegisterList,
      meta_data: {
        page: currentPage,
        limit: limitNumber,
        total: totalRegister,
        totalPage: getTotalPage(totalRegister, limitNumber),
      },
    },
  });
};

/**
 * [ADMIN,PM] getRegisterDetail
 */
export const getRegisterDetail = async (req: Request, res: Response): Promise<void> => {
  const { registerId } = req.params;
  const foundRegister = await _Register.findById(registerId);
  res.status(200).json({
    status: 1,
    message: 'Get Register Profile Successfully.',
    data: {
      register_detail: foundRegister,
    },
  });
};

/**
 * [ADMIN,PM] updateRegisterDetail
 */
export const updateRegisterDetail = async (
  req: Request<{ registerId: string }, {}, TRegister>,
  res: Response,
): Promise<void> => {
  const { registerId } = req.params;
  const registerUpdateData = req.body;
  const updatedRegister = await _Register.findByIdAndUpdate(registerId, registerUpdateData, {
    new: true,
    omitUndefined: true,
  });
  res.status(200).json({
    status: 1,
    message: 'Update Register Profile Successfully.',
  });
};

/**
 * [ADMIN,PM] confirmRegister
 */
export const confirmRegister = async (req: Request, res: Response): Promise<void> => {
  const { registerId } = req.params;
  const { code } = req.query;
  const { address, lat_address, long_address, lat, long } = req.body;

  const foundRegister = await _Register.findOne({
    $and: [{ _id: registerId }, { code: code }],
  });

  if (foundRegister?.status === 1) throw new BadRequestError('Account already confirmed');

  const updatedRegister = await _Register.findByIdAndUpdate(
    registerId,
    { status: 1, isAgency: true },
    {
      new: true,
      omitUndefined: true,
    },
  );

  if (!updatedRegister) throw new BadRequestError('Something went wrong when updating');

  const { _id, phone, isAgency, ...registerData } = updatedRegister.toObject();

  const foundAgency = await _Agency.findOne({ phone });
  if (!foundAgency) {
    const newAgency = await new _Agency({
      phone,
      address,
      lat_address,
      long_address,
      lat,
      long,
      ...registerData,
    }).save();
  }

  res.status(200).json({
    status: 1,
    message: 'Confirm Register Successfully.',
  });
};
