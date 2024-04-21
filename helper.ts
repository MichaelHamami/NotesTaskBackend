export function formatObjectId<T extends { _id: any }>(object: T) {
  object._id = object._id.toString();
  return object;
}
