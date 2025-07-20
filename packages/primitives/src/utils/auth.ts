export enum UserRole {
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
  ADMIN = 'ADMIN',
}

type UserInfo = {
  is_admin: boolean;
  is_premium: boolean;
  terms_accepted: boolean;
};

type AuthTokenInfo = {
  role: UserRole;
  hasAcceptedTerms: boolean;
};

export const parseAuthToken = (authToken: string): AuthTokenInfo => {
  try {
    const decoded = authToken
      .split('.')
      .map((piece) => atob(piece.replace(/_/g, '/').replace(/-/g, '+')));
    const userInfo = JSON.parse(decoded[1]) as UserInfo;
    return {
      role: getUserRole(userInfo),
      hasAcceptedTerms: userInfo.terms_accepted,
    };
  } catch (e) {
    console.error('Failed to parse auth token', e);
  }

  return { role: UserRole.BASIC, hasAcceptedTerms: false };
};

function getUserRole(info: UserInfo) {
  if (info.is_admin) return UserRole.ADMIN;
  else if (info.is_premium) return UserRole.PREMIUM;

  return UserRole.BASIC;
}
