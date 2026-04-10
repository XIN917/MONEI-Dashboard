import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "lucide-react";
import type { Charge } from "@/types/graphql";

interface RedirectUrlRowProps {
  label: string;
  url: string | null | undefined;
}

function RedirectUrlRow({ label, url }: RedirectUrlRowProps) {
  if (!url) return null;

  const truncateUrl = (url: string) => {
    if (url.length > 60) {
      return `${url.slice(0, 30)}...${url.slice(-30)}`;
    }
    return url;
  };

  return (
    <div className="flex items-center justify-between py-2 border-b last:border-b-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1 max-w-xs truncate"
        title={url}
      >
        {truncateUrl(url)}
        <ExternalLink className="h-3 w-3 flex-shrink-0" />
      </a>
    </div>
  );
}

interface RedirectUrlsProps {
  charge: Charge;
}

export function RedirectUrls({ charge }: RedirectUrlsProps) {
  const urls = [
    { label: "Callback URL", url: charge.callbackUrl },
    { label: "Complete URL", url: charge.completeUrl },
    { label: "Fail URL", url: charge.failUrl },
    { label: "Cancel URL", url: charge.cancelUrl },
  ];

  const hasAnyUrl = urls.some((u) => u.url);
  if (!hasAnyUrl) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Redirect URLs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No redirect URLs</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Redirect URLs</CardTitle>
      </CardHeader>
      <CardContent>
        {urls.map((u) => (
          <RedirectUrlRow key={u.label} label={u.label} url={u.url} />
        ))}
      </CardContent>
    </Card>
  );
}

export function RedirectUrlsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex justify-between py-2 border-b last:border-b-0">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-48" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
