"use client";
import React, { createContext, useContext, useState } from "react";

export interface ContactDraftData {
  firstName?: string;
  lastName?: string;
  email?: string;
  message?: string;
}

interface ContactDraftContextType {
  draftData: ContactDraftData | null;
  setDraftData: (data: ContactDraftData | null) => void;
}

const ContactDraftContext = createContext<ContactDraftContextType | undefined>(
  undefined,
);

export function ContactDraftProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [draftData, setDraftData] = useState<ContactDraftData | null>(null);
  return (
    <ContactDraftContext.Provider value={{ draftData, setDraftData }}>
      {children}
    </ContactDraftContext.Provider>
  );
}

export function useContactDraft() {
  const context = useContext(ContactDraftContext);
  if (context === undefined) {
    throw new Error(
      "useContactDraft must be used within a ContactDraftProvider",
    );
  }
  return context;
}
