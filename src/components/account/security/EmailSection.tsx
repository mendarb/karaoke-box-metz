import { Button } from "@/components/ui/button";
import { EmailForm } from "./EmailForm";
import { useEmailUpdate } from "@/hooks/useEmailUpdate";

export const EmailSection = () => {
  const {
    newEmail,
    setNewEmail,
    showEmailInput,
    setShowEmailInput,
    isLoading,
    handleUpdateEmail,
    resetForm,
  } = useEmailUpdate();

  return (
    <div className="text-left">
      <h3 className="text-sm font-medium mb-2">Modifier votre email</h3>
      {showEmailInput ? (
        <EmailForm
          newEmail={newEmail}
          setNewEmail={setNewEmail}
          isLoading={isLoading}
          onSubmit={handleUpdateEmail}
          onCancel={resetForm}
        />
      ) : (
        <Button 
          variant="outline" 
          onClick={() => setShowEmailInput(true)}
          className="bg-white/50 backdrop-blur-sm border-gray-200"
        >
          Changer d'email
        </Button>
      )}
    </div>
  );
};