export const state = {
  query: "",
  page: 1,
  limit: 8,
  articles: [],
  latestRequestId: 0,
};

export function setQuery(query) {
  state.query = query;
  state.page = 1;
}

export function nextPage() {
  state.page += 1;
}

export function prevPage() {
  if (state.page > 1) {
    state.page -= 1;
  }
}

export function setArticles(articles) {
  state.articles = articles;
}

export function getNewRequestId() {
  state.latestRequestId += 1;
  return state.latestRequestId;
}
