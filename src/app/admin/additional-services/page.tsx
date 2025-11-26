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
  fetchAllAdditionalServicesAction,
  deleteAdditionalServiceAction,
} from "@/actions/additionalServiceActions";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Eye, Pencil, Trash2, Loader2, Plus } from "lucide-react";

interface IAdditionalService {
  _id: string;
  name: string;
  description?: string;
  price: number;
  serviceType: string;
  isActive: boolean;
  icon?: string;
  createdAt: string;
}

function AdditionalServicesTable({
  services,
  onView,
  onEdit,
  onDelete,
  loading,
}: {
  services: IAdditionalService[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading services...
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
            <TableHead>Description</TableHead>
            <TableHead>Price (PKR)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[150px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.length > 0 ? (
            services.map((service) => (
              <TableRow key={service._id} className="hover:bg-muted/40 transition-colors">
                <TableCell className="font-medium">{service.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {service.serviceType || "—"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {service.description || "—"}
                </TableCell>
                <TableCell className="font-medium">
                  PKR {service.price.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      service.isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                    }
                  >
                    {service.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onView(service._id)}
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit(service._id)}
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(service._id)}
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
              <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                No additional services found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default function AdditionalServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<IAdditionalService[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const pageSize = 10;

  const [optimisticServices, deleteOptimistic] = useOptimistic(
    services,
    (state, id: string) => state.filter((s) => s._id !== id)
  );

  const loadServices = async () => {
    setLoading(true);
    const result = await fetchAllAdditionalServicesAction();
    if (result?.data && Array.isArray(result.data)) {
      setServices(result.data);
    } else {
      toast({
        title: "Error",
        description: result?.error?.message?.[0] || "Failed to fetch additional services",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    startTransition(() => {
      deleteOptimistic(id);
    });

    const result = await deleteAdditionalServiceAction(id);
    if (result?.error) {
      toast({
        title: "Error",
        description: result.error.message?.[0] || "Failed to delete service",
        variant: "destructive",
      });
      await loadServices();
    } else {
      setServices((prev) => prev.filter((s) => s._id !== id));
      toast({
        title: "Deleted",
        description: "Additional service deleted successfully.",
      });
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const filteredServices = optimisticServices.filter((service) =>
    service.name.toLowerCase().includes(search.toLowerCase()) ||
    (service.description && service.description.toLowerCase().includes(search.toLowerCase()))
  );
  const totalPages = Math.ceil(filteredServices.length / pageSize);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <CardTitle className="text-lg font-semibold">Additional Services</CardTitle>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Input
            placeholder="Search services..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="sm:w-64"
          />
          <Button onClick={() => router.push("/admin/additional-services/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Suspense
          fallback={
            <div className="flex justify-center items-center py-8 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Loading services...
            </div>
          }
        >
          <AdditionalServicesTable
            services={paginatedServices}
            onView={(id) => router.push(`/admin/additional-services/view/${id}`)}
            onEdit={(id) => router.push(`/admin/additional-services/edit/${id}`)}
            onDelete={(id) => setConfirmDeleteId(id)}
            loading={loading}
          />
        </Suspense>

        {totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
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
          <p>Are you sure you want to delete this service? This action cannot be undone.</p>
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

