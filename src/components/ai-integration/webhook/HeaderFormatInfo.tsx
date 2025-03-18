
export function HeaderFormatInfo() {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">3. Authentication Header Format</h3>
      <div className="p-2 bg-muted rounded-md">
        <code className="text-sm font-bold">x-webhook-key: YOUR_GENERATED_API_KEY</code>
      </div>
      <p className="text-sm text-muted-foreground">
        Include this header with your API key in all webhook requests
      </p>
      
      <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-100 dark:border-yellow-900 rounded-md">
        <p className="text-sm">
          <span className="font-medium">Important:</span> When configuring in Make or other platforms, 
          use the exact header name <code className="text-xs font-bold">x-webhook-key</code> (not "authorization" or "bearer").
        </p>
      </div>
    </div>
  );
}
