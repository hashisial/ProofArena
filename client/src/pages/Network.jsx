import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../components/Button.jsx";
import { EmptyState } from "../components/EmptyState.jsx";
import { LoadingState } from "../components/LoadingState.jsx";
import { SaaSLayout } from "../components/SaaSLayout.jsx";
import { StatusBanner } from "../components/StatusBanner.jsx";
import { useAuth } from "../hooks/useAuth.js";
import {
  createNetworkPost,
  createNetworkPostComment,
  getNetworkFeed,
  shareNetworkPost,
  toggleNetworkPostLike,
} from "../services/api.js";
import { formatDateTime, getInitials } from "../utils/index.js";

const initialPostForm = {
  content: "",
  mediaName: "",
  mediaType: "link",
  mediaUrl: "",
  type: "update",
  workDescription: "",
  workTitle: "",
  workUrl: "",
};

function getAuthorName(author) {
  return author?.name || author?.fullName || author?.email || "User";
}

function AuthorAvatar({ author }) {
  if (author?.avatar) {
    return (
      <img
        alt=""
        className="h-12 w-12 rounded-2xl object-cover shadow-[0_14px_35px_rgba(63, 98, 18, 0.12)]"
        src={author.avatar}
      />
    );
  }

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#3F6212] text-sm font-bold text-white shadow-[0_14px_35px_rgba(63, 98, 18, 0.22)]">
      {getInitials(getAuthorName(author))}
    </div>
  );
}

function SharedPost({ post }) {
  if (!post) {
    return null;
  }

  return (
    <div className="mt-4 rounded-[1.35rem] border border-[#3F6212]/14 bg-[#fffbeb] p-4">
      <div className="flex items-center gap-3">
        <AuthorAvatar author={post.author} />
        <div>
          <p className="text-sm font-bold text-black">{getAuthorName(post.author)}</p>
          <p className="text-xs font-semibold text-black/42">
            {formatDateTime(post.createdAt, { fallback: "" })}
          </p>
        </div>
      </div>
      {post.content ? (
        <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-black/62">
          {post.content}
        </p>
      ) : null}
      {post.work?.title ? (
        <div className="mt-4 rounded-2xl bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#3F6212]">
            Shared work
          </p>
          <p className="mt-2 font-bold text-black">{post.work.title}</p>
          <p className="mt-1 text-sm leading-6 text-black/52">{post.work.description}</p>
        </div>
      ) : null}
    </div>
  );
}

function CommentList({ comments }) {
  if (!comments?.length) {
    return null;
  }

  return (
    <div className="mt-4 grid gap-3">
      {comments.map((comment) => (
        <div
          className="rounded-2xl border border-black/10 bg-[#fffbeb] p-3"
          key={comment._id}
        >
          <p className="text-sm font-bold text-black">{getAuthorName(comment.author)}</p>
          <p className="mt-1 text-sm leading-6 text-black/58">{comment.content}</p>
        </div>
      ))}
    </div>
  );
}

