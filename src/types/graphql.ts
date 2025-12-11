export interface UserArgs {
  id: number;
}

export interface CreateUserArgs {
  input: {
    email: string;
    password: string;
    firstname?: string;
    lastname?: string;
  };
}

export interface CreateHobbyArgs {
  name: string;
}
