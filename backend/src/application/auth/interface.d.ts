export interface IJwtUser {
  id: string;
  name: string | null;
  email: string | null;
  profilePicture?: string | null;
  role: 'ADMIN' | 'USER';
  loginSecrete: string;
  isLoggedIn: boolean;
}
