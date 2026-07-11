export declare class RegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName?: string;
    dateOfBirth?: string;
    occupation?: string;
    experience?: string;
    skills?: string[];
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class ResetPasswordDto {
    token: string;
    password: string;
}
export declare class UpdateProfileDto {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    occupation?: string;
    experience?: string;
    skills?: string[];
}
export declare class UpdatePasswordDto {
    currentPassword?: string;
    newPassword: string;
}
