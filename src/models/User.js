import { Model } from "@vuex-orm/core";

export default class User extends Model {
  static entity = "users";

  static fields() {
    return {
      id: this.uid(),
      firstName: this.string(null),
      lastName: this.string(null),
      nickname: this.string(null),
      email: this.string(null),
      password: this.string(null),
    };
  }
}
