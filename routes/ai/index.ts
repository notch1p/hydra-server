import { summarizePostDetails } from "./summarizePostDetails";
import { summarizeComments } from "./summarizeComments";
import { filterPosts } from "./filterPosts";

export default {
  "/api/ai/summarizePostDetails": {
    POST: summarizePostDetails,
  },
  "/api/ai/summarizeComments": {
    POST: summarizeComments,
  },
  "/api/ai/filterPosts": {
    POST: filterPosts,
  },
};
