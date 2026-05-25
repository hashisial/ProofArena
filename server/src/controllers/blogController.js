import {
  findBlogBySlug,
  findPublishedBlogs,
} from "../services/blogService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getBlogs = asyncHandler(async (request, response) => {
  const blogs = await findPublishedBlogs({
    placement: request.query.placement,
  });

  sendSuccess(response, { items: blogs });
});

export const getBlogBySlug = asyncHandler(async (request, response) => {
  const blog = await findBlogBySlug(request.params.slug);
  sendSuccess(response, blog);
});
