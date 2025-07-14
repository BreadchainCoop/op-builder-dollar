"use client";

import { CohortSelectionTabs } from "@/components/cohort-page-components/cohort-selection-tabs";
import { TopSection } from "@/components/cohort-page-components/top-section";

export default function CohortSelectionPage() {
  return (
    <div className="min-h-screen my-20 md:pt-20 pt-4 space-y-16">
      <div className="max-w-[760px] mx-auto px-4">
        <TopSection />
      </div>
      <div className="max-w-[1040px] mx-auto px-4">
        <CohortSelectionTabs />
      </div>
    </div>
  );
}
