"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  fetchAllAirlinesAction,
  deleteAirlineAction,
} from "@/actions/airlineActions";
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

interface IAirline {
  _id: string;
  name: string;
  logo?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

export default function AirlinesPage() {
  const router = useRouter();
  const [airlines, setAirlines] = useState<IAirline[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const loadAirlines = async () => {
    setLoading(true);
    const result = await fetchAllAirlinesAction();
    if (result?.data && Array.isArray(result.data)) {
      setAirlines(result.data);
    } else {
      toast({
        title: "Error",
        description: result?.error?.message?.[0] || "Failed to fetch airlines",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const result = await deleteAirlineAction(id);
    if (result?.error) {
      toast({
        title: "Error",
        description: result.error.message?.[0] || "Failed to delete airline",
        variant: "destructive",
      });
      await loadAirlines();
    } else {
      setAirlines((prev) => prev.filter((airline) => airline._id !== id));
      toast({
        title: "Deleted",
        description: "Airline deleted successfully.",
      });
    }
  };

  useEffect(() => {
    loadAirlines();
  }, []);

  const filteredAirlines = airlines.filter((airline) =>
    airline.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <CardTitle className="text-lg font-semibold">Airlines</CardTitle>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Input
            placeholder="Search airlines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:w-64"
          />
          <Button onClick={() => router.push("/admin/airlines/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Airline
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Loading airlines...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-muted">
                  <TableHead>Logo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Display Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[150px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAirlines.length > 0 ? (
                  filteredAirlines.map((airline) => (
                    <TableRow key={airline._id} className="hover:bg-muted/40 transition-colors">
                      <TableCell>
                        {airline.logo ? (
                          <img
                            src={airline.logo}
                            alt={airline.name}
                            className="w-10 h-10 object-contain rounded border bg-white"
                          />
                        ) : (
                          <span className="text-sm text-muted-foreground">No logo</span>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{airline.name}</TableCell>
                      <TableCell>{airline.displayOrder}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            airline.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {airline.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end items-center gap-1.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => router.push(`/admin/airlines/edit/${airline._id}`)}
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() => setConfirmDeleteId(airline._id)}
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
                      No airlines found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={!!confirmDeleteId} onOpenChange={() => setConfirmDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this airline? This action cannot be undone.</p>
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
