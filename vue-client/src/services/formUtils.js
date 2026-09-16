import generator from "generate-password";

export const URL_REGEX =
  /^https?:\/\/(?:w{1,3}\.)?[^\s.]+(?:\.[a-z]+)*(?::\d+)?(?![^<]*(?:<\/\w+>|\/?>))$/i;

export const USER_TYPES = [{ name: "Simple User" }, { name: "Super User" }];

export function generateRegisterKey() {
  return generator.generate({
    length: 30,
    numbers: true,
  });
}
