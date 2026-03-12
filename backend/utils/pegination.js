export const Pagination = (page, limit) => {
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 12;

  const skip = (pageNumber - 1) * limitNumber;

  return {
    page: pageNumber,
    limit: limitNumber,
    skip,
  };
};
