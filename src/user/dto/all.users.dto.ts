export interface UserDto {
  readonly _id?: string;
  readonly name: string;
  readonly email: string;
  readonly isActive: boolean;
  readonly verified: boolean;
  readonly role?: string;
}

export interface AllUsers {
  page: number;
  pages: number;
  count: number;
  pageLength: number;
  users: UserDto[];
}
