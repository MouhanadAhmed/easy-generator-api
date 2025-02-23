import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { MongooseQueryHelper } from '../mongoose.query.helper';

@Injectable()
export class Repository {
  async doesDocumentExist(model: Model<any>, uniqueKey: any): Promise<boolean> {
    const isFound = await model.findOne(uniqueKey);
    return isFound !== null;
  }

  async findOne(model: Model<any>, uniqueKey: any) {
    return model.findOne(uniqueKey);
  }

  async getAll(model: Model<any>, filters: any, query: any, sort?: any) {
    const apiFeaturesCount = new MongooseQueryHelper(
      model.find(filters),
      query
    ).filter();
    const totalCount = await apiFeaturesCount.totalCount();

    const pageLength = query.pageLength || 30;

    const apiFeatures = new MongooseQueryHelper(model.find(filters), query)
      .filter()
      .pagination(pageLength)
      .search();

    if (sort) {
      apiFeatures.getQuery().sort(sort);
    }

    let documents = await apiFeatures.getQuery().exec();

    // // Check if the 'order' property exists before sorting
    // if (model.schema.paths.order) {
    //   documents = documents.sort((a, b) => a.order - b.order);
    // }

    const pages = Math.ceil(totalCount / pageLength);
    return {
      page: apiFeatures.page,
      pages: pages,
      count: totalCount,
      pageLength: documents.length,
      documents,
    };
  }

  async deleteOne(model: Model<any>, id: string) {
    const document = await model.findByIdAndDelete(id);
    return document;
  }

  async addOne(model: Model<any>, body: any, uniqueKey?: any) {
    const document = new model(body);
    await document.save();
    return document;
  }

  async updateOne(model: Model<any>, id: string, body: any) {
    const document = await model.findByIdAndUpdate(id, body, {
      new: true,
    });
    return document;
  }

  async getById(model: Model<any>, id: string) {
    const response = await model.findById(id);
    return response;
  }
}
