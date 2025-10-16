function buildDateFilter({ from, to, field = 'date' }) {
  const range = {};

  if (from) {
    const fromDate = new Date(from);
    if (!Number.isNaN(fromDate.getTime())) {
      range.$gte = fromDate;
    }
  }

  if (to) {
    const toDate = new Date(to);
    if (!Number.isNaN(toDate.getTime())) {
      range.$lte = toDate;
    }
  }

  return Object.keys(range).length ? { [field]: range } : {};
}

module.exports = { buildDateFilter };
