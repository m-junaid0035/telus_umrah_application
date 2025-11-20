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
  fetchAllPackageBookingsAction,
  deletePackageBookingAction,
} from "@/actions/packageBookingActions";

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
import { Eye, Trash2, Loader2, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updatePackageBookingStatusAction } from "@/actions/updateBookingStatusActions";

interface IPackageBooking {
  _id: string;
  packageId: string;
  packageName?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: string;
  travelers: {
    adults: number;
    children: number;
  };
  createdAt: string;
}

function PackageBookingsTable({
  bookings,
  onView,
  onDelete,
  onStatusUpdate,
  loading,
}: {
  bookings: IPackageBooking[];
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusUpdate: (id: string, status: string) => void;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading bookings...
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-muted">
            <TableHead>Package</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Travelers</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[150px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <TableRow
                key={booking._id}
                className="hover:bg-muted/40 transition-colors"
              >
                <TableCell className="font-medium">
                  {booking.packageName || booking.packageId}
                </TableCell>
                <TableCell>{booking.customerName}</TableCell>
                <TableCell>{booking.customerEmail}</TableCell>
                <TableCell>{booking.customerPhone}</TableCell>
                <TableCell>
                  {booking.travelers.adults} Adult{booking.travelers.adults > 1 ? "s" : ""}
                  {booking.travelers.children > 0 && `, ${booking.travelers.children} Child${booking.travelers.children > 1 ? "ren" : ""}`}
                </TableCell>
                <TableCell>
                  <Select
                    value={booking.status}
                    onValueChange={(value) => onStatusUpdate(booking._id, value)}
                  >
                    <SelectTrigger className="w-[140px] h-8">
                      <SelectValue>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">
                        <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                      </SelectItem>
                      <SelectItem value="confirmed">
                        <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
                      </SelectItem>
                      <SelectItem value="cancelled">
                        <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
                      </SelectItem>
                      <SelectItem value="completed">
                        <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
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
                      onClick={() => onView(booking._id)}
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(booking._id)}
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
                No bookings found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default function PackageBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<IPackageBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const pageSize = 8;

  const [optimisticBookings, deleteOptimistic] = useOptimistic(
    bookings,
    (state, id: string) => state.filter((b) => b._id !== id)
  );
  const isIPackageBooking = (booking: any): booking is IPackageBooking => {
    return (
      booking &&
      typeof booking === "object" &&
      "_id" in booking &&
      "customerName" in booking &&
      "customerEmail" in booking &&
      "customerPhone" in booking
    );
  };
  
  const loadBookings = async () => {
    setLoading(true);
    const result = await fetchAllPackageBookingsAction();
    if (result?.data && Array.isArray(result.data)) {
      // Filter out null values
      const validBookings = result.data.filter(isIPackageBooking);
    setBookings(validBookings);
    } else {
      toast({
        title: "Error",
        description: result?.error?.message || "Failed to fetch bookings",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    startTransition(() => {
      deleteOptimistic(id);
    });

    const result = await deletePackageBookingAction(id);
    if (result?.error) {
      toast({
        title: "Error",
        description: result.error.message || "Failed to delete booking",
        variant: "destructive",
      });
      await loadBookings();
    } else {
      setBookings((prev) => prev.filter((booking) => booking._id !== id));
      toast({
        title: "Deleted",
        description: "Booking deleted successfully.",
      });
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    const result = await updatePackageBookingStatusAction(id, status);
    if (result?.error) {
      toast({
        title: "Error",
        description: result.error.message?.[0] || "Failed to update status",
        variant: "destructive",
      });
      await loadBookings();
    } else {
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === id ? { ...booking, status } : booking
        )
      );
      toast({
        title: "Success",
        description: "Booking status updated successfully.",
      });
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const filteredBookings = optimisticBookings.filter(
    (booking) =>
      booking.customerName.toLowerCase().includes(search.toLowerCase()) ||
      booking.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      booking.customerPhone.includes(search) ||
      (booking.packageName && booking.packageName.toLowerCase().includes(search.toLowerCase()))
  );
  const totalPages = Math.ceil(filteredBookings.length / pageSize);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <CardTitle className="text-lg font-semibold">Package Bookings</CardTitle>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Input
            placeholder="Search bookings..."
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
              Loading bookings...
            </div>
          }
        >
          <PackageBookingsTable
            bookings={paginatedBookings}
            onView={(id) => router.push(`/admin/package-bookings/view/${id}`)}
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
          <p>Are you sure you want to delete this booking? This action cannot be undone.</p>
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

