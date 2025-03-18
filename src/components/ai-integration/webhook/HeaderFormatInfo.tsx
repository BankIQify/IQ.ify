
export function HeaderFormatInfo() {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">3. Authentication Header Format</h3>
      <div className="p-2 bg-muted rounded-md">
        <code className="text-sm">x-webhook-key: YOUR_GENERATED_API_KEY</code>
      </div>
      <p className="text-sm text-muted-foreground">
        Include this header with your API key in webhook requests
      </p>
    </div>
  );
}
