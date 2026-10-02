import mongoose from "mongoose";

/**
 * Payment — one record per checkout attempt against a plan.
 *
 * `status` mirrors Cashfree's order status, refreshed from their API whenever
 * the customer returns from checkout (never trusted from the client).
 */
const paymentSchema = new mongoose.Schema(
  {
    /** Our order id, also sent to Cashfree as order_id. */
    orderId: { type: String, required: true, unique: true, index: true },
    cfOrderId: { type: String, default: "" },
    paymentSessionId: { type: String, default: "" },

    businessSlug: { type: String, default: "", index: true },
    plan: { type: String, enum: ["basic", "domain", "custom"], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },

    /** The account that paid — payments are private to the payer. */
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },

    customerEmail: { type: String, default: "", index: true },
    customerName: { type: String, default: "" },
    customerPhone: { type: String, default: "" },

    status: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "CANCELLED", "EXPIRED", "REFUNDED"],
      default: "PENDING",
      index: true,
    },

    /** Filled in once Cashfree confirms a successful payment. */
    cfPaymentId: { type: String, default: "" },
    paymentMethod: { type: String, default: "" },
    paidAt: { type: Date, default: null },

    /**
     * Idempotency marker: one Cashfree order may add at most one subscription
     * term, no matter how many times its status endpoint is polled.
     */
    subscriptionApplied: { type: Boolean, default: false, index: true },
    subscriptionAppliedAt: { type: Date, default: null },

    /** Last raw order payload from Cashfree, for support/debugging. */
    raw: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

paymentSchema.index({ businessSlug: 1, status: 1, paidAt: 1 });

export const Payment = mongoose.model("Payment", paymentSchema);
