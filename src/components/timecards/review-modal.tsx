"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  timecardId: string | null;
  onSubmit: (action: string, comment: string) => Promise<void>;
}

const REVIEW_OPTIONS = [
  {
    value: "REVIEWED",
    label: "Mark as Reviewed",
    description: "Flag as reviewed but keep in queue for further action.",
  },
  {
    value: "APPROVED",
    label: "Approve Timecard",
    description:
      "Approve the timecard. Payment due date will be calculated based on payment terms.",
  },
  {
    value: "BYPASS_TO_FINAL",
    label: "Approve & Send to Payroll",
    description:
      "Approve and immediately send to payroll for processing.",
  },
  {
    value: "RETURNED_TO_CONTRACTOR",
    label: "Return to Contractor",
    description:
      "Send back to the contractor to fix issues (missing scene codes, incorrect hours, etc.).",
  },
];

export function TimecardReviewModal({
  open,
  onClose,
  timecardId,
  onSubmit,
}: ReviewModalProps) {
  const [selectedAction, setSelectedAction] = useState("REVIEWED");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!timecardId) return;
    setSubmitting(true);
    try {
      await onSubmit(selectedAction, comment);
      setSelectedAction("REVIEWED");
      setComment("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Review Timecard">
      <div className="space-y-4">
        {REVIEW_OPTIONS.map((option) => (
          <label
            key={option.value}
            className="flex items-start gap-3 cursor-pointer group"
          >
            <input
              type="radio"
              name="reviewAction"
              value={option.value}
              checked={selectedAction === option.value}
              onChange={() => setSelectedAction(option.value)}
              className="mt-1 h-4 w-4 text-sky-600 border-slate-300 focus:ring-sky-500"
            />
            <div>
              <span className="font-medium text-sm text-slate-900 group-hover:text-sky-700">
                {option.label}
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                {option.description}
              </p>
            </div>
          </label>
        ))}

        <div className="pt-2">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Comment (optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 resize-none"
            placeholder="Add a note about this review..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Saving..." : "Submit Review"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
