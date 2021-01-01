const addHyphensToUuidString = (uuid: string) =>
  uuid.substr(0, 8) +
  "-" +
  uuid.substr(8, 4) +
  "-" +
  uuid.substr(12, 4) +
  "-" +
  uuid.substr(16, 4) +
  "-" +
  uuid.substr(20);

export {
  addHyphensToUuidString
}
