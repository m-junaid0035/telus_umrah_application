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
  fetchAllHotelsAction,
  deleteHotelAction,
} from "@/actions/hotelActions";

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
import { Eye, Pencil, Trash2, Loader2 } from "lucide-react";

interface IHotel {
  _id: string;
  type: string;
  name: string;
  location: string;
  star: number;
  createdAt: string;
  updatedAt: string;
}

function HotelsTable({
  hotels,
  onView,
  onEdit,
  onDelete,
  loading,
}: {
  hotels: IHotel[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading hotels...
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-muted">
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Stars</TableHead>
            <TableHead className="w-[150px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hotels.length > 0 ? (
            hotels.map((hotel) => (
              <TableRow
                key={hotel._id}
                className="hover:bg-muted/40 transition-colors"
              >
                <TableCell className="font-medium">{hotel.name}</TableCell>
                <TableCell>{hotel.type}</TableCell>
                <TableCell>{hotel.location}</TableCell>
                <TableCell>{hotel.star}</TableCell>
                <TableCell>
                  <div className="flex justify-end items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onView(hotel._id)}
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit(hotel._id)}
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(hotel._id)}
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
              <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                No hotels found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default function HotelsPage() {
  const router = useRouter();
  const [hotels, setHotels] = useState<IHotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const pageSize = 8;

  const [optimisticHotels, deleteOptimistic] = useOptimistic(
    hotels,
    (state, id: string) => state.filter((h) => h._id !== id)
  );

  const loadHotels = async () => {
    setLoading(true);
    const result = await fetchAllHotelsAction();
    if (result?.data && Array.isArray(result.data)) {
      setHotels(result.data);
    } else {
      toast({
        title: "Error",
        description: result?.error?.message || "Failed to fetch hotels",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    startTransition(() => {
      deleteOptimistic(id);
    });

    const result = await deleteHotelAction(id);
    if (result?.error) {
      toast({
        title: "Error",
        description: result.error.message || "Failed to delete hotel",
        variant: "destructive",
      });
      await loadHotels(); // rollback optimistic update
    } else {
      setHotels((prev) => prev.filter((hotel) => hotel._id !== id));
      toast({
        title: "Deleted",
        description: "Hotel deleted successfully.",
      });
    }
  };

  useEffect(() => {
    loadHotels();
  }, []);

  const filteredHotels = optimisticHotels.filter((hotel) =>
    hotel.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredHotels.length / pageSize);
  const paginatedHotels = filteredHotels.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <CardTitle className="text-lg font-semibold">Hotels</CardTitle>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Input
            placeholder="Search hotels..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="sm:w-64"
          />
          <Button onClick={() => router.push("/admin/hotels/new")}>
            Add Hotel
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Suspense
          fallback={
            <div className="flex justify-center items-center py-8 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Loading hotels...
            </div>
          }
        >
          <HotelsTable
            hotels={paginatedHotels}
            onView={(id) => router.push(`/admin/hotels/view/${id}`)}
            onEdit={(id) => router.push(`/admin/hotels/edit/${id}`)}
            onDelete={(id) => setConfirmDeleteId(id)}
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
          <p>Are you sure you want to delete this hotel? This action cannot be undone.</p>
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
