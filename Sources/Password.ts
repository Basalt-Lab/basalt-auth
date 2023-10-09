import { hash, verify } from 'argon2';
import { OS } from '@/deps/OS';

export class Password {
    private static readonly _parallelism: number = OS.availableParallelism();

    /**
     * Hashes a password using Argon2.
     * @param password The password to hash.
     * @returns The hashed password.
     */
    public static async hashPassword(password: string): Promise<string> {
        try {
            if (password === '')
                throw new Error('The password cannot be empty.');
            return await hash(password, {
                parallelism: Password._parallelism,
                saltLength: 32,
            });
        } catch (error) {
            throw new Error('An error occurred while hashing the password.');
        }
    }

    /**
     * Verifies a password using Argon2.
     * @param password The password to verify.
     * @param hashedPassword The hashed password to verify against.
     * @returns Whether the password is valid.
     */
    public static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
        try {
            if (password === '')
                throw new Error('The password cannot be empty.');
            return await verify(hashedPassword, password);
        } catch (error) {
            throw new Error('An error occurred while verifying the password.');
        }
    }
}
