import { Query, Document } from 'mongoose';

export class MongooseQueryHelper<T extends Document> {
  private mongooseQuery: Query<T[], T>;
  private queryString: any;
  public page: number;

  constructor(mongooseQuery: Query<T[], T>, queryString: any) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
    this.page = 1; // Default value for page
  }

  pagination(pageLength) {
    let page = parseInt(this.queryString.page, 10) || 1;
    page = page > 0 ? page : 1;

    const skip = (page - 1) * pageLength;
    this.page = page; // Set the page property

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(pageLength);

    return this;
  }

  filter() {
    let filterObj = { ...this.queryString };
    const excludeQuery = ['page', 'sort', 'keyword', 'fields', 'pageLength'];
    excludeQuery.forEach((q) => delete filterObj[q]);

    filterObj = JSON.stringify(filterObj).replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );
    filterObj = JSON.parse(filterObj);

    this.mongooseQuery = this.mongooseQuery.find(filterObj);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    }
    return this;
  }

  search() {
    if (this.queryString.keyword) {
      this.mongooseQuery = this.mongooseQuery.find({
        $or: [
          { name: { $regex: this.queryString.keyword, $options: 'i' } },
          { description: { $regex: this.queryString.keyword, $options: 'i' } },
        ],
      });
    }
    return this;
  }

  fields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.select(fields);
    }
    return this;
  }

  getQuery() {
    return this.mongooseQuery;
  }

  async totalCount(): Promise<number> {
    const countQuery = this.mongooseQuery.find();

    this.filter();

    this.search();

    return await countQuery.countDocuments();
  }
}
