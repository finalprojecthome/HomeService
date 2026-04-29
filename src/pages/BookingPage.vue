<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import BookingLayout from "../components/layouts/BookingLayout.vue";
import airBanner from "../assets/booking/airBanner.png";
import type { BreadcrumbItem } from "../components/ui/Breadcrumb.vue";
import type { StepperStep } from "../components/Stepper.vue";
import BookingStep1, {
  type SelectedSubService,
  type SubService,
} from "../features/booking/components/BookingStep1.vue";
import BookingStep2, {
  type BookingStep2Value,
} from "../features/booking/components/BookingStep2.vue";
import { useAddressStore, useCustomerOrdersStore } from "../stores";
import BookingStep3, {
  type BookingStep3Value,
} from "../features/booking/components/BookingStep3.vue";
import { fetchSubServices } from "../services/serviceApi";
import { createOrder } from "../services/orderApi";
import type { UserAddress } from "../types/user";

const route = useRoute();

const DEFAULT_BOOKING_SERVICE_ID = "33";
const DEFAULT_BOOKING_SERVICE_NAME = "ล้างแอร์";

function firstQueryValue(
  value: string | string[] | undefined | null,
): string | undefined {
  if (value == null || value === "") return undefined;
  return Array.isArray(value) ? value[0] : value;
}

const serviceId = computed(
  () =>
    firstQueryValue(route.query.serviceId as string | string[] | undefined) ??
    DEFAULT_BOOKING_SERVICE_ID,
);

const serviceName = computed(
  () =>
    firstQueryValue(
      route.query.serviceName as string | string[] | undefined,
    ) ?? DEFAULT_BOOKING_SERVICE_NAME,
);

const addressStore = useAddressStore();
const customerOrdersStore = useCustomerOrdersStore();

const subServices = ref<SubService[]>([]);

const selectedSubServices = ref<SelectedSubService[]>([]);

const breadcrumbItems = computed<BreadcrumbItem[]>(() => [
  { label: "บริการของเรา", clickable: true },
  { label: serviceName.value, active: true },
]);

const steps: StepperStep[] = [
  { id: "service", label: "เลือกรายการ" },
  { id: "info", label: "กรอกข้อมูล" },
  { id: "payment", label: "ชำระเงิน" },
];


const step2Value = ref<BookingStep2Value>({
  date: null as string | null,
  time: null as string | null,
  addressId: null,
});

function formatUserAddressLine(address: UserAddress): string {
  const locality =
    address.province.name === "กรุงเทพมหานคร"
      ? `แขวง${address.subDistrict.name}, เขต${address.district.name}`
      : `ตำบล${address.subDistrict.name}, อำเภอ${address.district.name}`;
  return `${address.addressDetail}, ${locality}, จังหวัด${address.province.name}, ${address.postCode}`;
}

const addressSummary = computed(() => {
  const selected = addressStore.addresses.find(
    (a) => a.id === step2Value.value.addressId
  );
  if (!selected) return "-";
  return formatUserAddressLine(selected);
});
function formatSummaryDate(value: string | null) {
  if (!value) return "-";

  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;

  return `${day}/${month}/${year}`;
}

const step2Errors = ref({
  date: "",
  time: "",
  addressId: "",
});

const step3Errors = ref({
  paymentMethod: "",
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
});

const currentStep = ref(0);

const totalPrice = computed(() =>
  selectedSubServices.value.reduce((sum, item) => sum + item.subtotal, 0)
);

const canGoNext = computed(() => {
  if (currentStep.value === 0) {
    return selectedSubServices.value.length > 0;
  }

  if (currentStep.value === 1) {
    return (
      !!step2Value.value.date &&
      !!step2Value.value.time &&
      step2Value.value.addressId != null &&
      addressStore.addresses.some((a) => a.id === step2Value.value.addressId)
    );
  }

  if (currentStep.value === 2) {
    if (step3Value.value.paymentMethod === "qr") {
      return true;
    }

    if (step3Value.value.paymentMethod === "credit-card") {
      return (
        !!step3Value.value.cardName.trim() &&
        !!step3Value.value.cardNumber.trim() &&
        !!step3Value.value.expiry.trim() &&
        !!step3Value.value.cvv.trim()
      );
    }

    return false;
  }

  return false;
});

