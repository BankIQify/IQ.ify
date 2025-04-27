import { usePageDisplayName } from '../hooks/usePageDisplayName';

interface PageTitleProps {
  pageName: string;
}

export default function PageTitle({ pageName }: PageTitleProps) {
  const displayName = usePageDisplayName(pageName);

  return (
    <h1 className="text-2xl font-bold mb-4">
      {displayName}
    </h1>
  );
}
