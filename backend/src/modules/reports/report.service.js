import Report from './report.model.js';

export const createReport = async (data) => {
  const report = new Report(data);
  return report.save();
};

export const getReports = async (filter = {}, options = {}) => {
  return Report.find(filter)
    .sort({ createdAt: -1 })
    .limit(options.limit || 0)
    .skip(options.skip || 0)
    .lean();
};

export const getReportById = async (id) => {
  return Report.findById(id).lean();
};

export const updateReport = async (id, data) => {
  return Report.findByIdAndUpdate(id, data, { new: true }).lean();
};

export const deleteReport = async (id) => {
  return Report.findByIdAndDelete(id);
};
