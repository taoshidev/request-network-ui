import path from "path";

export const templates = {
  layout: path.resolve("./public", "templates", "layout.pug"),
  "layout-text": path.resolve("./public", "templates", "layout-text.pug"),
  "created-endpoint": path.resolve(
    "./public",
    "templates",
    "created-endpoint.pug"
  ),
  "created-endpoint.text": path.resolve(
    "./public",
    "templates",
    "created-endpoint.text.pug"
  ),
  notification: path.resolve("./public", "templates", "notification.pug"),
  "notification.text": path.resolve(
    "./public",
    "templates",
    "notification.text.pug"
  ),
  "subscription-created": path.resolve(
    "./public",
    "templates",
    "subscription-created.pug"
  ),
  "subscription-created.text": path.resolve(
    "./public",
    "templates",
    "subscription-created.text.pug"
  ),
};
