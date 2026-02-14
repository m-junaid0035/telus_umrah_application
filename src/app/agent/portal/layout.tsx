import AgentLayout from "./agent_layout";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import "../../globals.css";
import "./agent-theme.css";

export const metadata = {
  title: "Agent Portal - Telus Umrah",
};

export default async function AgentPortalLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const agentToken = cookieStore.get("agentToken")?.value;

  if (!agentToken) {
    redirect("/agent/login");
  }

  return <AgentLayout>{children}</AgentLayout>;
}
