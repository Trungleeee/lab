import models from "../modelData/models";

/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url      The URL to issue the GET request.
 * @returns {Promise}       A Promise that resolves with the response data.
 */
function fetchModel(url) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        if (url === "/user/list") {
          resolve(models.userListModel());
        } else if (url.startsWith("/user/")) {
          const userId = url.replace("/user/", "");
          const user = models.userModel(userId);
          if (user) resolve(user);
          else reject(new Error("User not found"));
        } else if (url.startsWith("/photosOfUser/")) {
          const userId = url.replace("/photosOfUser/", "");
          const photos = models.photoOfUserModel(userId);
          if (photos) resolve(photos);
          else reject(new Error("Photos not found"));
        } else if (url === "/test/info") {
          resolve(models.schemaInfo());
        } else {
          reject(new Error("Not Found"));
        }
      } catch (e) {
        reject(e);
      }
    }, 100); // Simulate network delay
  });
}

export default fetchModel;
