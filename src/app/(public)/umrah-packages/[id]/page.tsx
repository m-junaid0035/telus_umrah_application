"use client";
import { PackageDetailsPage } from "@/components/PackageDetailsPage";
import { use } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <PackageDetailsPage id = {id}/>
  );
}