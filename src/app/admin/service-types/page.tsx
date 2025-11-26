"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  fetchAllServiceTypesAction,
  deleteServiceTypeAction,
} from "@/actions/serviceTypeActions";
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
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

interface IServiceType {
  _id: string;
  name: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

export default function ServiceTypesPage() {
  const router = useRouter();
  const [types, setTypes] = useState<IServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const loadTypes = async () => {
    setLoading(true);
    const result = await fetchAllServiceTypesAction();
    if (result?.data && Array.isArray(result.data)) {
      setTypes(result.data);
    } else {
      toast({
        title: "Error",
        description: result?.error?.message?.[0] || "Failed to fetch service types",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const result = await deleteServiceTypeAction(id);
    if (result?.error) {
      toast({
        title: "Error",
        description: result.error.message?.[0] || "Failed to delete service type",
        variant: "destructive",
      });
      await loadTypes();
    } else {
      setTypes((prev) => prev.filter((t) => t._id !== id));
      toast({
        title: "Deleted",
        description: "Service type deleted successfully.",
      });
    }
  };

  useEffect(() => {
    loadTypes();
  }, []);

  const filteredTypes = types.filter((type) =>
    type.name.toLowerCase().includes(search.toLowerCase()) ||
    (type.description && type.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <CardTitle className="text-lg font-semibold">Service Types</CardTitle>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Input
            placeholder="Search types..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:w-64"
          />
          <Button onClick={() => router.push("/admin/service-types/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Type
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Loading service types...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-muted">
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Display Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[150px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTypes.length > 0 ? (
                  filteredTypes.map((type) => (
                    <TableRow key={type._id} className="hover:bg-muted/40 transition-colors">
                      <TableCell className="font-medium">{type.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {type.description || "—"}
                      </TableCell>
                      <TableCell>{type.displayOrder}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            type.isActive
                              ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                          }
                        >
                          {type.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end items-center gap-1.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => router.push(`/admin/service-types/edit/${type._id}`)}
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() => setConfirmDeleteId(type._id)}
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
                      No service types found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
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
          <p>Are you sure you want to delete this service type? This action cannot be undone.</p>
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

