"use client";

import {
  Suspense,
  useEffect,
  useState,
  useOptimistic,
  startTransition,
} from "react";
import { useRouter } from "next/navigation";
import {
  fetchAllCustomUmrahRequestsAction,
  deleteCustomUmrahRequestAction,
} from "@/actions/customUmrahRequestActions";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Eye, Trash2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateCustomUmrahRequestStatusAction } from "@/actions/updateBookingStatusActions";

interface ICustomUmrahRequest {
  _id: string;
  name: string;
  email: string;
  phone: string;
  nationality: string;
  from: string;
  to: string;
  departDate: string;
  returnDate: string;
  airline: string;
  airlineClass: string;
  adults: number;
  children: number;
  childAges: number[];
  rooms: number;
  umrahVisa: boolean;
  transport: boolean;
  zaiarat: boolean;
  meals: boolean;
  esim: boolean;
  hotels: Array<{
    hotelClass: string;
    hotel: string;
    stayDuration: string;
    bedType: string;
    city: string;
  }>;
  status: string;
  notes?: string;
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
}

function CustomUmrahRequestsTable({
  requests,
  onView,
  onDelete,
  onStatusUpdate,
  loading,
}: {
  requests: ICustomUmrahRequest[];
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusUpdate: (id: string, status: string) => void;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading requests...
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-muted">
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Travelers</TableHead>
            <TableHead>Departure</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[150px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length > 0 ? (
            requests.map((request) => (
              <TableRow
                key={request._id}
                className="hover:bg-muted/40 transition-colors"
              >
                <TableCell className="font-medium">{request.name}</TableCell>
                <TableCell>{request.email}</TableCell>
                <TableCell>{request.phone}</TableCell>
                <TableCell>
                  {request.adults} Adult{request.adults > 1 ? "s" : ""}
                  {request.children > 0 && `, ${request.children} Child${request.children > 1 ? "ren" : ""}`}
                </TableCell>
                <TableCell>
                  {request.departDate
                    ? new Date(request.departDate).toLocaleDateString()
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <Select
                    value={request.status || "pending"}
                    onValueChange={(value) => onStatusUpdate(request._id, value)}
                  >
                    <SelectTrigger className="w-[140px] h-8">
                      <SelectValue>
                        <Badge className={getStatusColor(request.status || "pending")}>
                          {request.status || "pending"}
                        </Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">
                        <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                      </SelectItem>
                      <SelectItem value="in-progress">
                        <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
                      </SelectItem>
                      <SelectItem value="completed">
                        <Badge className="bg-green-100 text-green-800">Completed</Badge>
                      </SelectItem>
                      <SelectItem value="cancelled">
                        <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onView(request._id)}
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(request._id)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-6">
                No requests found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default function CustomUmrahRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<ICustomUmrahRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const pageSize = 8;

  const [optimisticRequests, deleteOptimistic] = useOptimistic(
    requests,
    (state, id: string) => state.filter((r) => r._id !== id)
  );

  const loadRequests = async () => {
    setLoading(true);
    const result = await fetchAllCustomUmrahRequestsAction();
    if (result?.data && Array.isArray(result.data)) {
      // Filter out null values
      const validRequests = result.data.filter((request) => request !== null) as ICustomUmrahRequest[];
      setRequests(validRequests);
    } else {
      toast({
        title: "Error",
        description: result?.error?.message || "Failed to fetch requests",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    startTransition(() => {
      deleteOptimistic(id);
    });

    const result = await deleteCustomUmrahRequestAction(id);
    if (result?.error) {
      toast({
        title: "Error",
        description: result.error.message || "Failed to delete request",
        variant: "destructive",
      });
      await loadRequests(); // rollback optimistic update
    } else {
      setRequests((prev) => prev.filter((request) => request._id !== id));
      toast({
        title: "Deleted",
        description: "Request deleted successfully.",
      });
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    const result = await updateCustomUmrahRequestStatusAction(id, status);
    if (result?.error) {
      toast({
        title: "Error",
        description: result.error.message?.[0] || "Failed to update status",
        variant: "destructive",
      });
      await loadRequests();
    } else {
      setRequests((prev) =>
        prev.map((request) =>
          request._id === id ? { ...request, status } : request
        )
      );
      toast({
        title: "Success",
        description: "Request status updated successfully.",
      });
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const filteredRequests = optimisticRequests.filter((request) =>
    request.name.toLowerCase().includes(search.toLowerCase()) ||
    request.email.toLowerCase().includes(search.toLowerCase()) ||
    request.phone.includes(search)
  );
  const totalPages = Math.ceil(filteredRequests.length / pageSize);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <CardTitle className="text-lg font-semibold">Custom Umrah Requests</CardTitle>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Input
            placeholder="Search requests..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="sm:w-64"
          />
        </div>
      </CardHeader>

      <CardContent>
        <Suspense
          fallback={
            <div className="flex justify-center items-center py-8 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Loading requests...
            </div>
          }
        >
          <CustomUmrahRequestsTable
            requests={paginatedRequests}
            onView={(id) => router.push(`/admin/custom-umrah-requests/view/${id}`)}
            onDelete={(id) => setConfirmDeleteId(id)}
            onStatusUpdate={handleStatusUpdate}
            loading={loading}
          />
        </Suspense>

        {totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={currentPage === i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>

      <Dialog
        open={!!confirmDeleteId}
        onOpenChange={() => setConfirmDeleteId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this request? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setConfirmDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirmDeleteId) handleDelete(confirmDeleteId);
                setConfirmDeleteId(null);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

