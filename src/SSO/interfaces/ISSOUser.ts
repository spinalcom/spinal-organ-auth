export type ISSOUser = {
    nameID: string;
    issuer?: string;
    SAMLResponse?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    groups: string | string[];
    profileClassifyByPriority: string | string[];
};