const nextButtonText = computed(() => {
  if (currentStep.value === 2) return "ยืนยันการจอง";
  return "ดำเนินการต่อ";
});
const step3Value = ref<BookingStep3Value>({
  paymentMethod: "qr",
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
});
function handleBreadcrumbNavigate(index: number) {
  console.log("breadcrumb navigate:", index);
}

function handleStepChange(index: number) {
  console.log("step change:", index);
}

function handleBack() {
  if (currentStep.value > 0) {
    currentStep.value -= 1;
  }
}

async function handleNext() {
  if (currentStep.value === 0) {
    if (!canGoNext.value) return;
    currentStep.value = 1;
    return;
  }

  if (currentStep.value === 1) {
    const isValid = validateStep2();
    if (!isValid) return;
    currentStep.value = 2;
    return;
  }
  if (currentStep.value === 2) {
  const isValid = validateStep3();
  if (!isValid) return;

  const selectedAddress = addressStore.addresses.find(
    (a) => a.id === step2Value.value.addressId
  );
  if (!selectedAddress) {
    console.error("ไม่พบที่อยู่ที่เลือก");
    return;
  }

  const payload = {
    addressDetail: selectedAddress.addressDetail,
    subDistrictId: selectedAddress.subDistrict.id,
    latitude: selectedAddress.latitude,
    longitude: selectedAddress.longitude,
    scheduledAt: `${step2Value.value.date}T${step2Value.value.time}:00Z`,
    items: selectedSubServices.value.map((item) => ({
      serviceName: item.name,
      quantity: item.quantity,
      pricePerUnit: item.price,
    })),
  };

  try {
    const orderId = await createOrder(payload);

    console.log("orderId:", orderId);

    customerOrdersStore.invalidateAfterNewOrder();

    alert("จองสำเร็จ: " + orderId);
  } catch (error) {
    console.error("create order failed:", error);
  }
}
}

function validateStep2() {
  step2Errors.value = {
    date: "",
    time: "",
    addressId: "",
  };

  let isValid = true;

  if (!step2Value.value.date) {
    step2Errors.value.date = "กรุณาเลือกวันที่";
    isValid = false;
  }

  if (!step2Value.value.time) {
    step2Errors.value.time = "กรุณาเลือกเวลา";
    isValid = false;
  }

  if (
    step2Value.value.addressId == null ||
    !addressStore.addresses.some((a) => a.id === step2Value.value.addressId)
  ) {
    step2Errors.value.addressId = "กรุณาเลือกที่อยู่";
    isValid = false;
  }

  return isValid;
}
function validateStep3() {
  step3Errors.value = {
    paymentMethod: "",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  };

  let isValid = true;

  if (!step3Value.value.paymentMethod) {
    step3Errors.value.paymentMethod = "กรุณาเลือกวิธีการชำระเงิน";
    return false;
  }

  if (step3Value.value.paymentMethod === "credit-card") {
    if (!step3Value.value.cardName.trim()) {
      step3Errors.value.cardName = "กรุณากรอกชื่อบนบัตร";
      isValid = false;
    }

    if (!/^\d{16}$/.test(step3Value.value.cardNumber)) {
      step3Errors.value.cardNumber = "หมายเลขบัตรต้องเป็นตัวเลข 16 หลัก";
      isValid = false;
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(step3Value.value.expiry)) {
      step3Errors.value.expiry = "รูปแบบต้องเป็น MM/YY";
      isValid = false;
    } else {
      const [month, year] = step3Value.value.expiry.split("/");
      const expDate = new Date(Number("20" + year), Number(month));
      const now = new Date();

      if (expDate <= now) {
        step3Errors.value.expiry = "บัตรหมดอายุแล้ว";
        isValid = false;
      }
    }

    if (!/^\d{3,4}$/.test(step3Value.value.cvv)) {
      step3Errors.value.cvv = "CVV ต้องเป็นตัวเลข 3 หรือ 4 หลัก";
      isValid = false;
    }
  }

  return isValid;
}
async function loadSubServicesForBooking() {
  try {
    const services = await fetchSubServices(serviceId.value);

    subServices.value = services.map((item) => ({
      id: String(item.id),
      name: item.name,
      price: item.pricePerUnit,
      unitLabel: item.unit,
      summaryLabel: "รายการ",
    }));
  } catch (error) {
    console.error("โหลดข้อมูลไม่สำเร็จ", error);
  }
}

