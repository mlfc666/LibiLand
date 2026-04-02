export interface UserInfo {
  id: number;
  username: string;
  avatar: string;
  role: 'CLIENT' | 'ADMIN';
  status: 0 | 1;
  coins: number;
  experience: number;
  gender: 0 | 1 | 2;
  birthday: string | null;
  bio: string;
  createdAt: string;
  lastSignin: string | null;
}

export interface LoginForm {
  username: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  password: string;
  confirmPassword?: string;
}

export interface UpdateProfileForm {
  avatar?: string;
  gender?: 0 | 1 | 2;
  birthday?: string;
  bio?: string;
}

export interface ChangePasswordForm {
  oldPassword: string;
  newPassword: string;
}
