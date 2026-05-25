export function asyncHandler(handler) {
  return (request, response, next) =>
    Promise.resolve()
      .then(() => handler(request, response, next))
      .catch(next);
}