onMounted(() => {
  void loadSubServicesForBooking();
});

watch(serviceId, () => {
  selectedSubServices.value = [];
  currentStep.value = 0;
  void loadSubServicesForBooking();
});
</script>

<template>
   <BookingLayout
    :banner-image="airBanner"
    :banner-alt="serviceName"
    :breadcrumb-items="breadcrumbItems"
    :steps="steps"
    :active-step= "currentStep"
    @breadcrumb-navigate="handleBreadcrumbNavigate"
    @step-change="handleStepChange"
  >
      <BookingStep1
        v-if="currentStep === 0"
        :service-name="serviceName"
        :sub-services="subServices"
        v-model="selectedSubServices"
      />
      <BookingStep2
        v-else-if="currentStep === 1"
        v-model="step2Value"
        :errors="step2Errors"
      />

      <BookingStep3
        v-else-if="currentStep === 2"
        v-model="step3Value"
        :errors="step3Errors"
      />
  

    <template #summary>
      <div class="rounded-2xl bg-white p-6 shadow-sm">
        <h3 class="mb-4 text-lg font-semibold text-gray-900">สรุปรายการ</h3>

        <!-- รายการบริการ -->
        <div v-if="selectedSubServices.length > 0" class="space-y-4">
          <div
            v-for="item in selectedSubServices"
            :key="item.id"
            class="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0"
          >
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="font-medium text-gray-900">{{ item.name }}</p>
                <p class="mt-1 text-sm text-gray-500">
                  {{ item.quantity }} {{ item.summaryLabel ?? "รายการ" }}
                </p>
              </div>

              <p class="whitespace-nowrap font-semibold text-gray-900">
                {{ item.subtotal }} บาท
              </p>
            </div>
          </div>
        </div>

        <p v-else class="text-sm text-gray-500">
          กรุณาเลือกรายการบริการ
        </p>

        <!-- วัน / เวลา / สถานที่ -->
        <div
          v-if="currentStep >= 1"
          class="mt-6 space-y-3 border-t border-gray-100 pt-4"
        >
          <div class="flex items-start justify-between gap-4">
            <span class="text-sm text-gray-500">วันที่</span>
            <span class="text-right text-sm font-medium text-gray-900">
              {{ formatSummaryDate(step2Value.date) }}
            </span>
          </div>

          <div class="flex items-start justify-between gap-4">
            <span class="text-sm text-gray-500">เวลา</span>
            <span class="text-right text-sm font-medium text-gray-900">
              {{ step2Value.time || "-" }}
            </span>
          </div>

          <div class="flex items-start justify-between gap-4">
            <span class="text-sm text-gray-500">สถานที่</span>
            <span class="text-right text-sm font-medium text-gray-900">
              {{ addressSummary }}
            </span>
          </div>
        </div>

        <!-- รวม -->
        <div class="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
          <span class="text-base font-semibold text-gray-900">รวม</span>
          <span class="text-lg font-bold text-gray-900">
            {{ totalPrice }} บาท
          </span>
        </div>
      </div>
    </template>

    <template #footer-left>
      <button
        type="button"
        class="rounded-xl border border-gray-300 px-6 py-3 text-gray-700 transition hover:bg-gray-50"
        @click="handleBack"
      >
        &lt; ย้อนกลับ
      </button>
    </template>

    <template #footer-right>
      <button
        type="button"
        class="rounded-xl px-6 py-3 text-white transition"
        :class="
          canGoNext
            ? 'bg-blue-600 hover:bg-blue-700'
            : 'cursor-not-allowed bg-gray-300'
        "
        :disabled="!canGoNext"
        @click="handleNext"
      >
        {{nextButtonText}} &gt;
      </button>
    </template>
  </BookingLayout>
</template>