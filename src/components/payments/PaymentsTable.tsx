import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChargeNode, ChargeStatus } from "@/types/graphql";
import { useFormattedCurrency } from "@/hooks/useFormattedCurrency";
import { useFormattedDate } from "@/hooks/useFormattedDate";
import { STATUS_TAILWIND, DEFAULT_STATUS_TAILWIND } from "@/lib/constants";

interface PaymentsTableProps {
  charges: ChargeNode[] | undefined;
  loading: boolean;
  onRowClick: (id: string) => void;
}

function StatusBadge({ status }: { status: ChargeStatus }) {
  const className = STATUS_TAILWIND[status] ?? DEFAULT_STATUS_TAILWIND;
  return (
    <Badge variant="outline" className={className}>
      {status}
    </Badge>
  );
}

function truncateId(id: string, maxLength: number = 14): string {
  if (id.length <= maxLength) return id;
  const half = Math.floor(maxLength / 2) - 2;
  return `${id.slice(0, half)}...${id.slice(-half)}`;
}

function TableRowSkeleton() {
  return (
    <TableRow>
      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
      <TableCell><Skeleton className="h-4 w-36" /></TableCell>
      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
    </TableRow>
  );
}

export function PaymentsTable({ charges, loading, onRowClick }: PaymentsTableProps) {
  if (loading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Payment ID</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Reference</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 10 }).map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </TableBody>
      </Table>
    );
  }

  if (!charges || charges.length === 0) {
    return null;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Payment ID</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Reference</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {charges.map((charge) => (
          <ChargeRow key={charge.id} charge={charge} onClick={onRowClick} />
        ))}
      </TableBody>
    </Table>
  );
}

function ChargeRow({
  charge,
  onClick,
}: {
  charge: ChargeNode;
  onClick: (id: string) => void;
}) {
  const amountStr = useFormattedCurrency(charge.amount, charge.currency);
  const { absolute: dateStr } = useFormattedDate(charge.createdAt);

  return (
    <TableRow
      className="cursor-pointer"
      onClick={() => onClick(charge.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(charge.id);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View payment ${charge.id}`}
    >
      <TableCell className="font-mono text-sm">
        <span title={charge.id}>{truncateId(charge.id)}</span>
      </TableCell>
      <TableCell className="font-medium">{amountStr}</TableCell>
      <TableCell>
        <span title={dateStr}>{dateStr}</span>
      </TableCell>
      <TableCell>
        <StatusBadge status={charge.status as ChargeStatus} />
      </TableCell>
      <TableCell className="max-w-[200px] truncate" title={charge.description ?? ""}>
        {charge.description ?? "—"}
      </TableCell>
      <TableCell className="font-mono text-sm">
        {charge.providerReferenceId ?? "—"}
      </TableCell>
    </TableRow>
  );
}