function PostCard({
  commentDraft,
  isCommenting,
  isLiking,
  isSharing,
  onComment,
  onCommentDraftChange,
  onLike,
  onShare,
  post,
}) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-[#3F6212]/14 bg-white p-5 shadow-[0_24px_75px_rgba(63, 98, 18, 0.08)] transition hover:-translate-y-0.5 hover:border-[#3F6212]/35 hover:shadow-[0_30px_90px_rgba(63, 98, 18, 0.15)] md:p-6">
      <div className="flex items-start gap-4">
        <AuthorAvatar author={post.author} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-bold text-black">{getAuthorName(post.author)}</p>
            <span className="rounded-full border border-[#3F6212]/16 bg-[#3F6212]/8 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#365314]">
              {post.type}
            </span>
          </div>
          <p className="mt-1 text-xs font-semibold text-black/42">
            {formatDateTime(post.createdAt, { fallback: "" })}
          </p>
        </div>
      </div>

      {post.content ? (
        <p className="mt-5 whitespace-pre-wrap text-base leading-7 text-black/68">
          {post.content}
        </p>
      ) : null}

      {post.work?.title || post.work?.url ? (
        <div className="mt-5 rounded-[1.5rem] border border-[#3F6212]/14 bg-[radial-gradient(circle_at_top_right,rgba(63, 98, 18, 0.12),transparent_30%),#fffbeb] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#3F6212]">
            Work shared
          </p>
          <h3 className="mt-2 text-xl font-bold tracking-[-0.04em] text-black">
            {post.work.title || "Shared work"}
          </h3>
          {post.work.description ? (
            <p className="mt-2 text-sm leading-6 text-black/58">{post.work.description}</p>
          ) : null}
          {post.work.url ? (
            <a
              className="mt-3 inline-flex text-sm font-bold text-[#365314] underline decoration-[#65A30D]/50 underline-offset-4"
              href={post.work.url}
              rel="noreferrer"
              target="_blank"
            >
              Open work
            </a>
          ) : null}
        </div>
      ) : null}

      {post.media?.length ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {post.media.map((item) => (
            <a
              className="rounded-2xl border border-black/10 bg-[#fffbeb] px-4 py-3 text-sm font-bold text-black transition hover:border-[#3F6212]/35 hover:text-[#365314]"
              href={item.url}
              key={item.url}
              rel="noreferrer"
              target="_blank"
            >
              {item.name || item.url}
            </a>
          ))}
        </div>
      ) : null}

      <SharedPost post={post.sharedPost} />

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-black/10 pt-4">
        <button
          className={`rounded-full border px-4 py-2 text-sm font-bold transition hover:-translate-y-0.5 ${
            post.likedByMe
              ? "border-[#3F6212] bg-[#3F6212] text-white shadow-[0_16px_40px_rgba(63, 98, 18, 0.2)]"
              : "border-black/10 bg-white text-black/62 hover:border-[#3F6212]/35 hover:text-[#365314]"
          }`}
          disabled={isLiking}
          onClick={() => onLike(post._id)}
          type="button"
        >
          {post.likedByMe ? "Liked" : "Like"} {post.likesCount}
        </button>
        <button
          className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-bold text-black/62 transition hover:-translate-y-0.5 hover:border-[#3F6212]/35 hover:text-[#365314]"
          disabled={isSharing}
          onClick={() => onShare(post._id)}
          type="button"
        >
          Share {post.sharesCount}
        </button>
        <span className="rounded-full bg-[#3F6212]/8 px-4 py-2 text-sm font-bold text-[#365314]">
          {post.commentsCount} comments
        </span>
      </div>

      <CommentList comments={post.comments} />

      <form
        className="mt-4 flex flex-col gap-3 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          onComment(post._id);
        }}
      >
        <input
          className="min-h-12 flex-1 rounded-full border border-black/10 bg-[#fffbeb] px-4 text-sm font-semibold text-black outline-none transition placeholder:text-black/32 focus:border-[#3F6212]/45 focus:ring-4 focus:ring-[#3F6212]/10"
          onChange={(event) => onCommentDraftChange(post._id, event.target.value)}
          placeholder="Write a comment..."
          value={commentDraft ?? ""}
        />
        <Button
          className="min-h-12 px-5"
          disabled={isCommenting || !(commentDraft ?? "").trim()}
          type="submit"
        >
          Comment
        </Button>
      </form>
    </article>
  );
}

