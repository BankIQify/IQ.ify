import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { WebhookDataEditor } from "@/components/webhooks/WebhookDataEditor";

const WebhookDataPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "data_input") {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Webhook Data Editor</h1>
      <WebhookDataEditor />
    </div>
  );
};

export default WebhookDataPage; 