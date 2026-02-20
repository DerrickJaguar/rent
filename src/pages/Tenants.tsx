"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Mail,
  Calendar,
  Download,
  Bell,
  CheckCircle,
  AlertTriangle,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { toast } from "sonner";
import { format } from "date-fns";
import jsPDF from "jspdf";

type Tenant = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  leaseEndDate: Date;
  rentAmount: number;
  createdAt: Date;
  updatedAt: Date;
};

export default function Tenants() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [filteredTenants, setFilteredTenants] = useState<Tenant[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTenants, setSelectedTenants] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    leaseEndDate: "",
    rentAmount: 0,
  });

  // loading section

  const loadTenants = useCallback(() => {
    const data = JSON.parse(localStorage.getItem("tenants") || "[]");

    const parsed = data.map((t: any) => ({
      ...t,
      leaseEndDate: new Date(t.leaseEndDate),
      createdAt: new Date(t.createdAt),
      updatedAt: new Date(t.updatedAt),
    }));

    setTenants(parsed);
  }, []);

  useEffect(() => {
    loadTenants();
  }, [loadTenants]);

  useEffect(() => {
    const filtered = tenants.filter((t) =>
      `${t.firstName} ${t.lastName} ${t.email}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredTenants(filtered);
  }, [tenants, searchTerm]);

  const saveTenants = (data: Tenant[]) => {
    localStorage.setItem("tenants", JSON.stringify(data));
  };

  // creating updating retrieving and deleting

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error("Please fill required fields");
      return;
    }

    if (editingTenant) {
      const updated = tenants.map((t) =>
        t.id === editingTenant.id
          ? {
              ...t,
              ...formData,
              leaseEndDate: new Date(formData.leaseEndDate),
              updatedAt: new Date(),
            }
          : t
      );

      saveTenants(updated);
      setTenants(updated);
      toast.success("Tenant updated");
    } else {
      const newTenant: Tenant = {
        id: Date.now().toString(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        leaseEndDate: new Date(formData.leaseEndDate),
        rentAmount: formData.rentAmount,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updated = [...tenants, newTenant];
      saveTenants(updated);
      setTenants(updated);
      toast.success("Tenant added");
    }

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      leaseEndDate: "",
      rentAmount: 0,
    });

    setEditingTenant(null);
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    const updated = tenants.filter((t) => t.id !== id);
    saveTenants(updated);
    setTenants(updated);
    toast.success("Tenant deleted");
  };

  const handleBulkDelete = () => {
    const updated = tenants.filter(
      (t) => !selectedTenants.includes(t.id)
    );
    saveTenants(updated);
    setTenants(updated);
    setSelectedTenants([]);
    toast.success("Selected tenants deleted");
  };

  // section for user buttons

  const sendRentReminders = () => {
    selectedTenants.forEach((id) => {
      const tenant = tenants.find((t) => t.id === id);
      if (tenant) {
        toast.success(`Reminder sent to ${tenant.firstName}`);
      }
    });
  };

  const markAllPaid = () => {
    toast.success("All selected tenants marked as paid");
  };

  const sendLeaseRenewals = () => {
    const today = new Date();

    tenants.forEach((tenant) => {
      const diff =
        (new Date(tenant.leaseEndDate).getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24);

      if (diff <= 30 && diff > 0) {
        toast.success(
          `Lease renewal notice sent to ${tenant.firstName}`
        );
      }
    });
  };

  const generateLateFees = () => {
    const today = new Date();

    tenants.forEach((tenant) => {
      if (new Date(tenant.leaseEndDate) < today) {
        toast.error(
          `Late fee notice generated for ${tenant.firstName}`
        );
      }
    });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Tenants Report", 10, 10);

    tenants.forEach((t, index) => {
      doc.text(
        `${t.firstName} ${t.lastName} - ${t.email}`,
        10,
        20 + index * 10
      );
    });

    doc.save("tenants-report.pdf");
  };

  const exportCSV = () => {
    const csv = tenants
      .map(
        (t) =>
          `${t.firstName},${t.lastName},${t.email},${format(
            new Date(t.leaseEndDate),
            "yyyy-MM-dd"
          )}`
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "tenants.csv";
    a.click();

    window.URL.revokeObjectURL(url);
  };

  // -----section for user interface

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-3xl font-bold">Tenants</h1>

        <div className="flex gap-2 flex-wrap">

          <Button variant="outline" onClick={sendRentReminders}>
            <Bell size={16} className="mr-2" />
            Send Rent Reminders
          </Button>

          <Button variant="outline" onClick={markAllPaid}>
            <CheckCircle size={16} className="mr-2" />
            Mark All Paid
          </Button>

          <Button variant="outline" onClick={sendLeaseRenewals}>
            <Mail size={16} className="mr-2" />
            Lease Renewal Notices
          </Button>

          <Button variant="outline" onClick={generateLateFees}>
            <AlertTriangle size={16} className="mr-2" />
            Generate Late Fees
          </Button>

          <Button variant="outline" onClick={exportCSV}>
            <Download size={16} className="mr-2" />
            Export CSV
          </Button>

          <Button variant="secondary" onClick={exportToPDF}>
            <FileText size={16} className="mr-2" />
            Export PDF
          </Button>

          {selectedTenants.length > 0 && (
            <Button variant="destructive" onClick={handleBulkDelete}>
              Delete Selected
            </Button>
          )}

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Tenant
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingTenant ? "Edit Tenant" : "Add Tenant"}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      firstName: e.target.value,
                    })
                  }
                />

                <Input
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lastName: e.target.value,
                    })
                  }
                />

                <Input
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                />

                <Input
                  type="date"
                  value={formData.leaseEndDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      leaseEndDate: e.target.value,
                    })
                  }
                />

                <Input
                  type="number"
                  placeholder="Rent Amount"
                  value={formData.rentAmount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rentAmount: Number(e.target.value),
                    })
                  }
                />

                <Button type="submit" className="w-full">
                  Save
                </Button>
              </form>
            </DialogContent>
          </Dialog>

        </div>
      </div>

      <Input
        placeholder="Search tenants..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="grid md:grid-cols-3 gap-4">
        {filteredTenants.map((tenant) => (
          <Card key={tenant.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  {tenant.firstName} {tenant.lastName}
                </CardTitle>

                <Checkbox
                  checked={selectedTenants.includes(tenant.id)}
                  onCheckedChange={() =>
                    setSelectedTenants((prev) =>
                      prev.includes(tenant.id)
                        ? prev.filter((id) => id !== tenant.id)
                        : [...prev, tenant.id]
                    )
                  }
                />
              </div>
            </CardHeader>

            <CardContent className="space-y-2">
              <div className="text-sm">{tenant.email}</div>
              <div className="text-sm">
                Lease Ends:{" "}
                {format(tenant.leaseEndDate, "MMM dd, yyyy")}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={() => {
                    setEditingTenant(tenant);
                    setFormData({
                      firstName: tenant.firstName,
                      lastName: tenant.lastName,
                      email: tenant.email,
                      leaseEndDate: format(
                        tenant.leaseEndDate,
                        "yyyy-MM-dd"
                      ),
                      rentAmount: tenant.rentAmount,
                    });
                    setIsDialogOpen(true);
                  }}
                >
                  <Edit className="mr-1 h-3 w-3" />
                  Edit
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(tenant.id)}
                >
                  <Trash2 className="mr-1 h-3 w-3" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}
