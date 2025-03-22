
export function HeaderFormatInfo() {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">3. Authentication Header Format</h3>
      <div className="p-2 bg-muted rounded-md space-y-3">
        <div>
          <p className="text-sm font-medium mb-1">Option 1: Custom header (recommended for Make.com)</p>
          <code className="text-sm font-bold">x-webhook-key: YOUR_API_KEY</code>
        </div>
        
        <div>
          <p className="text-sm font-medium mb-1">Option 2: Authorization header</p>
          <code className="text-sm font-bold">Authorization: Bearer YOUR_API_KEY</code>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Include one of these headers with your API key in all webhook requests
      </p>
      
      <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-100 dark:border-yellow-900 rounded-md">
        <p className="text-sm">
          <span className="font-medium">Make.com Instructions:</span>
        </p>
        <ol className="list-decimal ml-5 text-sm space-y-1 mt-1">
          <li>In your Make.com webhook module, go to "Headers"</li>
          <li>Add a new header with <code className="text-xs font-bold">x-webhook-key</code> as the name</li>
          <li>Set the value to your raw API key (no quotes, no "Bearer" prefix)</li>
          <li>Set Content-Type header to <code className="text-xs font-bold">application/json</code></li>
        </ol>
        <p className="text-sm mt-2">
          <span className="font-medium">Common Issues:</span>
        </p>
        <ul className="list-disc ml-5 text-sm space-y-1 mt-1">
          <li>Make sure there are no extra spaces before or after your API key</li>
          <li>Don't wrap your API key in quotes or add any formatting</li>
          <li>Use lowercase for header names (Make.com converts them anyway)</li>
          <li>If you still have issues, try both header formats</li>
        </ul>
      </div>
    </div>
  );
}
