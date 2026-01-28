import type { ReactNode } from "react";

export interface HeadingType {
    children: ReactNode,
    size?:"h1"|"h2"|"h3"|"h4"|"h5"|null,
    weight?:"thin"|"light"|"medium"|"regular"|"semiBold"|"bold"|"black"|null,
}