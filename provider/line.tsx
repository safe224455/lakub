import liff from "@line/liff";

export type ProfileType = {
  userId: string,
  displayName: string,
  pictureUrl: string,
  statusMessage: string,
}
export const getProfile = async () => {
  return await new Promise((res, reg) => {
    // liff.init({
    //   liffId: "2006815992-QE4g58xe",
    // }).then(() => {
    //   liff
    //     .getProfile()
    //     .then((profile) => {
    //       res(profile)
    //     })
    //     .catch((err) => {
    //       reg('')
    //       console.log("error", err);
    //     });
    // });
    let Profile: ProfileType = {
      "statusMessage": "true",
      "userId": "U30495f1f9a7d4462ce7772cf3d96fa19",
      "displayName": "Wat",
      "pictureUrl": "https://profile.line-scdn.net/0hFpQkvHAPGV98EgwR27ZnIAxCGjVfY0BNByEDPk0STz0TK14BBCAEa09AE28UJF1aUHIEOkhHQGdwAW45YkTla3siRG5AJVcJVHxeug"
    }
    res(Profile)
  })
}
export const getStatus = async () => {
  return await new Promise(async (res, reg) => {
    res(true)
    // liff.init({
    //   liffId: "2006815992-QE4g58xe",
    // }).then(() => { res(liff.isLoggedIn()) })
  })
}


