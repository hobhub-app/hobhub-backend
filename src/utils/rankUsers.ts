import { UserForRanking } from "./types";

const rankUsers = (
  users: UserForRanking[],
  me: UserForRanking
): UserForRanking[] => {
  const myHobbyIds = new Set(
    me.hobbies.map((userHobby) => userHobby.hobby.hobby_id)
  );

  return [...users].sort((a, b) => {
    const aMatches = a.hobbies.filter((userHobby) =>
      myHobbyIds.has(userHobby.hobby.hobby_id)
    ).length;

    const bMatches = b.hobbies.filter((userHobby) =>
      myHobbyIds.has(userHobby.hobby.hobby_id)
    ).length;

    if (aMatches !== bMatches) {
      return bMatches - aMatches;
    }

    const aSameLocation = a.location === me.location;
    const bSameLocation = b.location === me.location;

    if (aSameLocation !== bSameLocation) {
      return aSameLocation ? -1 : 1;
    }

    return 0;
  });
};

export default rankUsers;
