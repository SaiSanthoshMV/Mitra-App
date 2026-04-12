export const PLACEMENT_LOGO_SEARCH_EVENT = 'placements:logo-search';

export type CompanyDocument = {
    id: number;
    title: string;
    url: string;
    company_id: number;
};

export type Company = {
    id: number;
    sno: number;
    name: string;
    offers: string;
    month: string;
    stipend?: string | null;
    ctc: string;
    description: string;
    process: string;
    company_documents?: CompanyDocument[] | null;
};

export type CompanyLogo = {
    id: number;
    name: string;
    logo_url: string;
    website?: string | null;
    sort_order?: number | null;
    is_active?: boolean | null;
};
