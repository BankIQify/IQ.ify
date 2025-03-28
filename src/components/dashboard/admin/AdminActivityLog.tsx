
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  ArrowUpDown,
  Info,
  AlertTriangle,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

type ActivityLog = {
  id: string;
  userId: string;
  username: string;
  action: string;
  resourceType: string;
  resourceId: string | null;
  severity: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
  details: string;
};

export const AdminActivityLog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock activity logs data
  const generateMockLogs = (): ActivityLog[] => {
    const actions = [
      "login", "logout", "create", "update", "delete", "view", 
      "download", "upload", "share", "approve", "reject"
    ];
    
    const resourceTypes = [
      "user", "question", "test", "exam", "result", "profile", 
      "settings", "webhook", "puzzle", "role"
    ];
    
    const severities: ('info' | 'warning' | 'error' | 'success')[] = [
      "info", "warning", "error", "success"
    ];
    
    const users = [
      { id: "1", username: "admin" },
      { id: "2", username: "john.doe" },
      { id: "3", username: "jane.smith" },
      { id: "4", username: "data.editor" }
    ];
    
    return Array.from({ length: 50 }, (_, i) => {
      const user = users[Math.floor(Math.random() * users.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      const resourceType = resourceTypes[Math.floor(Math.random() * resourceTypes.length)];
      const severity = severities[Math.floor(Math.random() * severities.length)];
      
      // Generate a random date within the last 30 days
      const timestamp = new Date();
      timestamp.setDate(timestamp.getDate() - Math.floor(Math.random() * 30));
      
      // Generate details based on action and resource type
      const details = `${user.username} ${action}d ${resourceType} ${Math.floor(Math.random() * 1000)}`;
      
      return {
        id: `log-${i + 1}`,
        userId: user.id,
        username: user.username,
        action,
        resourceType,
        resourceId: `${resourceType}-${Math.floor(Math.random() * 1000)}`,
        severity,
        timestamp,
        details
      };
    }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()); // Sort by timestamp descending
  };

  const activityLogs = generateMockLogs();

  // Filter logs based on search term, action type, severity, and date range
  const filteredLogs = activityLogs.filter(log => {
    // Search filter (username, action, resourceType, details)
    const matchesSearch = searchTerm === "" || 
      log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resourceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Action filter
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    
    // Severity filter
    const matchesSeverity = severityFilter === "all" || log.severity === severityFilter;
    
    // Date range filter
    const matchesStartDate = !startDate || log.timestamp >= startDate;
    const matchesEndDate = !endDate || log.timestamp <= endDate;
    
    return matchesSearch && matchesAction && matchesSeverity && matchesStartDate && matchesEndDate;
  });

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  const getSeverityIcon = (severity: 'info' | 'warning' | 'error' | 'success') => {
    switch (severity) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getSeverityColor = (severity: 'info' | 'warning' | 'error' | 'success') => {
    switch (severity) {
      case 'info':
        return "bg-blue-100 text-blue-800";
      case 'warning':
        return "bg-amber-100 text-amber-800";
      case 'error':
        return "bg-red-100 text-red-800";
      case 'success':
        return "bg-green-100 text-green-800";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="login">Login</SelectItem>
              <SelectItem value="logout">Logout</SelectItem>
              <SelectItem value="create">Create</SelectItem>
              <SelectItem value="update">Update</SelectItem>
              <SelectItem value="delete">Delete</SelectItem>
              <SelectItem value="view">View</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="success">Success</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[160px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : "Start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[160px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : "End date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Button 
            variant="ghost" 
            onClick={() => {
              setStartDate(undefined);
              setEndDate(undefined);
              setActionFilter("all");
              setSeverityFilter("all");
              setSearchTerm("");
            }}
            className="h-10"
          >
            Clear filters
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Showing {filteredLogs.length} of {activityLogs.length} logs
        </div>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Action
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead className="max-w-[400px]">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {format(log.timestamp, "dd MMM yyyy HH:mm")}
                </TableCell>
                <TableCell>
                  <span className="font-medium">{log.username}</span>
                </TableCell>
                <TableCell className="capitalize">{log.action}</TableCell>
                <TableCell className="capitalize">{log.resourceType}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={`flex items-center gap-1 ${getSeverityColor(log.severity)}`}
                  >
                    {getSeverityIcon(log.severity)}
                    <span className="capitalize">{log.severity}</span>
                  </Badge>
                </TableCell>
                <TableCell className="max-w-[400px] truncate">
                  {log.details}
                </TableCell>
              </TableRow>
            ))}
            {currentLogs.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No activity logs found matching your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
