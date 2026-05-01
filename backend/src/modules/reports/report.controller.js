import * as reportService from './report.service.js';

export const createReport = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?._id || req.user?.id;
    const data = { ...req.body, author: userId };
    const report = await reportService.createReport(data);
    res.status(201).json(report);
  } catch (err) {
    next(err);
  }
};

export const getReports = async (req, res, next) => {
  try {
    const reports = await reportService.getReports({}, {});
    res.json(reports);
  } catch (err) {
    next(err);
  }
};

export const getReport = async (req, res, next) => {
  try {
    const report = await reportService.getReportById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (err) {
    next(err);
  }
};

export const updateReport = async (req, res, next) => {
  try {
    const report = await reportService.updateReport(req.params.id, req.body);
    res.json(report);
  } catch (err) {
    next(err);
  }
};

export const deleteReport = async (req, res, next) => {
  try {
    await reportService.deleteReport(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const analytics = await reportService.getGlobalAnalytics();
    res.json({ success: true, data: analytics });
  } catch (err) {
    next(err);
  }
};
