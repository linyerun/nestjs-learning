import { Injectable } from "../core/decorators";

export interface User {
  id: number;
  name: string;
}

// @Injectable()
export class UserService {
  private users: User[] = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ];

  findAll(keyword?: string) {
    if (!keyword) return this.users;
    const kw = keyword.toLowerCase();
    return this.users.filter((u) => u.name.toLowerCase().includes(kw));
  }

  findOne(id: number) {
    return (
      this.users.find((u) => u.id === id) ?? { message: `user ${id} 不存在` }
    );
  }

  create(name: string) {
    const user = { id: this.users.length + 1, name };
    this.users.push(user);
    return user;
  }
}
