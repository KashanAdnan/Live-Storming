class Apifeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  search() {
    const keyword = this.queryStr.keyword 
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }
  filter() {
    const queryCopy = { ...this.queryStr };
    // Remove Feilds
    const removeFeilds = ["keyword", "page", "limit"];
    removeFeilds.forEach((key) => delete queryCopy[key]);

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  pagination(resultPage) {
    const currentyPage = Number(this.queryStr.page) || 1;

    const skip = resultPage * (currentyPage - 1);
    this.query = this.query.limit(resultPage).skip(skip);

    return this;
  }
}

module.exports = Apifeatures;
