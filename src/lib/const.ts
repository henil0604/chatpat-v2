export const TWITTER_HANDLE_LINK = "https://twitter.com/realchatpat";
export const EMAIL_HANDLE = "chatpat@henil.xyz";

export const ProtectedRoutes = [
    '/explore',
    '/create',
    '/r/*',
    '/admin'
]

export const ADMIN_EMAILS = [
    "henilmalaviya06@gmail.com",
    "princerenuka083@gmail.com"
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

export const INITIAL_WALLET_BALANCE = 100;

export const COST = {
    CREATE_ROOM: {
        PUBLIC: 0,
        UNLISTED: 0,
        PRIVATE: 0,
    }
}

export const REWARD = {
    MESSAGE_SEND: 0.5
}