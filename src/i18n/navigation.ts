import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// Lokaliseeritud navigatsiooni-API-d. Kasuta neid AVALIKEL lehtedel next/link
// ja next/navigation asemel, et keeleprefiks (/en) säiliks linkidel ja ümbersuunamistel.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
