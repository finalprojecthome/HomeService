<script setup lang="ts">
import { Form, type SubmissionHandler } from "vee-validate";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { DropdownOption } from "../ui/Dropdown.vue";
import { DropdownForm, InputForm, MapForm } from "../form";
import ActionButton from "../ui/ActionButton.vue";
import addressApi from "../../services/api/address";
import userApi from "../../services/api/user";
import { useAddressStore } from "../../stores";
import type { District, Province, SubDistrict } from "../../types/address";
import type { AddressPayload } from "../../types/user";
import { showCustomToast } from "../../utils/toast";
import { MAX_ADDRESS_COUNT } from "../../constants/address";

interface Props {
  mode: "add" | "edit";
}

interface AddressFormValues {
  addressName: string;
  addressDetail: string;
  subDistrictId: number | string | null;
  latitude: number | string | null;
  longitude: number | string | null;
}

const props = defineProps<Props>();
const route = useRoute();
const router = useRouter();
const addressStore = useAddressStore();

const isSubmitting = ref(false);
const provinces = ref<Province[]>([]);
const districts = ref<District[]>([]);
const subDistricts = ref<SubDistrict[]>([]);
const selectedProvinceId = ref<number | null>(null);
const selectedDistrictId = ref<number | null>(null);
const mapDefaultCenter = ref<[number, number]>([13.7563, 100.5018]);
const defaultAddressName = ref("");
const defaultAddressDetail = ref("");
const defaultProvinceId = ref<number | null>(null);
const defaultDistrictId = ref<number | null>(null);
const defaultSubDistrictId = ref<number | null>(null);
const defaultPostCode = ref("");
const defaultLatitude = ref<number | null>(null);
const defaultLongitude = ref<number | null>(null);
const isFormReady = ref(props.mode !== "edit");
const initialValues = computed(() => ({
  addressName: defaultAddressName.value,
  addressDetail: defaultAddressDetail.value,
  provinceId: defaultProvinceId.value,
  districtId: defaultDistrictId.value,
  subDistrictId: defaultSubDistrictId.value,
  postCode: defaultPostCode.value,
  latitude: defaultLatitude.value,
  longitude: defaultLongitude.value,
}));

const editAddressId = computed(() => {
  if (props.mode !== "edit") {
    return null;
  }
  const id = Number.parseInt(String(route.params.id), 10);
  return Number.isNaN(id) ? null : id;
});

const provinceOptions = computed<DropdownOption[]>(() =>
  provinces.value.map((province) => ({
    label: province.name,
    value: province.id,
  })),
);

const districtOptions = computed<DropdownOption[]>(() =>
  districts.value.map((district) => ({
    label: district.name,
    value: district.id,
  })),
);

const subDistrictOptions = computed<DropdownOption[]>(() =>
  subDistricts.value.map((subDistrict) => ({
    label: subDistrict.name,
    value: subDistrict.id,
  })),
);

const isDistrictDisabled = computed(() => selectedProvinceId.value == null);
const isSubDistrictDisabled = computed(() => selectedDistrictId.value == null);

const handleProvinceChange = async (
  provinceId: string | number | null,
  setFieldValue: (
    field: string,
    value: unknown,
    shouldValidate?: boolean,
  ) => void,
) => {
  const parsedProvinceId =
    provinceId == null ? null : Number.parseInt(String(provinceId), 10);

  selectedProvinceId.value = parsedProvinceId;
  selectedDistrictId.value = null;
  districts.value = [];
  subDistricts.value = [];

  setFieldValue("districtId", null, false);
  setFieldValue("subDistrictId", null, false);
  setFieldValue("postCode", "", false);

  if (parsedProvinceId == null || Number.isNaN(parsedProvinceId)) {
    return;
  }

  try {
    districts.value = await addressApi.getDistricts(parsedProvinceId);
  } catch {
    showCustomToast({
      variant: "error",
      title: "เกิดข้อผิดพลาด",
      description: `ไม่สามารถโหลด${
        parsedProvinceId === 10 ? "เขต" : "อำเภอ"
      }ได้`,
    });
  }
};

const handleDistrictChange = async (
  districtId: string | number | null,
  setFieldValue: (
    field: string,
    value: unknown,
    shouldValidate?: boolean,
  ) => void,
) => {
  const parsedDistrictId =
    districtId == null ? null : Number.parseInt(String(districtId), 10);

  selectedDistrictId.value = parsedDistrictId;
  subDistricts.value = [];

  setFieldValue("subDistrictId", null, false);
  setFieldValue("postCode", "", false);

  if (parsedDistrictId == null || Number.isNaN(parsedDistrictId)) {
    return;
  }

  try {
    subDistricts.value = await addressApi.getSubDistricts(parsedDistrictId);
  } catch {
    showCustomToast({
      variant: "error",
      title: "เกิดข้อผิดพลาด",
      description: `ไม่สามารถโหลด${
        String(parsedDistrictId).startsWith("10") ? "แขวง" : "ตำบล"
      }ได้`,
    });
  }
};

