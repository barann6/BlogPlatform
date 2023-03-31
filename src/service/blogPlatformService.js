// import store from '../store';

export default class blogPlatformService {
  // static #token = () => store.getState().authorization.token;

  static #customFetch = async (urlPart, payload) => {
    const response = await fetch(
      `https://blog.kata.academy/api/${urlPart}`,
      payload
    );
    return response;
  };

  static getArticlesList = async (page = 1, token) =>
    await this.#customFetch(
      `articles?limit=5&offset=${0 + (page - 1) * 5}`,
      token && {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

  static getArticle = async ({ slug, token }) =>
    await this.#customFetch(
      `articles/${slug}`,
      token && {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

  static #interactionWithArticle =
    (method) =>
    async ({ data, token, slug = '' }) =>
      await this.#customFetch(`articles/${slug}`, {
        method,
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ article: data }),
      });
  static postArticle = this.#interactionWithArticle('POST');
  static editeArticle = this.#interactionWithArticle('PUT');
  static deleteArticle = this.#interactionWithArticle('DELETE');

  static favoriteArticle = async (slug, token, favorite) =>
    await this.#customFetch(`articles/${slug}/favorite`, {
      method: favorite ? 'DELETE' : 'POST',
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

  static signUp = async (user) =>
    await this.#customFetch('users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: user }),
    });

  static signIn = async (user) =>
    await this.#customFetch('users/login ', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: user }),
    });

  static getUserData = async (token) =>
    await this.#customFetch('user', {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

  static updateUserData = async ({ token, user }) =>
    await this.#customFetch('user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ user: user }),
    });
}
