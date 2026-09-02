import { Request, Response } from 'express';
import Pricing from '../models/pricingModel';

// ======================================================
// GET ALL PRICING
// ======================================================

export const getPricing = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    let pricing = await Pricing.findOne();

    if (!pricing) {
      pricing = await Pricing.create({});
    }

    res.status(200).json({
      success: true,
      pricing,
    });
  } catch (error) {
    console.error('❌ Get pricing error:', error);

    res.status(500).json({
      success: false,
      message: 'Unable to retrieve pricing.',
    });
  }
};

// ======================================================
// UPDATE ALL PRICING
// ======================================================

export const updatePricing = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      applicationFee,
      basicInitiation,
      standardInitiation,
      premiumInitiation,
      opeleConsultation,
      ikinConsultation,
      oneHourConsultation,
    } = req.body;

    const prices = [
      applicationFee,
      basicInitiation,
      standardInitiation,
      premiumInitiation,
      opeleConsultation,
      ikinConsultation,
      oneHourConsultation,
    ];

    if (prices.some((price) => price === undefined || Number(price) < 0)) {
      res.status(400).json({
        success: false,
        message: 'All prices must be valid positive numbers.',
      });

      return;
    }

    const pricing = await Pricing.findOneAndUpdate(
      {},
      {
        applicationFee: Number(applicationFee),
        basicInitiation: Number(basicInitiation),
        standardInitiation: Number(standardInitiation),
        premiumInitiation: Number(premiumInitiation),
        opeleConsultation: Number(opeleConsultation),
        ikinConsultation: Number(ikinConsultation),
        oneHourConsultation: Number(oneHourConsultation),
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    res.status(200).json({
      success: true,
      message: 'Pricing updated successfully.',
      pricing,
    });
  } catch (error) {
    console.error('❌ Update pricing error:', error);

    res.status(500).json({
      success: false,
      message: 'Unable to update pricing.',
    });
  }
};
