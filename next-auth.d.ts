/* eslint-disable no-unused-vars */
import NextAuth, { type DefaultSession } from 'next-auth';

export type ExtendedUser = DefaultSession['user'] & {
  companyId: string;
  contactId: string;
  company: string;
};

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser;
  }
}
