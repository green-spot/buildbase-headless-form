import type { FieldList } from "./types";

declare module './sample.json' {
  const value: FieldList;
  export = value;
}
