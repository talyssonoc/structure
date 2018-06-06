import { casex } from 'battlecry';

const ALIASES = {
  Number: ["int", "integer"],
  String: ["text"],
  Boolean: ["bool"]
};

export default class Attribute {
  constructor(value) {
    const [name, type, ...modifiers] = value.split(":");
    this.name = name;
    this.type = type || "string";
    this.modifiers = modifiers;
  }

  static alias(type) {
    const lowerType = type.toLowerCase();
    const keys = Object.keys(ALIASES);

    const alias = keys.find(key => {
      return ALIASES[key].find(
        alias => alias.toLowerCase() === lowerType
      );
    });

    return alias || casex(type, 'NaMe');
  }

  get aliasedType() {
    return this.array ? "Array" : this.itemType;
  }

  get itemType() {
    return Attribute.alias(this.type.split("[]")[0]);
  }

  get required() {
    return this.modifiers.includes("required");
  }

  get default() {
    return this.modifiers.includes("default");
  }

  get array() {
    return this.type.includes("[]");
  }

  get complex() {
    return this.array || this.required || this.default;
  }

  get text() {
    if (!this.complex) return `  __naMe__: ${this.aliasedType},`;

    this.contents = [];
    this.push("  __naMe__: {");
    this.push(`    type: ${this.aliasedType},`);
    this.push(`    itemType: ${this.itemType},`, this.array);
    this.push("    required: true,", this.required);
    this.push("    default: [],", this.default);
    this.push("  },");

    return this.contents;
  }

  push(value, condition = true) {
    if (condition) this.contents.push(value);
  }
}
