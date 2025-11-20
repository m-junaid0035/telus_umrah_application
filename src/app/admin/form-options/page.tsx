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
  fetchAllFormOptionsAction,
  deleteFormOptionAction,
} from "@/actions/formOptionActions";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Loader2, MapPin, Plane, Globe } from "lucide-react";
import { FormOptionType } from "@/models/FormOption";

interface IFormOption {
  _id: string;
  type: string;
  name: string;
  value: string;
  displayOrder: number;
  isActive: boolean;
  logo?: string;
  createdAt: string;
}

function FormOptionsTable({
  options,
  onEdit,
  onDelete,
  loading,
  typeFilter,
}: {
  options: IFormOption[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  loading: boolean;
  typeFilter?: string;
}) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading options...
      </div>
    );
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case FormOptionType.FromCity:
        return "From City";
      case FormOptionType.ToCity:
        return "To City";
      case FormOptionType.Airline:
        return "Airline";
      case FormOptionType.AirlineClass:
        return "Airline Class";
      case FormOptionType.Nationality:
        return "Nationality";
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case FormOptionType.FromCity:
        return "bg-blue-100 text-blue-800";
      case FormOptionType.ToCity:
        return "bg-green-100 text-green-800";
      case FormOptionType.Airline:
        return "bg-purple-100 text-purple-800";
      case FormOptionType.AirlineClass:
        return "bg-orange-100 text-orange-800";
      case FormOptionType.Nationality:
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredOptions = typeFilter
    ? options.filter((opt) => opt.type === typeFilter)
    : options;

  if (filteredOptions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No form options found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-muted">
            <TableHead>Type</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[150px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOptions.map((option) => (
            <TableRow
              key={option._id}
              className="hover:bg-muted/40 transition-colors"
            >
              <TableCell>
                <Badge className={getTypeColor(option.type)}>
                  {getTypeLabel(option.type)}
                </Badge>
              </TableCell>
              <TableCell className="font-medium">{option.name}</TableCell>
              <TableCell>{option.value}</TableCell>
              <TableCell>{option.displayOrder}</TableCell>
              <TableCell>
                <Badge
                  className={
                    option.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }
                >
                  {option.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex justify-end items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(option._id)}
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    onClick={() => onDelete(option._id)}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function FormOptionsPage() {
  const router = useRouter();
  const [options, setOptions] = useState<IFormOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const pageSize = 10;

  const [optimisticOptions, deleteOptimistic] = useOptimistic(
    options,
    (state, id: string) => state.filter((opt) => opt._id !== id)
  );

  const loadOptions = async () => {
    setLoading(true);
    const result = await fetchAllFormOptionsAction();
    if (result?.data && Array.isArray(result.data)) {
      setOptions(result.data);
    } else {
      toast({
        title: "Error",
        description: result?.error?.message?.[0] || "Failed to fetch form options",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    startTransition(() => {
      deleteOptimistic(id);
    });

    const result = await deleteFormOptionAction(id);
    if (result?.error) {
      toast({
        title: "Error",
        description: result.error.message?.[0] || "Failed to delete option",
        variant: "destructive",
      });
      await loadOptions();
    } else {
      setOptions((prev) => prev.filter((option) => option._id !== id));
      toast({
        title: "Deleted",
        description: "Form option deleted successfully.",
      });
    }
  };

  useEffect(() => {
    loadOptions();
  }, []);

  const filteredOptions = optimisticOptions.filter(
    (option) => {
      const matchesSearch = search === "" || 
        option.name.toLowerCase().includes(search.toLowerCase()) ||
        option.value.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "" || typeFilter === "all" || option.type === typeFilter;
      return matchesSearch && matchesType;
    }
  );

  const totalPages = Math.ceil(filteredOptions.length / pageSize);
  const paginatedOptions = filteredOptions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <CardTitle className="text-lg font-semibold">Form Options</CardTitle>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Select value={typeFilter || "all"} onValueChange={(value) => setTypeFilter(value === "all" ? "" : value)}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value={FormOptionType.FromCity}>From Cities</SelectItem>
              <SelectItem value={FormOptionType.ToCity}>To Cities</SelectItem>
              <SelectItem value={FormOptionType.Airline}>Airlines</SelectItem>
              <SelectItem value={FormOptionType.AirlineClass}>Airline Classes</SelectItem>
              <SelectItem value={FormOptionType.Nationality}>Nationalities</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Search options..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-[200px]"
          />
          <Button
            onClick={() => router.push("/admin/form-options/new")}
            className="w-full md:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Option
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<div>Loading...</div>}>
          <FormOptionsTable
            options={paginatedOptions}
            onEdit={(id) => router.push(`/admin/form-options/edit/${id}`)}
            onDelete={(id) => setConfirmDeleteId(id)}
            loading={loading}
            typeFilter={typeFilter || undefined}
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

        <Dialog
          open={confirmDeleteId !== null}
          onOpenChange={(open) => !open && setConfirmDeleteId(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete this form option? This action cannot be undone.</p>
            <DialogFooter>
              <Button
                variant="secondary"
                onClick={() => setConfirmDeleteId(null)}
              >
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
      </CardContent>
    </Card>
  );
}

