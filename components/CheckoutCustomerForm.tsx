"use client";

interface CheckoutFormData {
  name: string;
  phone: string;
  address: string;
  city: string;
}

interface CheckoutCustomerFormProps {
  formData: CheckoutFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  deliveryOption: "inside" | "outside";
  onDeliveryChange: (option: "inside" | "outside") => void;
  paymentMethod: "cod" | "sslcommerz";
  onPaymentChange: (method: "cod" | "sslcommerz") => void;
}

export default function CheckoutCustomerForm({
  formData,
  onInputChange,
  deliveryOption,
  onDeliveryChange,
  paymentMethod,
  onPaymentChange,
}: CheckoutCustomerFormProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Information</h2>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={onInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your phone number"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address *
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={onInputChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your full address"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City *
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={onInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your city"
            required
          />
        </div>
      </div>

      {/* Delivery Options */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Option</h2>

        <div className="space-y-3">
          <div
            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${
              deliveryOption === "inside" ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
            onClick={() => onDeliveryChange("inside")}
          >
            <div className="flex items-center">
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                  deliveryOption === "inside" ? "border-blue-500" : "border-gray-400"
                }`}
              >
                {deliveryOption === "inside" && (
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">Inside Dhaka</p>
                <p className="text-sm text-gray-500">Standard delivery</p>
              </div>
            </div>
            <span className="font-semibold text-gray-900">৳60</span>
          </div>

          <div
            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${
              deliveryOption === "outside" ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
            onClick={() => onDeliveryChange("outside")}
          >
            <div className="flex items-center">
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                  deliveryOption === "outside" ? "border-blue-500" : "border-gray-400"
                }`}
              >
                {deliveryOption === "outside" && (
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">Outside Dhaka</p>
                <p className="text-sm text-gray-500">Extended delivery</p>
              </div>
            </div>
            <span className="font-semibold text-gray-900">৳120</span>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment</h2>
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => onPaymentChange("cod")}
            className={`w-full flex items-center justify-between p-4 border rounded-lg text-left transition-colors ${
              paymentMethod === "cod" ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
          >
            <div>
              <p className="font-medium text-gray-900">Cash on delivery</p>
              <p className="text-sm text-gray-500">Pay when you receive your order</p>
            </div>
            <span
              className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 ${
                paymentMethod === "cod" ? "border-blue-500" : "border-gray-400"
              }`}
            >
              {paymentMethod === "cod" ? (
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500 block" />
              ) : null}
            </span>
          </button>
          <button
            type="button"
            onClick={() => onPaymentChange("sslcommerz")}
            className={`w-full flex items-center justify-between p-4 border rounded-lg text-left transition-colors ${
              paymentMethod === "sslcommerz" ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
          >
            <div>
              <p className="font-medium text-gray-900">SSLCommerz (card / mobile banking)</p>
              <p className="text-sm text-gray-500">Secure hosted checkout — requires server env keys</p>
            </div>
            <span
              className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 ${
                paymentMethod === "sslcommerz" ? "border-blue-500" : "border-gray-400"
              }`}
            >
              {paymentMethod === "sslcommerz" ? (
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500 block" />
              ) : null}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}