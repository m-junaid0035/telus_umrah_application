import { fetchAdditionalServiceByIdAction } from "@/actions/additionalServiceActions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface IAdditionalService {
  _id: string;
  name: string;
  description?: string;
  price: number;
  serviceType: "umrahVisa" | "transport" | "zaiarat" | "meals" | "esim";
  isActive: boolean;
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
}

const serviceTypeLabels: Record<string, string> = {
  umrahVisa: "Umrah Visa",
  transport: "Transport",
  zaiarat: "Zaiarat",
  meals: "Meals",
  esim: "E-SIM",
};

export default async function AdditionalServiceViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await fetchAdditionalServiceByIdAction(id);

  if (!result || result.error || !result.data) return notFound();

  const service = result.data as unknown as IAdditionalService;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-black">
            {service.name}
          </h2>
          <p className="text-sm text-black mt-1">
            Additional Service Details
          </p>
        </div>
        <Link href="/admin/additional-services">
          <Button variant="secondary">Back to Services</Button>
        </Link>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-3 text-black">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-black">Service Name</p>
              <p className="text-black text-lg font-medium">
                {service.name || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-black">Service Type</p>
              <p className="text-black text-lg font-medium">
                {service.serviceType ? serviceTypeLabels[service.serviceType] || service.serviceType : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-black">Price</p>
              <p className="text-black text-lg font-medium">
                {service.price ? `PKR ${service.price.toLocaleString()}` : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-black">Status</p>
              <p className="text-black text-lg font-medium">
                {service.isActive ? (
                  <span className="inline-block px-3 py-1 rounded text-sm font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                ) : (
                  <span className="inline-block px-3 py-1 rounded text-sm font-medium bg-red-100 text-red-800">
                    Inactive
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        {service.description && (
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-3 text-black">Description</h3>
            <p className="text-black whitespace-pre-wrap">
              {service.description}
            </p>
          </div>
        )}

        {/* Icon */}
        {service.icon && (
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-3 text-black">Icon</h3>
            <p className="text-black">
              {service.icon}
            </p>
          </div>
        )}

        {/* Timestamps */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-3 text-black">Timestamps</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {service.createdAt && (
              <div>
                <p className="text-sm text-black">Created At</p>
                <p className="text-black">
                  {new Date(service.createdAt).toLocaleString()}
                </p>
              </div>
            )}
            {service.updatedAt && (
              <div>
                <p className="text-sm text-black">Updated At</p>
                <p className="text-black">
                  {new Date(service.updatedAt).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link href={`/admin/additional-services/edit/${service._id}`}>
            <Button>Edit Service</Button>
          </Link>
          <Link href="/admin/additional-services">
            <Button variant="outline">Back to List</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

