"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import { LogoLoop, type LogoItem } from './LogoLoop';
import type { CompanyLogo } from '@/app/placements/shared';
import { PLACEMENT_LOGO_SEARCH_EVENT } from '@/app/placements/shared';

type LogoLoopPageProps = {
    logos: CompanyLogo[];
};

type ResolvedCompanyLogo = CompanyLogo & {
    resolvedSrc: string;
};

const extractGoogleDriveFileId = (url: string): string | null => {
    const filePathMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (filePathMatch?.[1]) return filePathMatch[1];

    const openIdMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (openIdMatch?.[1]) return openIdMatch[1];

    const ucIdMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (ucIdMatch?.[1]) return ucIdMatch[1];

    return null;
};

const normalizeLogoUrl = (rawUrl: string): string => {
    const trimmedUrl = rawUrl.trim();
    if (!trimmedUrl) return '';

    if (!trimmedUrl.includes('drive.google.com')) {
        return trimmedUrl;
    }

    const fileId = extractGoogleDriveFileId(trimmedUrl);
    if (!fileId) return trimmedUrl;

    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
};

const getLogoCandidates = (rawUrl: string): string[] => {
    const trimmedUrl = rawUrl.trim();
    if (!trimmedUrl) return [];

    if (!trimmedUrl.includes('drive.google.com')) {
        return [trimmedUrl];
    }

    const fileId = extractGoogleDriveFileId(trimmedUrl);
    if (!fileId) return [trimmedUrl];

    return [
        `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`,
        `https://lh3.googleusercontent.com/d/${fileId}=w1000`,
        `https://drive.google.com/uc?export=download&id=${fileId}`,
        normalizeLogoUrl(trimmedUrl),
    ];
};

const loadImage = (url: string, timeoutMs: number): Promise<boolean> =>
    new Promise((resolve) => {
        const img = new Image();
        let finished = false;

        const timer = setTimeout(() => {
            if (finished) return;
            finished = true;
            resolve(false);
        }, timeoutMs);

        img.onload = () => {
            if (finished) return;
            finished = true;
            clearTimeout(timer);
            resolve(true);
        };

        img.onerror = () => {
            if (finished) return;
            finished = true;
            clearTimeout(timer);
            resolve(false);
        };

        img.src = url;
    });

const resolveLogoSrc = async (logo: CompanyLogo): Promise<ResolvedCompanyLogo | null> => {
    const candidates = getLogoCandidates(logo.logo_url);

    for (const candidate of candidates) {
        const ok = await loadImage(candidate, 3500);
        if (ok) {
            return {
                ...logo,
                resolvedSrc: candidate,
            };
        }
    }

    return null;
};

export default function LogoLoopPage({ logos }: LogoLoopPageProps) {
    const [resolvedLogos, setResolvedLogos] = useState<ResolvedCompanyLogo[]>([]);
    const [isResolving, setIsResolving] = useState(true);

    useEffect(() => {
        let active = true;

        const resolveAll = async () => {
            setIsResolving(true);

            const candidates = logos.filter((logo) => Boolean(logo.logo_url?.trim()));
            const settled = await Promise.all(candidates.map(resolveLogoSrc));

            if (!active) return;

            setResolvedLogos(settled.filter((logo): logo is ResolvedCompanyLogo => logo !== null));
            setIsResolving(false);
        };

        resolveAll();

        return () => {
            active = false;
        };
    }, [logos]);

    const notifyPlacementSearch = useCallback((companyName: string) => {
        window.dispatchEvent(
            new CustomEvent(PLACEMENT_LOGO_SEARCH_EVENT, {
                detail: { companyName },
            }),
        );
    }, []);

    const logoItems = useMemo<LogoItem[]>(
        () =>
            resolvedLogos.map((logo) => ({
                node: (
                    <button
                        type="button"
                        className="inline-flex items-center"
                        aria-label={`Search ${logo.name}`}
                        title={logo.name}
                        onClick={() => {
                            notifyPlacementSearch(logo.name);
                            if (logo.website) {
                                window.open(logo.website, '_blank', 'noopener,noreferrer');
                            }
                        }}
                    >
                        <img
                            src={logo.resolvedSrc}
                            alt={logo.name}
                            width={260}
                            height={130}
                            loading="lazy"
                            decoding="async"
                            className="h-[84px] w-auto object-contain"
                        />
                    </button>
                ),
                title: logo.name,
                ariaLabel: logo.name,
            })),
        [resolvedLogos, notifyPlacementSearch],
    );

    if (!logos.length) return null;

    return (
        <section className="mt-10 w-full rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/75 dark:bg-slate-900/45 backdrop-blur-md px-4 sm:px-6 py-5 sm:py-6 overflow-hidden shadow-lg">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-4">
                Our Placement Partners
            </p>
            <div className="relative w-full h-28 sm:h-32 md:h-36">
                {isResolving ? (
                    <div className="w-full h-full animate-pulse rounded-xl bg-slate-200/70 dark:bg-slate-800/70" />
                ) : logoItems.length > 0 ? (
                    <LogoLoop
                        logos={logoItems}
                        speed={150}
                        direction="left"
                        logoHeight={84}
                        gap={64}
                        hoverSpeed={0}
                        fadeOut
                        scaleOnHover
                        ariaLabel="Company logos"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                        Logos are temporarily unavailable
                    </div>
                )}
            </div>
        </section>
    );
}