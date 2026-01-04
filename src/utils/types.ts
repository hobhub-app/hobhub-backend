export type Hobby = {
  hobby_id: number;
};

export type UserHobby = {
  hobby: Hobby;
};

export type UserForRanking = {
  user_id: number;
  location: string | null;
  hobbies: UserHobby[];
};