const handleSubDistrictChange = (
  subDistrictId: string | number | null,
  setFieldValue: (
    field: string,
    value: unknown,
    shouldValidate?: boolean,
  ) => void,
) => {
  const parsedSubDistrictId =
    subDistrictId == null ? null : Number.parseInt(String(subDistrictId), 10);

  if (parsedSubDistrictId == null || Number.isNaN(parsedSubDistrictId)) {
    setFieldValue("postCode", "", false);
    mapDefaultCenter.value = [13.7563, 100.5018];
    return;
  }

  const selectedSubDistrict = subDistricts.value.find(
    (subDistrict) => subDistrict.id === parsedSubDistrictId,
  );

  setFieldValue(
    "postCode",
    selectedSubDistrict?.postCode?.toString() ?? "",
    false,
  );

  if (
    selectedSubDistrict?.latitude != null &&
    selectedSubDistrict?.longitude != null
  ) {
    mapDefaultCenter.value = [
      selectedSubDistrict.latitude,
      selectedSubDistrict.longitude,
    ];
  }
};

onMounted(async () => {
  try {
    provinces.value = await addressApi.getProvinces();

    if (props.mode === "add") {
      await addressStore.fetchAddresses();
      if (addressStore.addresses.length >= MAX_ADDRESS_COUNT) {
        showCustomToast({
          variant: "error",
          title: "ไม่สามารถเพิ่มที่อยู่ได้",
          description: `เพิ่มที่อยู่ได้สูงสุด ${MAX_ADDRESS_COUNT} รายการ`,
        });
        await router.replace("/address");
        return;
      }
      isFormReady.value = true;
      return;
    }

    if (editAddressId.value == null) {
      isFormReady.value = true;
      return;
    }

    await addressStore.fetchAddresses();
    const selectedAddress = addressStore.addresses.find(
      (address) => address.id === editAddressId.value,
    );

    if (!selectedAddress) {
      showCustomToast({
        variant: "error",
        title: "ไม่พบข้อมูลที่อยู่",
        description: "ไม่สามารถแก้ไขที่อยู่นี้ได้",
      });
      await router.replace("/address");
      return;
    }

    defaultAddressName.value = selectedAddress.addressName;
    defaultAddressDetail.value = selectedAddress.addressDetail;
    defaultProvinceId.value = selectedAddress.province.id;
    defaultDistrictId.value = selectedAddress.district.id;
    defaultSubDistrictId.value = selectedAddress.subDistrict.id;
    defaultPostCode.value = selectedAddress.postCode.toString();
    defaultLatitude.value = selectedAddress.latitude;
    defaultLongitude.value = selectedAddress.longitude;

    selectedProvinceId.value = selectedAddress.province.id;
    selectedDistrictId.value = selectedAddress.district.id;

    districts.value = await addressApi.getDistricts(
      selectedAddress.province.id,
    );
    subDistricts.value = await addressApi.getSubDistricts(
      selectedAddress.district.id,
    );

    mapDefaultCenter.value = [
      selectedAddress.latitude,
      selectedAddress.longitude,
    ];
    isFormReady.value = true;
  } catch {
    showCustomToast({
      variant: "error",
      title: "เกิดข้อผิดพลาด",
      description: "ไม่สามารถโหลดข้อมูลได้",
    });
    await router.replace("/address");
  }
});

const handleSubmit: SubmissionHandler = async (formValues) => {
  const values = formValues as AddressFormValues;
  const parsedSubDistrictId = Number(values.subDistrictId);
  const parsedLatitude = Number(values.latitude);
  const parsedLongitude = Number(values.longitude);

  if (
    Number.isNaN(parsedSubDistrictId) ||
    Number.isNaN(parsedLatitude) ||
    Number.isNaN(parsedLongitude)
  ) {
    showCustomToast({
      variant: "error",
      title: "ข้อมูลไม่ถูกต้อง",
      description: "กรุณาตรวจสอบตำแหน่งและข้อมูลที่อยู่",
    });
    return;
  }

  const payload: AddressPayload = {
    addressName: values.addressName,
    addressDetail: values.addressDetail,
    subDistrictId: parsedSubDistrictId,
    latitude: parsedLatitude,
    longitude: parsedLongitude,
  };

  isSubmitting.value = true;
  try {
    const currentEditAddressId = editAddressId.value;
    if (props.mode === "edit" && currentEditAddressId == null) {
      showCustomToast({
        variant: "error",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่พบข้อมูลที่อยู่",
      });
      await router.replace("/address");
      return;
    }

    let response;
    if (props.mode === "add") {
      response = await userApi.createAddress(payload);
    } else {
      if (currentEditAddressId == null) {
        throw new Error();
      }
      response = await userApi.updateAddress(currentEditAddressId, payload);
    }
    showCustomToast({
      variant: "success",
      title: "สำเร็จ",
      description: response.message,
    });
    await router.replace("/address");
    await addressStore.fetchAddresses(true);
  } catch {
    showCustomToast({
      variant: "error",
      title: `ไม่สามารถ${props.mode === "add" ? "เพิ่ม" : "แก้ไข"}ที่อยู่ได้`,
      description: "กรุณาลองใหม่อีกครั้ง",
    });
  } finally {
    isSubmitting.value = false;
  }
};

