import 'server-only';

import { createServerSupabase } from '@/lib/supabaseServer';
import type { Company, CompanyDocument, CompanyLogo } from './shared';

type PlacementsPageData = {
    companies: Company[];
    companyLogos: CompanyLogo[];
    companiesError: unknown;
    logosError: unknown;
};

export async function getPlacementsPageData(): Promise<PlacementsPageData> {
    const supabase = createServerSupabase();

    const [companiesResult, logosResult] = await Promise.all([
        supabase
            .from('companies')
            .select(
                `id, sno, name, offers, month, stipend, ctc, description, process, company_documents(id, title, url, company_id)`
            )
            .order('sno', { ascending: true })
            .limit(1000),
        supabase
            .from('company_logos')
            .select('id, name, logo_url, website, sort_order, is_active')
            .eq('is_active', true)
            .order('sort_order', { ascending: true })
            .limit(24),
    ]);

    const { data, error: companiesError } = companiesResult;
    const { data: logoData, error: logosError } = logosResult;

    const companies: Company[] = (Array.isArray(data) ? data : []).map((company): Company => ({
        id: company.id as number,
        sno: company.sno as number,
        name: (company.name ?? '') as string,
        offers: (company.offers ?? '') as string,
        month: (company.month ?? '') as string,
        stipend: (company.stipend ?? null) as string | null,
        ctc: (company.ctc ?? '') as string,
        description: (company.description ?? '') as string,
        process: (company.process ?? '') as string,
        company_documents: Array.isArray(company.company_documents)
            ? company.company_documents.map((document): CompanyDocument => ({
                id: document.id as number,
                title: (document.title ?? '') as string,
                url: (document.url ?? '') as string,
                company_id: document.company_id as number,
            }))
            : [],
    }));

    const companyLogos: CompanyLogo[] = (Array.isArray(logoData) ? logoData : [])
        .map((logo): CompanyLogo => ({
            id: logo.id as number,
            name: (logo.name ?? '') as string,
            logo_url: (logo.logo_url ?? '') as string,
            website: (logo.website ?? null) as string | null,
            sort_order: (logo.sort_order ?? null) as number | null,
            is_active: (logo.is_active ?? null) as boolean | null,
        }))
        .filter((logo) => Boolean(logo.logo_url));

    return {
        companies,
        companyLogos,
        companiesError,
        logosError,
    };
}
