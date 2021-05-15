const { DataSource } = require("apollo-datasource");
const isEmail = require("isemail");

export default class PostAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the post making requests
   */
  initialize(config) {
    this.context = config.context;
  }

  /**
   * Post can be called with an argument that includes email, but it doesn't
   * have to be. If the post is already on the context, it will use that post
   * instead
   */
  async findOrCreatePost({ email: emailArg } = {}) {
    const email =
      this.context && this.context.post ? this.context.post.email : emailArg;
    if (!email || !isEmail.validate(email)) return null;

    const posts = await this.store.posts.findOrCreate({ where: { email } });
    return posts && posts[0] ? posts[0] : null;
  }

  async bookTrips({ launchIds }) {
    const postId = this.context.post.id;
    if (!postId) return;

    let results = [];

    // for each launch id, try to book the trip and add it to the results array
    // if successful
    for (const launchId of launchIds) {
      const res = await this.bookTrip({ launchId });
      if (res) results.push(res);
    }

    return results;
  }

  async bookTrip({ launchId }) {
    const postId = this.context.post.id;
    const res = await this.store.trips.findOrCreate({
      where: { postId, launchId },
    });
    return res && res.length ? res[0].get() : false;
  }

  async cancelTrip({ launchId }) {
    const postId = this.context.post.id;
    return !!this.store.trips.destroy({ where: { postId, launchId } });
  }

  async getLaunchIdsByPost() {
    const postId = this.context.post.id;
    const found = await this.store.trips.findAll({
      where: { postId },
    });
    return found && found.length
      ? found.map((l) => l.dataValues.launchId).filter((l) => !!l)
      : [];
  }

  async isBookedOnLaunch({ launchId }) {
    if (!this.context || !this.context.post) return false;
    const postId = this.context.post.id;
    const found = await this.store.trips.findAll({
      where: { postId, launchId },
    });
    return found && found.length > 0;
  }
}
