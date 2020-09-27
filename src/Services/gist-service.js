export const NOT_FOUND = "Not Found";
export const ERROR = "error";

export async function list(username) {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/gists`
    );
    const data = await response.json();
    // Return with error message
    if (data?.message === NOT_FOUND) {
      return data;
    }

    // Convert files object into array to display tags
    const cleanedUpData = data?.map((gist) => {
      const filesArray = Object.keys(gist.files).map((key) => gist.files[key]);
      return { ...gist, files: filesArray };
    });

    // Get fork info for each gist
    const dataWithForkInfo = await Promise.all(
      cleanedUpData?.map(async (gist) => {
        const forkResponse = await fetch(gist?.forks_url);
        const forkInfo = await forkResponse.json();

        // Get the latest 3
        return { ...gist, forkInfo: forkInfo.slice(-3) };
      })
    );

    return dataWithForkInfo;
  } catch (err) {
    return { message: ERROR };
  }
}
