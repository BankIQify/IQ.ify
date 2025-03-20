
export function HeaderFormatInfo() {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">3. Authentication Header Format</h3>
      <div className="p-2 bg-muted rounded-md space-y-3">
        <div>
          <p className="text-sm font-medium mb-1">Option 1: Custom header (recommended)</p>
          <code className="text-sm font-bold">x-webhook-key: YOUR_GENERATED_API_KEY</code>
        </div>
        
        <div>
          <p className="text-sm font-medium mb-1">Option 2: Standard Authorization header</p>
          <code className="text-sm font-bold">Authorization: YOUR_GENERATED_API_KEY</code>
          <p className="text-xs text-muted-foreground mt-1">Or with Bearer prefix:</p>
          <code className="text-sm font-bold">Authorization: Bearer YOUR_GENERATED_API_KEY</code>
        </div>
        
        <div>
          <p className="text-sm font-medium mb-1">Option 3: JWT format (if using JWT tokens)</p>
          <code className="text-sm font-bold">Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</code>
          <p className="text-xs text-muted-foreground mt-1">
            The webhook supports JWT tokens as well as regular API keys. 
            If your integration platform uses JWTs, make sure the token is registered in the system.
          </p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Include one of these headers with your API key or JWT in all webhook requests
      </p>
      
      <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-100 dark:border-yellow-900 rounded-md">
        <p className="text-sm">
          <span className="font-medium">Important:</span> When configuring in Make, Postman, or other platforms that expect 
          standard authentication headers, you can use either the custom <code className="text-xs font-bold">x-webhook-key</code>, 
          the standard <code className="text-xs font-bold">Authorization</code> header, or a JWT token with your API key.
        </p>
      </div>
    </div>
  );
}
