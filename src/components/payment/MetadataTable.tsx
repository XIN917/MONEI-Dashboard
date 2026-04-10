import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { KeyValueItem } from "@/types/graphql";

interface MetadataTableProps {
  metadata: KeyValueItem[] | null | undefined;
}

export function MetadataTable({ metadata }: MetadataTableProps) {
  if (!metadata || metadata.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No metadata</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Metadata</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 font-medium text-muted-foreground">
                Key
              </th>
              <th className="text-left py-2 font-medium text-muted-foreground">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {metadata.map((item, index) => (
              <tr key={index} className="border-b last:border-b-0">
                <td className="py-2 font-mono text-xs">{item.key}</td>
                <td className="py-2 break-all">{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

export function MetadataTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-24" />
      </CardHeader>
      <CardContent>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4 py-2 border-b last:border-b-0">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