const handleDeleteAddress = async () => {
  const currentEditAddressId = editAddressId.value;
  if (props.mode !== "edit" || currentEditAddressId == null) {
    showCustomToast({
      variant: "error",
      title: "เกิดข้อผิดพลาด",
      description: "ไม่พบข้อมูลที่อยู่",
    });
    await router.replace("/address");
    return;
  }

  const isConfirmed = window.confirm("ยืนยันการลบที่อยู่นี้ใช่หรือไม่");
  if (!isConfirmed) {
    return;
  }

  isSubmitting.value = true;
  try {
    const response = await userApi.deleteAddress(currentEditAddressId);
    showCustomToast({
      variant: "success",
      title: "สำเร็จ",
      description: response.message,
    });
    await router.replace("/address");
    await addressStore.fetchAddresses(true);
  } catch {
    showCustomToast({
      variant: "error",
      title: "ไม่สามารถลบที่อยู่ได้",
      description: "กรุณาลองใหม่อีกครั้ง",
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <h2 class="style-headline-2 mb-4">
    {{ `${mode === "add" ? "เพิ่ม" : "แก้ไข"}ที่อยู่` }}
  </h2>
  <Form
    v-if="isFormReady"
    :initial-values="initialValues"
    @submit="handleSubmit"
    v-slot="{ setFieldValue }"
  >
    <fieldset :disabled="isSubmitting">
      <section class="flex flex-col items-end gap-10">
        <article class="flex flex-col w-full gap-5">
          <InputForm
            name="addressName"
            label="ชื่อของที่อยู่"
            :value="defaultAddressName"
            type="text"
            placeholder="กรุณากรอกชื่อของที่อยู่"
            class="max-w-70"
            rules="addressName"
            required
          />
          <InputForm
            name="addressDetail"
            label="ที่อยู่"
            :value="defaultAddressDetail"
            type="text"
            placeholder="กรุณากรอกที่อยู่"
            autocomplete="address-line1"
            rules="addressDetail"
            required
          />
          <div
            class="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2"
          >
            <DropdownForm
              name="provinceId"
              label="จังหวัด"
              placeholder="เลือกจังหวัด"
              :value="defaultProvinceId"
              :options="provinceOptions"
              @update:modelValue="
                (provinceId) => handleProvinceChange(provinceId, setFieldValue)
              "
              required
            />
            <DropdownForm
              name="districtId"
              label="เขต / อำเภอ"
              placeholder="เลือกเขต / อำเภอ"
              :value="defaultDistrictId"
              :options="districtOptions"
              :disabled="isDistrictDisabled"
              @update:modelValue="
                (districtId) => handleDistrictChange(districtId, setFieldValue)
              "
              required
            />
            <DropdownForm
              name="subDistrictId"
              label="แขวง / ตำบล"
              placeholder="เลือกแขวง / ตำบล"
              :value="defaultSubDistrictId"
              :options="subDistrictOptions"
              :disabled="isSubDistrictDisabled"
              @update:modelValue="
                (subDistrictId) =>
                  handleSubDistrictChange(subDistrictId, setFieldValue)
              "
              required
            />
            <InputForm
              name="postCode"
              label="รหัสไปรษณีย์"
              :value="defaultPostCode"
              type="text"
              placeholder="กรุณากรอกรหัสไปรษณีย์"
              disabled
              required
            />
          </div>
          <MapForm
            :default-center="mapDefaultCenter"
            class="sm:h-70 md:h-80 lg:h-100 xl:h-120"
            required
          />
        </article>
        <div class="flex gap-4">
          <ActionButton
            v-if="props.mode === 'edit'"
            type="button"
            variant="secondary"
            @click="handleDeleteAddress"
          >
            ลบที่อยู่
          </ActionButton>
          <ActionButton type="submit" class="w-fit">
            {{ mode === "add" ? "เพิ่มที่อยู่ใหม่" : "แก้ไขที่อยู่" }}
          </ActionButton>
        </div>
      </section>
    </fieldset>
  </Form>
  <section v-else class="p-4 bg-white rounded-lg style-card-box">
    <p class="style-body-2 text-gray-700">กำลังโหลดข้อมูลที่อยู่...</p>
  </section>
</template>
