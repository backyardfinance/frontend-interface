/** biome-ignore-all lint/suspicious/noArrayIndexKey: explanation */

import type React from "react";
import { cn } from "@/common/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

type PaginationData = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

type TableProps = {
  headers: React.ReactNode[];
  rows: React.ReactNode[][];
  pagination?: PaginationData;
  rowClassName?: string;
  action?: (rowIndex: number) => React.ReactNode;
  handleRowClick?: (rowIndex: number) => void;
};

export const Table: React.FC<TableProps> = ({ headers, rows, pagination, rowClassName, action, handleRowClick }) => {
  const getPageNumbers = () => {
    if (!pagination) return [];

    const { currentPage, totalPages } = pagination;
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage <= 3) {
        pages.push(2, 3, 4, "ellipsis", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push("ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push("ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center gap-3 px-4">
        <div className="grid flex-1 grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
          {headers.map((header, index) => (
            <div className={cn("flex items-center font-normal text-[#CACACA] text-[9px] leading-[normal]")} key={index}>
              {header}
            </div>
          ))}
        </div>
        {action && <div className="pointer-events-none invisible">{action(0)}</div>}
      </div>

      <div className="flex flex-col gap-2">
        {rows.map((row, rowIndex) => (
          // biome-ignore lint/a11y/useKeyWithClickEvents: explanation
          <div
            className={cn(
              "flex items-center gap-3 rounded-2xl border border-[rgba(214,214,214,0.30)] bg-[#FAFAFA] px-4 py-3",
              handleRowClick && "cursor-pointer transition-all duration-300 hover:shadow-md",
              rowClassName
            )}
            key={rowIndex}
            onClick={() => handleRowClick?.(rowIndex)}
            role="button"
            tabIndex={0}
          >
            <div className="grid flex-1 grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
              {row.map((cell, cellIndex) => (
                <div
                  className={cn("flex items-center font-bold text-neutral-800 text-xs leading-[normal]")}
                  key={cellIndex}
                >
                  {cell}
                </div>
              ))}
            </div>
            {!!action && action(rowIndex)}
          </div>
        ))}
      </div>
      {pagination && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className={cn(pagination.currentPage === 1 && "pointer-events-none opacity-50")}
                onClick={(e) => {
                  e.preventDefault();
                  if (pagination.currentPage > 1) {
                    pagination.onPageChange(pagination.currentPage - 1);
                  }
                }}
              />
            </PaginationItem>

            {getPageNumbers().map((page, index) => (
              <PaginationItem key={index}>
                {page === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    isActive={page === pagination.currentPage}
                    onClick={(e) => {
                      e.preventDefault();
                      pagination.onPageChange(page);
                    }}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                className={cn(pagination.currentPage === pagination.totalPages && "pointer-events-none opacity-50")}
                onClick={(e) => {
                  e.preventDefault();
                  if (pagination.currentPage < pagination.totalPages) {
                    pagination.onPageChange(pagination.currentPage + 1);
                  }
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
