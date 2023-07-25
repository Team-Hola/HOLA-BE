import { PostCreateRequest } from './dto/post-create-request';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FlattenMaps, Model, Types } from 'mongoose';
import { PostMainFindResult, PostMainListResponse } from './dto/post-main-list-response';
import { PostRecommendedListResponse } from './dto/post-recommended-list-response';
import { Post } from './schema/post.schema';
import { PostUpdateRequest } from './dto/post-update-request';

export type PostPOJO = FlattenMaps<Post>;

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async findPostDetail(postId: Types.ObjectId): Promise<PostPOJO> {
    return await this.postModel.findById(postId).populate('author', 'nickName image').lean();
  }

  async findById(postId: Types.ObjectId): Promise<PostPOJO> {
    return await this.postModel.findById(postId).lean();
  }
  async findTopPost(limit: number): Promise<PostPOJO[]> {
    // 글 상태
    const today: Date = new Date();
    const daysAgo: Date = new Date();
    daysAgo.setDate(today.getDate() - 7); // 7일 이내

    const query: any = {};
    query.isDeleted = false;
    query.isClosed = false;
    query.createdAt = { $gte: daysAgo };

    // Query
    const result = await this.postModel
      .find(query)
      .sort('-views')
      .limit(Number(limit))
      .select({
        type: 1,
        startDate: 1,
        title: 1,
        language: 1,
        positions: 1,
        comments: 1,
        views: 1,
        author: 1,
        likes: 1,
        createdAt: 1,
      })
      .populate('author', 'nickName image')
      .lean();
    return result;
  }

  private createQueryInFindMain(
    language: string[] | null,
    isClosed: boolean = false,
    type: string | null,
    position: string | null,
    search: string | null,
    onOffLine: string | null,
  ) {
    const query: any = {};

    query.isDeleted = false;
    if (language) query.language = { $in: language };
    if (position && position != 'ALL') query.positions = position;
    if (onOffLine && onOffLine != 'ALL') query.onlineOrOffline = onOffLine;
    if (type && type != '0') query.type = type;
    if (isClosed != null && isClosed == false) query.isClosed = false; // false : 모집중만 보기, true: 전체 보기

    const aggregateSearch = [];
    if (search) {
      aggregateSearch.push({
        // text search index
        $search: {
          index: 'posts_text_search',
          text: {
            query: search,
            path: {
              wildcard: '*',
            },
          },
        },
      });
    }
    return {
      query,
      aggregateSearch,
    };
  }

  async findMainList(
    page: number = 1,
    language: string[] | null,
    isClosed: boolean = false,
    type: string | null,
    position: string | null,
    search: string | null,
    onOffLine: string | null,
  ): Promise<PostMainFindResult[]> {
    const itemsPerPage = 4 * 5; // 한 페이지에 표현할 수
    const pageToSkip = (page - 1) * itemsPerPage;

    const { query, aggregateSearch } = this.createQueryInFindMain(
      language,
      isClosed,
      type,
      position,
      search,
      onOffLine,
    );
    const aggregate = [
      ...aggregateSearch,
      { $match: query },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          pipeline: [{ $project: { _id: 1, nickName: 1, image: 1 } }],
          as: 'author',
        },
      },
      {
        $project: {
          type: 1,
          startDate: 1,
          title: 1,
          language: 1,
          positions: 1,
          comments: 1,
          views: 1,
          author: 1,
          likes: 1,
          createdAt: 1,
          isClosed: 1,
          totalLikes: 1,
        },
      },
    ];

    const posts = await this.postModel.aggregate(aggregate).sort('-createdAt').skip(pageToSkip).limit(itemsPerPage);
    // author array to object
    const result = posts.map((post: any) => {
      if (post.author.length > 0) post.author = post.author[post.author.length - 1];
      return post;
    });

    return result;
  }

  async findMainLastPage(
    language: string[] | null,
    isClosed: boolean = false,
    type: string | null,
    position: string | null,
    search: string | null,
    onOffLine: string | null,
  ) {
    const { query, aggregateSearch } = this.createQueryInFindMain(
      language,
      isClosed,
      type,
      position,
      search,
      onOffLine,
    );
    const aggregate = [...aggregateSearch, { $match: query }, { $count: 'lastPage' }];
    const lastPage = await this.postModel.aggregate(aggregate);
    return lastPage[0].lastPage;
  }

  // 추천 글 조회
  // - 읽고 있는 글과 기술 스택이 같은 글을 조회
  async findRecommendedPostByLanguage(
    postId: Types.ObjectId,
    language: string[],
    limit: number,
    userId: Types.ObjectId | null,
  ): Promise<PostRecommendedListResponse[]> {
    let query: any = {};
    query.isDeleted = false;
    query.isClosed = false;
    query.language = { $in: language };
    const today = new Date();
    query.createdAt = { $gte: today.setDate(today.getDate() - 14) }; //2주 이내
    query._id = { $ne: postId }; // 현재 읽고있는 글 제외
    if (userId) query.author = { $ne: userId }; // 사용자가 작성한 글 제외

    return await this.postModel.find(query).sort('-views').limit(limit).select('title').lean();
  }

  // 추천 글 조회
  // - 조회수 기반 추천 글 조회
  // - 기술 스택 기준 추천 후 글 개수가 부족할때 사용
  async findRecommendedPostByView(
    postId: Types.ObjectId,
    limit: number,
    userId: Types.ObjectId | null,
    expectPosts: Types.ObjectId[],
  ): Promise<PostRecommendedListResponse[]> {
    let query: any = {};
    query.isDeleted = false;
    query.isClosed = false;
    const today = new Date();
    query.createdAt = { $gte: today.setDate(today.getDate() - 14) }; //2주 이내
    if (userId) query.author = { $ne: userId }; // 사용자가 작성한 글 제외
    query._id = { $nin: expectPosts, $ne: postId }; // 이미 추천된 글 제외, 현재 읽고있는 글 제외

    return await this.postModel.find(query).sort('-views').limit(limit).select('title').lean();
  }

  async increaseView(postId: Types.ObjectId) {
    await this.postModel.findByIdAndUpdate(postId, {
      $inc: {
        views: 1,
      },
    });
  }
  async findPostByAuthor(userId: Types.ObjectId, offset: number, limit: number) {
    return await this.postModel
      .find({ author: userId, isDeleted: false })
      .skip(offset)
      .limit(limit)
      .populate('author', 'nickName image')
      .sort('-createdAt');
  }

  async createPost(userId: Types.ObjectId, dto: PostCreateRequest) {
    return this.postModel.create({
      ...dto,
      author: userId,
    });
  }

  async updatePost(postId: Types.ObjectId, dto: PostUpdateRequest) {
    return this.postModel.findByIdAndUpdate(postId, dto, {
      new: true,
    });
  }

  async deletePost(postId: Types.ObjectId) {
    await this.postModel.findOneAndUpdate({ _id: postId }, { isDeleted: true, deleteDate: new Date() });
  }

  async addLike(postId: Types.ObjectId, userId: Types.ObjectId) {
    const post: PostPOJO[] = await this.postModel.find({ _id: postId, likes: { $in: [userId] } }).lean();
    const isLikeExist = post.length > 0;

    let result: Post;

    if (!isLikeExist) {
      result = await this.postModel.findByIdAndUpdate(
        { _id: postId },
        {
          $push: {
            likes: {
              _id: userId,
            },
          },
          $inc: {
            totalLikes: 1,
          },
        },
        {
          new: true,
          upsert: true,
        },
      );
    } else {
      result = post[post.length - 1];
    }
    return { likes: result.likes, isLikeExist };
  }

  async deleteLike(postId: Types.ObjectId, userId: Types.ObjectId) {
    const posts = await this.postModel.find({ _id: postId });
    let post: Post | null = posts[posts.length - 1];
    const isLikeExist = post && post.likes.indexOf(userId) > -1;
    if (isLikeExist) {
      post = await this.postModel.findOneAndUpdate(
        { _id: postId },
        {
          $pull: { likes: userId },
          $inc: {
            totalLikes: -1,
          },
        },
        {
          new: true,
        },
      );
    }
    return { likes: post.likes, isLikeExist };
  }

  // 글의 관심 등록한 사용자 리스트를 조회한다.
  async findLikedUsers(postId: Types.ObjectId) {
    const likeUsers = await this.postModel.findById(postId).select('likes');
    if (!likeUsers) return [];
    return likeUsers.likes;
  }

  async findCommentList(postId: Types.ObjectId) {
    const result = await this.postModel.findById(postId).populate('comments.author', 'nickName image');
    return result.comments;
  }

  async createComment(postId: Types.ObjectId, content: string, author: Types.ObjectId) {
    const commentId = new Types.ObjectId();
    const post = await this.postModel.findOneAndUpdate(
      { _id: postId },
      { $push: { comments: { _id: commentId, content, author } } },
      { new: true, upsert: true },
    );
    return { post, commentId };
  }

  async updateComment(commentId: Types.ObjectId, content: string) {
    const comment = await this.postModel.findOneAndUpdate(
      { comments: { $elemMatch: { _id: commentId } } },
      { $set: { 'comments.$.content': content } },
      { new: true },
    );
    //return comment;
  }

  async deleteComment(commentId: Types.ObjectId) {
    const comment = await this.postModel.findOneAndUpdate(
      { comments: { $elemMatch: { _id: commentId } } },
      { $pull: { comments: { _id: commentId } } },
    );
    //return comment;
  }

  async findPostByIdAndAuthor(postId: Types.ObjectId, tokenUserId: Types.ObjectId) {
    return await this.postModel.findOne({ _id: postId, author: tokenUserId });
  }

  async findCommentByIdAndAuthor(commentId: Types.ObjectId, tokenUserId: Types.ObjectId) {
    return await this.postModel.findOne({ comments: { $elemMatch: { _id: commentId, author: tokenUserId } } });
  }

  // 회원 탈퇴 시 사용자가 작성한 글 제거
  async deletePostByAuthor(userId: Types.ObjectId) {
    await this.postModel.deleteMany({ author: userId });
  }

  // 회원 탈퇴 시 사용자가 작성한 댓글 제거
  async deleteCommentByAuthor(userId: Types.ObjectId) {
    await this.postModel.updateMany(
      { comments: { $elemMatch: { author: userId } } },
      { $pull: { comments: { author: userId } } },
    );
  }
}
