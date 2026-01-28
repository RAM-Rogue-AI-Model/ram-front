import type { ReactNode } from "react";

export interface BodyType {
    children: ReactNode,
    size?:"medium"|"large"|"small"|null,
    weight?:"thin"|"light"|"medium"|"regular"|"semiBold"|"bold"|"black"|null,
}