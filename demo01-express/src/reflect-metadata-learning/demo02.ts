import "reflect-metadata";

class Article {
  title!: string;
  views!: number;
}

Reflect.defineMetadata("field:label", "文章标题", Article.prototype, "title");
Reflect.defineMetadata("field:required", true, Article.prototype, "title");
Reflect.defineMetadata("field:label", "阅读量", Article.prototype, "views");

const titleLabel = Reflect.getMetadata(
  "field:label",
  Article.prototype,
  "title",
);
console.log(titleLabel);

export {};
