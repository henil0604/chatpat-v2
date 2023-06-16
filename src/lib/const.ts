export const TWITTER_HANDLE_LINK = "https://twitter.com/realchatpat";
export const EMAIL_HANDLE = "chatpat@henil.xyz";

export const ProtectedRoutes = [
    '/explore',
    '/create',
    '/r/*'
]

export const REGEX = {
    alphanumeric: /^[A-Za-z0-9_\.-]*$/
}

export const CODE = {
    INVALID: 'INVALID',
    ERROR: 'ERROR',
    DONE: 'DONE',
    NOT_ENOUGH_COINS: 'NOT_ENOUGH_COINS'
}

export const INITIAL_WALLET_BALANCE = 95;

export const COST = {
    CREATE_ROOM: {
        PUBLIC: 30,
        UNLISTED: 60,
        PRIVATE: 100,
    }
}