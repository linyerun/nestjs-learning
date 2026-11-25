export {};

import "reflect-metadata";

class User {}

// 给类写入元数据
Reflect.defineMetadata("class:desc", "用户实体类", User);

// 沿着原型链向上找符合要求的元数据
const desc1 = Reflect.getMetadata("class:desc", User);

console.log(desc1);
console.log(typeof desc1);