export function Network() {
  const [form, setForm] = useState(initialPostForm);
  const [commentDrafts, setCommentDrafts] = useState({});
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const {
    data: posts = [],
    error,
    isError,
    isLoading,
  } = useQuery({
    queryFn: () => getNetworkFeed(submittedSearch),
    queryKey: ["network", "feed", submittedSearch],
    staleTime: 10_000,
  });
  const feedStats = useMemo(
    () =>
      posts.reduce(
        (stats, post) => ({
          comments: stats.comments + (post.commentsCount ?? 0),
          likes: stats.likes + (post.likesCount ?? 0),
          shares: stats.shares + (post.sharesCount ?? 0),
        }),
        { comments: 0, likes: 0, shares: 0 },
      ),
    [posts],
  );
  const createMutation = useMutation({
    mutationFn: createNetworkPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["network", "feed"] });
      setForm(initialPostForm);
      setMessage("Post published.");
    },
    onError: (mutationError) => setMessage(mutationError.message ?? "Unable to post update."),
  });
  const likeMutation = useMutation({
    mutationFn: toggleNetworkPostLike,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["network", "feed"] }),
  });
  const commentMutation = useMutation({
    mutationFn: ({ content, postId }) => createNetworkPostComment(postId, { content }),
    onSuccess: (_comment, variables) => {
      setCommentDrafts((current) => ({ ...current, [variables.postId]: "" }));
      queryClient.invalidateQueries({ queryKey: ["network", "feed"] });
    },
    onError: (mutationError) => setMessage(mutationError.message ?? "Unable to add comment."),
  });
  const shareMutation = useMutation({
    mutationFn: (postId) => shareNetworkPost(postId, { content: "Shared this with the network." }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["network", "feed"] });
      setMessage("Post shared to your network.");
    },
    onError: (mutationError) => setMessage(mutationError.message ?? "Unable to share post."),
  });

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setMessage("");
  }

  function submitPost(event) {
    event.preventDefault();

    const media = form.mediaUrl.trim()
      ? [
          {
            name: form.mediaName.trim(),
            type: form.mediaType,
            url: form.mediaUrl.trim(),
          },
        ]
      : [];

    createMutation.mutate({
      content: form.content,
      media,
      type: form.type,
      work:
        form.type === "work"
          ? {
              description: form.workDescription,
              title: form.workTitle,
              url: form.workUrl,
            }
          : {},
    });
  }

  function submitSearch(event) {
    event.preventDefault();
    setSubmittedSearch(search.trim());
  }

  function updateCommentDraft(postId, value) {
    setCommentDrafts((current) => ({ ...current, [postId]: value }));
  }

  function submitComment(postId) {
    const content = (commentDrafts[postId] ?? "").trim();

    if (!content) {
      return;
    }

    commentMutation.mutate({ content, postId });
  }

  return (
    <SaaSLayout eyebrow="Networking" title="Community feed">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-5">
          <section className="overflow-hidden rounded-[2rem] border border-[#3F6212]/14 bg-[radial-gradient(circle_at_90%_10%,rgba(63, 98, 18, 0.16),transparent_32%),#ffffff] p-5 shadow-[0_24px_75px_rgba(63, 98, 18, 0.08)] md:p-6">
            <div className="flex items-start gap-4">
              <AuthorAvatar author={user} />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3F6212]">
                  Share with the network
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-[-0.055em] text-black">
                  Post an update or show your latest work.
                </h2>
              </div>
            </div>

            <form className="mt-5 grid gap-4" onSubmit={submitPost}>
              <div className="flex flex-wrap gap-2">
                {[
                  ["update", "Update"],
                  ["work", "Share Work"],
                ].map(([value, label]) => (
                  <button
                    className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                      form.type === value
                        ? "border-[#3F6212] bg-[#3F6212] text-white shadow-[0_16px_40px_rgba(63, 98, 18, 0.2)]"
                        : "border-black/10 bg-white text-black/62 hover:border-[#3F6212]/35"
                    }`}
                    key={value}
                    onClick={() => setForm((current) => ({ ...current, type: value }))}
                    type="button"
                  >
                    {label}
                  </button>
                ))}
              </div>
              <textarea
                className="min-h-28 resize-none rounded-[1.4rem] border border-black/10 bg-[#fffbeb] px-4 py-3 text-sm font-semibold text-black outline-none transition placeholder:text-black/32 focus:border-[#3F6212]/45 focus:ring-4 focus:ring-[#3F6212]/10"
                name="content"
                onChange={updateForm}
                placeholder="What are you building, learning, launching, or looking for?"
                value={form.content}
              />

              {form.type === "work" ? (
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    className="rounded-2xl border border-black/10 bg-[#fffbeb] px-4 py-3 text-sm font-semibold text-black outline-none transition placeholder:text-black/32 focus:border-[#3F6212]/45 focus:ring-4 focus:ring-[#3F6212]/10"
                    name="workTitle"
                    onChange={updateForm}
                    placeholder="Work title"
                    value={form.workTitle}
                  />
                  <input
                    className="rounded-2xl border border-black/10 bg-[#fffbeb] px-4 py-3 text-sm font-semibold text-black outline-none transition placeholder:text-black/32 focus:border-[#3F6212]/45 focus:ring-4 focus:ring-[#3F6212]/10"
                    name="workUrl"
                    onChange={updateForm}
                    placeholder="Work URL"
                    value={form.workUrl}
                  />
                  <textarea
                    className="min-h-20 rounded-[1.25rem] border border-black/10 bg-[#fffbeb] px-4 py-3 text-sm font-semibold text-black outline-none transition placeholder:text-black/32 focus:border-[#3F6212]/45 focus:ring-4 focus:ring-[#3F6212]/10 md:col-span-2"
                    name="workDescription"
                    onChange={updateForm}
                    placeholder="Short work description"
                    value={form.workDescription}
                  />
                </div>
              ) : null}

              <div className="grid gap-3 md:grid-cols-[1fr_150px_1fr]">
                <input
                  className="rounded-2xl border border-black/10 bg-[#fffbeb] px-4 py-3 text-sm font-semibold text-black outline-none transition placeholder:text-black/32 focus:border-[#3F6212]/45 focus:ring-4 focus:ring-[#3F6212]/10"
                  name="mediaUrl"
                  onChange={updateForm}
                  placeholder="Optional media or link URL"
                  value={form.mediaUrl}
                />
                <select
                  className="rounded-2xl border border-black/10 bg-[#fffbeb] px-4 py-3 text-sm font-bold text-black outline-none transition focus:border-[#3F6212]/45 focus:ring-4 focus:ring-[#3F6212]/10"
                  name="mediaType"
                  onChange={updateForm}
                  value={form.mediaType}
                >
                  <option value="link">Link</option>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="document">Document</option>
                </select>
                <input
                  className="rounded-2xl border border-black/10 bg-[#fffbeb] px-4 py-3 text-sm font-semibold text-black outline-none transition placeholder:text-black/32 focus:border-[#3F6212]/45 focus:ring-4 focus:ring-[#3F6212]/10"
                  name="mediaName"
                  onChange={updateForm}
                  placeholder="Media label"
                  value={form.mediaName}
                />
              </div>
              <Button
                className="justify-self-start"
                isLoading={createMutation.isPending}
                loadingLabel="Publishing..."
                type="submit"
              >
                Publish Post
              </Button>
            </form>
          </section>

          {message ? <StatusBanner>{message}</StatusBanner> : null}
          {isError ? (
            <StatusBanner tone="error">
              {error?.message ?? "Unable to load network feed."}
            </StatusBanner>
          ) : null}

          {isLoading ? <LoadingState columns={3} /> : null}
          {!isLoading && posts.length === 0 ? (
            <EmptyState
              description="Post the first update, share a project, or search for a topic in your network."
              title="No network posts yet"
            />
          ) : null}
          {!isLoading && posts.length > 0 ? (
            <div className="grid gap-5">
              {posts.map((post) => (
                <PostCard
                  commentDraft={commentDrafts[post._id]}
                  isCommenting={commentMutation.isPending}
                  isLiking={likeMutation.isPending}
                  isSharing={shareMutation.isPending}
                  key={post._id}
                  onComment={submitComment}
                  onCommentDraftChange={updateCommentDraft}
                  onLike={(postId) => likeMutation.mutate(postId)}
                  onShare={(postId) => shareMutation.mutate(postId)}
                  post={post}
                />
              ))}
            </div>
          ) : null}
        </div>

        <aside className="grid content-start gap-5">
          <section className="rounded-[2rem] border border-[#3F6212]/14 bg-white p-5 shadow-[0_24px_75px_rgba(63, 98, 18, 0.08)]">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3F6212]">
              Search feed
            </p>
            <form className="mt-4 grid gap-3" onSubmit={submitSearch}>
              <input
                className="rounded-2xl border border-black/10 bg-[#fffbeb] px-4 py-3 text-sm font-semibold text-black outline-none transition placeholder:text-black/32 focus:border-[#3F6212]/45 focus:ring-4 focus:ring-[#3F6212]/10"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search posts or work"
                value={search}
              />
              <Button type="submit">Search</Button>
              {submittedSearch ? (
                <Button
                  onClick={() => {
                    setSearch("");
                    setSubmittedSearch("");
                  }}
                  type="button"
                  variant="outline"
                >
                  Clear Search
                </Button>
              ) : null}
            </form>
          </section>

          <section className="rounded-[2rem] border border-[#3F6212]/14 bg-white p-5 shadow-[0_24px_75px_rgba(63, 98, 18, 0.08)]">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3F6212]">
              Network pulse
            </p>
            <div className="mt-4 grid gap-3">
              {[
                ["Posts", posts.length],
                ["Likes", feedStats.likes],
                ["Comments", feedStats.comments],
                ["Shares", feedStats.shares],
              ].map(([label, value]) => (
                <div className="flex items-center justify-between rounded-2xl bg-[#fffbeb] px-4 py-3" key={label}>
                  <span className="text-sm font-semibold text-black/56">{label}</span>
                  <strong className="text-lg text-black">{value}</strong>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </SaaSLayout>
  );
}
